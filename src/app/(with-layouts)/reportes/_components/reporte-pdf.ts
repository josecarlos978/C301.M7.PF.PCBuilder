import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReporteCompleto } from "@/services/api/reportes/types";
import formatCurrency from "@/utils/format-currency";

const COLOR_OSCURO: [number, number, number] = [15, 23, 42];
const COLOR_GRIS: [number, number, number] = [100, 116, 139];
const COLOR_BORDE: [number, number, number] = [226, 232, 240];
const COLOR_FILA_ALTERNA: [number, number, number] = [248, 250, 252];

const MARGEN = 16;

function obtenerFinalY(doc: jsPDF) {
  const lastAutoTable = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
  return lastAutoTable?.finalY ?? MARGEN;
}

function formatearMes(clave: string): string {
  const [anio, mes] = clave.split("-").map(Number);
  if (!anio || !mes) return clave;
  const texto = new Date(anio, mes - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function tituloSeccion(doc: jsPDF, texto: string, y: number): number {
  const alturaPagina = doc.internal.pageSize.getHeight();
  if (y > alturaPagina - 40) {
    doc.addPage();
    y = MARGEN + 6;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text(texto, MARGEN, y);
  return y + 5;
}

const ESTILOS_TABLA = {
  theme: "grid" as const,
  styles: { fontSize: 9.5, cellPadding: 2.4, lineColor: COLOR_BORDE, textColor: COLOR_OSCURO },
  headStyles: { fillColor: COLOR_OSCURO, textColor: [255, 255, 255] as [number, number, number], fontSize: 9.5 },
  alternateRowStyles: { fillColor: COLOR_FILA_ALTERNA },
};

export function generarPdfReporte(reporte: ReporteCompleto): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", format: "a4", unit: "mm" });
  const anchoPagina = doc.internal.pageSize.getWidth();
  const finPagina = anchoPagina - MARGEN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text("CyM", MARGEN, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS);
  doc.text("Reporte de gestión — CRM", MARGEN, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text("REPORTE", finPagina, 21, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(
    new Date(reporte.generadoEn).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    finPagina,
    27,
    { align: "right" },
  );

  doc.setDrawColor(...COLOR_BORDE);
  doc.setLineWidth(0.4);
  doc.line(MARGEN, 33, finPagina, 33);

  autoTable(doc, {
    startY: 40,
    margin: { left: MARGEN, right: MARGEN },
    head: [["Indicador", "Valor"]],
    body: [
      ["Clientes registrados", String(reporte.totales.clientes)],
      ["Productos en inventario", String(reporte.totales.productos)],
      ["Cotizaciones emitidas", String(reporte.totales.cotizaciones)],
      ["Valor total cotizado", formatCurrency(reporte.totales.valorTotalCotizado)],
      ["Ticket promedio", formatCurrency(reporte.totales.ticketPromedio)],
    ],
    ...ESTILOS_TABLA,
  });

  let y = tituloSeccion(doc, "Cotizaciones por estado", obtenerFinalY(doc) + 12);
  autoTable(doc, {
    startY: y,
    margin: { left: MARGEN, right: MARGEN },
    head: [["Estado", "Cantidad"]],
    body: reporte.cotizacionesPorEstado.map((c) => [c.estado, String(c.cantidad)]),
    ...ESTILOS_TABLA,
  });

  y = tituloSeccion(
    doc,
    `Ingresos confirmados por mes (últimos ${reporte.mesesHistorico} meses)`,
    obtenerFinalY(doc) + 12,
  );
  autoTable(doc, {
    startY: y,
    margin: { left: MARGEN, right: MARGEN },
    head: [["Mes", "Cotizaciones", "Confirmadas", "Ingresos"]],
    body: reporte.ingresosPorMes.map((m) => [
      formatearMes(m.mes),
      String(m.cotizaciones),
      String(m.confirmadas),
      formatCurrency(m.ingresos),
    ]),
    ...ESTILOS_TABLA,
  });

  y = tituloSeccion(doc, "Top productos más cotizados", obtenerFinalY(doc) + 12);
  autoTable(doc, {
    startY: y,
    margin: { left: MARGEN, right: MARGEN },
    head: [["#", "Producto", "Marca", "Categoría", "Unidades", "Ingreso asociado"]],
    body: reporte.topProductos.map((p, indice) => [
      String(indice + 1),
      p.nombre,
      p.marca,
      p.categoria,
      String(p.unidades),
      formatCurrency(p.ingresoAsociado),
    ]),
    ...ESTILOS_TABLA,
  });

  return doc;
}

export function descargarPdfReporte(reporte: ReporteCompleto) {
  const fecha = new Date(reporte.generadoEn).toISOString().slice(0, 10);
  generarPdfReporte(reporte).save(`reporte-cym-${fecha}.pdf`);
}
