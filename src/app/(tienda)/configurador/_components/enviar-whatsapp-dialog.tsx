"use client";

import { useMutation } from "@tanstack/react-query";
import { Whatsapp } from "@tailgrids/icons";
import { useState } from "react";
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
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
import { WHATSAPP_ADMIN } from "@/config/tienda";
import type { DetalleCotizacionInput, CotizacionDTO } from "@/services/api/cotizaciones/client";
import { crearCotizacion } from "@/services/api/cotizaciones/client";
import { crearCliente } from "@/services/api/clientes/client";
import {
  abrirWhatsApp,
  construirMensajeWhatsApp,
  type DatosCliente,
} from "./cotizacion-archivos";
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
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const formularioValido = nombre.trim().length > 1 && /.+@.+\..+/.test(correo.trim());

  function datosIngresados(): DatosCliente {
    return {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim() || undefined,
    };
  }

  async function registrarYEnviar() {
    let numeroCotizacion: number | undefined;
    try {
      const cliente = await crearCliente(datosIngresados());
      const cotizacion: CotizacionDTO = await crearCotizacion({
        clienteId: cliente.id,
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

    abrirWhatsApp(WHATSAPP_ADMIN, construirMensajeWhatsApp(filas, datosIngresados(), numeroCotizacion));
    onOpenChange(false);
    setNombre("");
    setCorreo("");
    setTelefono("");
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
        <TextField
          className="w-full gap-2"
          value={nombre}
          onChange={setNombre}
          required
          invalid={nombre.length > 0 && nombre.trim().length < 2}
        >
          <Label>Nombre completo</Label>
          <Input placeholder="Ej.: Juan Pérez" className="w-full" />
        </TextField>

        <TextField
          className="w-full gap-2"
          value={correo}
          onChange={setCorreo}
          required
          invalid={correo.length > 0 && !/.+@.+\..+/.test(correo.trim())}
        >
          <Label>Correo electrónico</Label>
          <Input type="email" placeholder="juan@ejemplo.com" className="w-full" />
        </TextField>

        <TextField className="w-full gap-2" value={telefono} onChange={setTelefono}>
          <Label>
            Teléfono <span className="text-xs font-normal text-input-placeholder-text">(opcional)</span>
          </Label>
          <Input type="tel" placeholder="+593 99 999 9999" className="w-full" />
        </TextField>
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onPress={() => enviarMutation.mutate()}
          isDisabled={!formularioValido || enviarMutation.isPending}
        >
          <Whatsapp className="size-4" />
          {enviarMutation.isPending ? "Enviando..." : "Abrir WhatsApp"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
