"use client";

import { useMutation } from "@tanstack/react-query";
import { Whatsapp } from "@tailgrids/icons";
import { toast } from "sonner";
import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { WHATSAPP_ADMIN } from "@/config/tienda";
import type { DetalleCotizacionInput, CotizacionDTO } from "@/services/api/cotizaciones/client";
import { crearCotizacion } from "@/services/api/cotizaciones/client";
import { crearCliente } from "@/services/api/clientes/client";
import { abrirWhatsApp, construirMensajeWhatsApp } from "./cotizacion-archivos";
import { DatosClienteForm } from "@/components/tienda/datos-cliente-form";
import { useDatosCliente } from "@/components/tienda/use-datos-cliente";
import type { FilaResumen } from "./resumen-panel";

interface EnviarWhatsAppDialogProps {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  filas: FilaResumen[];
  total: number;
  detalles: DetalleCotizacionInput[];
}

export function EnviarWhatsAppDialog({
  abierto,
  onOpenChange,
  filas,
  total,
  detalles,
}: EnviarWhatsAppDialogProps) {
  const cliente = useDatosCliente();

  async function registrarYEnviar() {
    let numeroCotizacion: number | undefined;
    try {
      const clienteCreado = await crearCliente(cliente.datos());
      const cotizacion: CotizacionDTO = await crearCotizacion({
        clienteId: clienteCreado.id,
        estado: "Borrador",
        detalles,
      });
      numeroCotizacion = cotizacion.id;
      toast.success(`Cotización #${cotizacion.id} registrada en el sistema`);
    } catch {
      toast.warning(
        "No pudimos registrar la cotización en línea, pero podrás continuar por WhatsApp.",
      );
    }

    abrirWhatsApp(
      WHATSAPP_ADMIN,
      construirMensajeWhatsApp(filas, cliente.datos(), numeroCotizacion),
    );
    onOpenChange(false);
    cliente.limpiar();
  }

  const enviarMutation = useMutation({
    mutationFn: registrarYEnviar,
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog isOpen={abierto} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Enviar cotización por WhatsApp</DialogTitle>
        <DialogDescription>
          Déjanos tus datos de contacto y te abriremos WhatsApp con tu build de{" "}
          <strong>{detalles.length}</strong> parte(s), valorada en{" "}
          <strong>${total.toFixed(2)}</strong>, lista para enviar.
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-4">
        <DatosClienteForm
          nombre={cliente.nombre}
          nombreValido={cliente.nombreValido}
          onNombre={cliente.setNombre}
          correo={cliente.correo}
          correoValido={cliente.correoValido}
          onCorreo={cliente.setCorreo}
          telefono={cliente.telefono}
          onTelefono={cliente.setTelefono}
        />
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onPress={() => enviarMutation.mutate()}
          isDisabled={!cliente.formularioValido || enviarMutation.isPending}
        >
          <Whatsapp className="size-4" />
          {enviarMutation.isPending ? "Enviando..." : "Abrir WhatsApp"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}