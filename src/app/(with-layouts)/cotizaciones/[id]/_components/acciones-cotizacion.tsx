"use client";

import { Download1, Whatsapp } from "@tailgrids/icons";
import { toast } from "sonner";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import type { CotizacionDTO } from "@/services/api/cotizaciones/client";
import formatCurrency from "@/utils/format-currency";
import {
  descargarPdfCotizacion,
  fechaLargaCotizacion,
  numeroCotizacion,
} from "./cotizacion-pdf";

interface AccionesCotizacionProps {
  cotizacion: CotizacionDTO;
}

function normalizarTelefono(telefono: string) {
  return telefono.replace(/\D/g, "");
}

function construirMensajeWhatsapp(cotizacion: CotizacionDTO) {
  const lineas = cotizacion.detalles.map(
    (detalle) =>
      `- ${detalle.producto.nombre} x${detalle.cantidad} - ${formatCurrency(detalle.precioUnitario * detalle.cantidad)}`,
  );

  return [
    `Hola ${cotizacion.cliente.nombre}! Te comparto el resumen de tu cotización #${numeroCotizacion(cotizacion.id)} (${fechaLargaCotizacion(cotizacion.fecha)}):`,
    "",
    ...lineas,
    "",
    `Total: ${formatCurrency(cotizacion.total)}`,
    "",
    "Te adjunto el PDF con el detalle completo. Saludos! - PCBuilder",
  ].join("\n");
}

export function AccionesCotizacion({ cotizacion }: AccionesCotizacionProps) {
  const telefono = cotizacion.cliente.telefono
    ? normalizarTelefono(cotizacion.cliente.telefono)
    : null;

  const handleDescargarPdf = () => {
    try {
      descargarPdfCotizacion(cotizacion);
      toast.success("PDF descargado");
    } catch {
      toast.error("No se pudo generar el PDF");
    }
  };

  const handleEnviarWhatsapp = () => {
    if (!telefono) {
      toast.error("El cliente no tiene teléfono registrado");
      return;
    }

    const mensaje = construirMensajeWhatsapp(cotizacion);
    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Card className="p-0">
      <CardHeader className="border-b border-card-border px-5 py-4">
        <CardTitle level={4}>Acciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        <Button
          variant="primary"
          appearance="fill"
          size="sm"
          className="w-full"
          onPress={handleDescargarPdf}
        >
          <Download1 className="size-4" />
          Descargar PDF
        </Button>
        <Button
          variant="success"
          appearance="fill"
          size="sm"
          className="w-full"
          onPress={handleEnviarWhatsapp}
        >
          <Whatsapp className="size-4" />
          Enviar por WhatsApp
        </Button>
        <p className="text-xs text-text-secondary">
          El PDF se descarga en tu equipo para adjuntarlo al chat de WhatsApp.
        </p>
      </CardContent>
    </Card>
  );
}
