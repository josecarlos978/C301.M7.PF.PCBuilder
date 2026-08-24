import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CotizacionDTO } from "@/services/api/cotizaciones/client";
import formatCurrency from "@/utils/format-currency";

const COLOR_OSCURO: [number, number, number] = [15, 23, 42];
const COLOR_GRIS: [number, number, number] = [100, 116, 139];
const COLOR_BORDE: [number, number, number] = [226, 232, 240];
const COLOR_FILA_ALTERNA: [number, number, number] = [248, 250, 252];
const COLOR_FOOTER_TABLA: [number, number, number] = [241, 245, 249];

const MARGEN = 16;

export function numeroCotizacion(id: number) {
  return String(id).padStart(4, "0");
}

export function fechaLargaCotizacion(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function obtenerFinalY(doc: jsPDF) {
  const lastAutoTable = (
    doc as unknown as { lastAutoTable?: { finalY?: number } }
  ).lastAutoTable;
  return lastAutoTable?.finalY ?? MARGEN;
}

export function generarPdfCotizacion(cotizacion: CotizacionDTO): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", format: "a4", unit: "mm" });
  const anchoPagina = doc.internal.pageSize.getWidth();
  const finPagina = anchoPagina - MARGEN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text("PCBUILDER", MARGEN, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS);
  doc.text("Cotización de armado de PC a medida", MARGEN, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text(`COTIZACIÓN #${numeroCotizacion(cotizacion.id)}`, finPagina, 21, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(fechaLargaCotizacion(cotizacion.fecha), finPagina, 27, {
    align: "right",
  });

  doc.setDrawColor(...COLOR_BORDE);
  doc.setLineWidth(0.4);
  doc.line(MARGEN, 33, finPagina, 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CLIENTE", MARGEN, 43);

  doc.setFontSize(11);
  doc.setTextColor(...COLOR_OSCURO);
  doc.text(cotizacion.cliente.nombre, MARGEN, 49);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_GRIS);
  const contacto = [
    cotizacion.cliente.correo,
    ...(cotizacion.cliente.telefono ? [cotizacion.cliente.telefono] : []),
  ].join("  ·  ");
  doc.text(contacto, MARGEN, 55);
  doc.text(`Estado: ${String(cotizacion.estado)}`, finPagina, 49, {
    align: "right",
  });

  autoTable(doc, {
    startY: 66,
    margin: { left: MARGEN, right: MARGEN },
    head: [["Producto", "Marca", "Cant.", "Precio unit.", "Subtotal"]],
    body: cotizacion.detalles.map((detalle) => [
      detalle.producto.nombre,
      detalle.producto.marca,
      String(detalle.cantidad),
      formatCurrency(detalle.precioUnitario),
      formatCurrency(detalle.precioUnitario * detalle.cantidad),
    ]),
    foot: [
      [
        {
          content: "Total",
          colSpan: 3,
          styles: { halign: "right", fontStyle: "bold" },
        },
        {
          content: formatCurrency(cotizacion.total),
          colSpan: 2,
          styles: { fontStyle: "bold" },
        },
      ],
    ],
    theme: "grid",
    styles: { fontSize: 9.5, cellPadding: 2.6, lineColor: COLOR_BORDE, textColor: COLOR_OSCURO },
    headStyles: { fillColor: COLOR_OSCURO, textColor: [255, 255, 255], fontSize: 9.5 },
    alternateRowStyles: { fillColor: COLOR_FILA_ALTERNA },
    footStyles: { fillColor: COLOR_FOOTER_TABLA, textColor: COLOR_OSCURO, fontSize: 10.5 },
    columnStyles: {
      2: { halign: "center", cellWidth: 16 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 32 },
    },
  });

  let y = Math.max(obtenerFinalY(doc) + 12, doc.internal.pageSize.getHeight() - 26);
  if (y > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    y = MARGEN + 6;
  }

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLOR_GRIS);
  doc.text(
    "Los precios están expresados en USD y son válidos por 15 días.",
    MARGEN,
    y,
  );
  doc.setFont("helvetica", "normal");
  doc.text(
    `Documento generado el ${new Date().toLocaleDateString("es-ES")} · PCBuilder`,
    MARGEN,
    y + 5,
  );

  return doc;
}

export function descargarPdfCotizacion(cotizacion: CotizacionDTO) {
  generarPdfCotizacion(cotizacion).save(`cotizacion-${numeroCotizacion(cotizacion.id)}.pdf`);
}
