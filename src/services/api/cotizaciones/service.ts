import { prisma } from "@/lib/prisma";
import type { EstadoCotizacion } from "@/services/pcbuilder/constants";
import type { CotizacionFiltros, CotizacionInput } from "./types";

const INCLUDE_COMPLETO = {
  cliente: true,
  detalles: { include: { producto: true } },
} as const;

export async function listarCotizaciones(filtros: CotizacionFiltros = {}) {
  const where = {
    ...(filtros.clienteId !== undefined ? { clienteId: filtros.clienteId } : {}),
    ...(filtros.estado ? { estado: filtros.estado } : {}),
  };

  return prisma.cotizacion.findMany({
    where,
    include: INCLUDE_COMPLETO,
    orderBy: { fecha: "desc" },
  });
}

export async function obtenerCotizacion(id: number) {
  return prisma.cotizacion.findUnique({ where: { id }, include: INCLUDE_COMPLETO });
}

export async function crearCotizacion(input: CotizacionInput) {
  const productos = await prisma.producto.findMany({
    where: { id: { in: input.detalles.map((d) => d.productoId) } },
  });

  if (productos.length === 0) {
    throw new Error("No se encontraron productos válidos para la cotización");
  }

  const precioPorProducto = new Map(productos.map((p) => [p.id, p.precioVenta]));

  const total = input.detalles.reduce((suma, detalle) => {
    const precio = precioPorProducto.get(detalle.productoId);
    return precio === undefined ? suma : suma + precio * detalle.cantidad;
  }, 0);

  return prisma.cotizacion.create({
    data: {
      clienteId: input.clienteId,
      estado: input.estado ?? "Borrador",
      total,
      detalles: {
        create: input.detalles
          .filter((d) => precioPorProducto.has(d.productoId))
          .map((d) => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: precioPorProducto.get(d.productoId)!,
          })),
      },
    },
    include: INCLUDE_COMPLETO,
  });
}

export async function cambiarEstado(id: number, estado: EstadoCotizacion) {
  const existente = await prisma.cotizacion.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.cotizacion.update({ where: { id }, data: { estado }, include: INCLUDE_COMPLETO });
}

export async function eliminarCotizacion(id: number): Promise<boolean> {
  const existente = await prisma.cotizacion.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.cotizacion.delete({ where: { id } });
  return true;
}
