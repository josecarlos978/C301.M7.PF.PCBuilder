import { prisma } from "@/lib/prisma";
import type {
  CotizacionesPorEstado,
  IngresosMes,
  ProductoCotizado,
  ReporteCompleto,
} from "./types";

const MESES_HISTORICO = 6;

function claveMes(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}`;
}

export function ultimosMeses(cantidad: number): string[] {
  const hoy = new Date();
  const meses: string[] = [];
  for (let i = cantidad - 1; i >= 0; i--) {
    meses.push(claveMes(new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)));
  }
  return meses;
}

async function cotizacionesPorEstado(): Promise<CotizacionesPorEstado[]> {
  const grupos = await prisma.cotizacion.groupBy({
    by: ["estado"],
    _count: { _all: true },
    orderBy: { estado: "asc" },
  });

  return grupos.map((g) => ({ estado: g.estado, cantidad: g._count._all }));
}

async function ingresosPorMes(): Promise<IngresosMes[]> {
  const cotizaciones = await prisma.cotizacion.findMany({
    select: { fecha: true, total: true, estado: true },
  });

  const porMes = new Map<string, IngresosMes>();
  for (const mes of ultimosMeses(MESES_HISTORICO)) {
    porMes.set(mes, { mes, cotizaciones: 0, confirmadas: 0, ingresos: 0 });
  }

  for (const c of cotizaciones) {
    const clave = claveMes(new Date(c.fecha));
    const fila = porMes.get(clave);
    if (!fila) continue;
    fila.cotizaciones += 1;
    if (c.estado === "Confirmada") {
      fila.confirmadas += 1;
      fila.ingresos += c.total;
    }
  }

  return [...porMes.values()];
}

async function topProductos(limite = 5): Promise<ProductoCotizado[]> {
  const detalles = await prisma.cotizacionDetalle.findMany({
    select: {
      productoId: true,
      cantidad: true,
      precioUnitario: true,
      producto: { select: { nombre: true, marca: true, categoria: true } },
    },
  });

  const acumulado = new Map<number, ProductoCotizado>();
  for (const d of detalles) {
    const actual = acumulado.get(d.productoId) ?? {
      productoId: d.productoId,
      nombre: d.producto.nombre,
      marca: d.producto.marca,
      categoria: d.producto.categoria,
      vecesCotizado: 0,
      unidades: 0,
      ingresoAsociado: 0,
    };
    actual.vecesCotizado += 1;
    actual.unidades += d.cantidad;
    actual.ingresoAsociado += d.cantidad * d.precioUnitario;
    acumulado.set(d.productoId, actual);
  }

  return [...acumulado.values()].sort((a, b) => b.unidades - a.unidades).slice(0, limite);
}

export async function generarReporte(): Promise<ReporteCompleto> {
  const [clientes, productos, totalCotizaciones, sumaTotales, porEstado, porMes, top] =
    await Promise.all([
      prisma.cliente.count(),
      prisma.producto.count(),
      prisma.cotizacion.count(),
      prisma.cotizacion.aggregate({ _sum: { total: true } }),
      cotizacionesPorEstado(),
      ingresosPorMes(),
      topProductos(),
    ]);

  const valorTotalCotizado = sumaTotales._sum.total ?? 0;

  return {
    generadoEn: new Date().toISOString(),
    mesesHistorico: MESES_HISTORICO,
    totales: {
      clientes,
      productos,
      cotizaciones: totalCotizaciones,
      valorTotalCotizado,
      ticketPromedio: totalCotizaciones > 0 ? valorTotalCotizado / totalCotizaciones : 0,
    },
    cotizacionesPorEstado: porEstado,
    ingresosPorMes: porMes,
    topProductos: top,
  };
}
