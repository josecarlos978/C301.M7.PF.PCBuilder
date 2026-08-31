import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CATEGORIA_POR_PASO, PASOS, type Paso } from "@/services/pcbuilder/constants";
import type { AtributosProducto, ProductoDTO } from "@/services/pcbuilder/types";
import type { ProductoFiltros, ProductoInput } from "./types";

type ProductoConAtributos = Prisma.ProductoGetPayload<{ include: { atributos: true } }>;

export function aDTO(producto: ProductoConAtributos): ProductoDTO {
  const atributos = producto.atributos.reduce<AtributosProducto>((mapa, attr) => {
    mapa[attr.clave] = attr.valor;
    return mapa;
  }, {});

  return {
    id: producto.id,
    nombre: producto.nombre,
    marca: producto.marca,
    precioVenta: producto.precioVenta,
    categoria: producto.categoria,
    subcategoria: producto.subcategoria,
    imagenUrl: producto.imagenUrl,
    activo: producto.activo,
    atributos,
  };
}

export async function listarProductos(filtros: ProductoFiltros = {}): Promise<ProductoDTO[]> {
  const where: Prisma.ProductoWhereInput = {};

  if (!filtros.incluirOcultos) {
    where.activo = true;
  }

  if (filtros.categoria) {
    where.categoria = filtros.categoria;
  }

  if (filtros.busca) {
    where.OR = [
      { nombre: { contains: filtros.busca } },
      { marca: { contains: filtros.busca } },
      { subcategoria: { contains: filtros.busca } },
    ];
  }

  const productos = await prisma.producto.findMany({
    where,
    include: { atributos: true },
    orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
  });

  return productos.map(aDTO);
}

export async function listarProductosPorPaso(paso: Paso): Promise<ProductoDTO[]> {
  return listarProductos({ categoria: CATEGORIA_POR_PASO[paso] });
}

export async function obtenerProducto(id: number): Promise<ProductoDTO | null> {
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { atributos: true },
  });
  return producto ? aDTO(producto) : null;
}

export async function crearProducto(input: ProductoInput): Promise<ProductoDTO> {
  const producto = await prisma.producto.create({
    data: {
      nombre: input.nombre,
      marca: input.marca,
      precioVenta: input.precioVenta,
      categoria: input.categoria,
      subcategoria: input.subcategoria,
      imagenUrl: input.imagenUrl,
      atributos: {
        create: Object.entries(input.atributos ?? {}).map(([clave, valor]) => ({ clave, valor })),
      },
    },
    include: { atributos: true },
  });
  return aDTO(producto);
}

export async function actualizarProducto(id: number, input: Partial<ProductoInput>): Promise<ProductoDTO | null> {
  const existente = await prisma.producto.findUnique({ where: { id }, include: { atributos: true } });
  if (!existente) return null;

  const { atributos, ...datosBasicos } = input;

  const producto = await prisma.$transaction(async (tx) => {
    if (atributos) {
      await tx.productoAtributo.deleteMany({ where: { productoId: id } });
      await tx.productoAtributo.createMany({
        data: Object.entries(atributos).map(([clave, valor]) => ({ productoId: id, clave, valor })),
      });
    }
    return tx.producto.update({
      where: { id },
      data: datosBasicos,
      include: { atributos: true },
    });
  });

  return aDTO(producto);
}

export async function importarProductos(inputs: ProductoInput[]): Promise<number> {
  await prisma.$transaction(
    inputs.map((input) =>
      prisma.producto.create({
        data: {
          nombre: input.nombre,
          marca: input.marca,
          precioVenta: input.precioVenta,
          categoria: input.categoria,
          subcategoria: input.subcategoria,
          imagenUrl: input.imagenUrl,
          atributos: {
            create: Object.entries(input.atributos ?? {}).map(([clave, valor]) => ({ clave, valor })),
          },
        },
      }),
    ),
  );
  return inputs.length;
}

export async function eliminarProducto(id: number): Promise<boolean> {
  const existente = await prisma.producto.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.producto.delete({ where: { id } });
  return true;
}

export function esPasoValido(valor: string): valor is Paso {
  return (PASOS as readonly string[]).includes(valor);
}
