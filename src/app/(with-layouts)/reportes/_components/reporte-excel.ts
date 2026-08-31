import * as XLSX from "xlsx";
import type { ReporteCompleto } from "@/services/api/reportes/types";

export function descargarExcelReporte(reporte: ReporteCompleto) {
  const libro = XLSX.utils.book_new();
  const generadoEn = new Date(reporte.generadoEn).toLocaleString("es-ES");

  const resumen = XLSX.utils.aoa_to_sheet([
    ["Reporte de gestión — CyM"],
    [`Generado el ${generadoEn}`],
    [],
    ["Indicador", "Valor"],
    ["Clientes registrados", reporte.totales.clientes],
    ["Productos en inventario", reporte.totales.productos],
    ["Cotizaciones emitidas", reporte.totales.cotizaciones],
    ["Valor total cotizado", reporte.totales.valorTotalCotizado],
    ["Ticket promedio", reporte.totales.ticketPromedio],
  ]);
  resumen["!cols"] = [{ wch: 28 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(libro, resumen, "Resumen");

  const estados = XLSX.utils.json_to_sheet(
    reporte.cotizacionesPorEstado.map((c) => ({ Estado: c.estado, Cantidad: c.cantidad })),
  );
  estados["!cols"] = [{ wch: 18 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(libro, estados, "Por estado");

  const meses = XLSX.utils.json_to_sheet(
    reporte.ingresosPorMes.map((m) => ({
      Mes: m.mes,
      Cotizaciones: m.cotizaciones,
      Confirmadas: m.confirmadas,
      Ingresos: m.ingresos,
    })),
  );
  meses["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(libro, meses, "Ingresos por mes");

  const productos = XLSX.utils.json_to_sheet(
    reporte.topProductos.map((p, indice) => ({
      "#": indice + 1,
      Producto: p.nombre,
      Marca: p.marca,
      Categoría: p.categoria,
      Unidades: p.unidades,
      "Veces cotizado": p.vecesCotizado,
      "Ingreso asociado": p.ingresoAsociado,
    })),
  );
  productos["!cols"] = [
    { wch: 4 },
    { wch: 32 },
    { wch: 14 },
    { wch: 18 },
    { wch: 10 },
    { wch: 14 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(libro, productos, "Top productos");

  const fecha = new Date(reporte.generadoEn).toISOString().slice(0, 10);
  XLSX.writeFile(libro, `reporte-cym-${fecha}.xlsx`);
}
