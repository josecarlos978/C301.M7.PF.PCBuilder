"use client";

import { useMutation } from "@tanstack/react-query";
import { BagShopping2, CheckCircle1, Whatsapp } from "@tailgrids/icons";
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
import { WHATSAPP_ADMIN } from "@/config/tienda";
import { crearCliente } from "@/services/api/clientes/client";
import {
  crearCotizacion,
  type CotizacionDTO,
  type DetalleCotizacionInput,
} from "@/services/api/cotizaciones/client";
import formatCurrency from "@/utils/format-currency";
import type { ItemCarrito } from "./carrito-context";
import { DatosClienteForm } from "./datos-cliente-form";
import { ResumenProductosCarrito } from "./resumen-productos-carrito";
import { useDatosCliente } from "./use-datos-cliente";
import { abrirWhatsApp, construirMensajeCarritoWhatsApp } from "./whatsapp";

interface SolicitarCotizacionDialogProps {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  items: ItemCarrito[];
  total: number;
  detalles: DetalleCotizacionInput[];
  onRegistrada: () => void;
}

export function SolicitarCotizacionDialog({
  abierto,
  onOpenChange,
  items,
  total,
  detalles,
  onRegistrada,
}: SolicitarCotizacionDialogProps) {
  const cliente = useDatosCliente();
  const [cotizacionCreada, setCotizacionCreada] = useState<CotizacionDTO | null>(null);

  const registrarMutation = useMutation({
    mutationFn: async () => {
      const clienteCreado = await crearCliente(cliente.datos());
      return crearCotizacion({
        clienteId: clienteCreado.id,
        estado: "Borrador",
        detalles,
      });
    },
    onSuccess: (data) => {
      setCotizacionCreada(data);
      toast.success(`Cotización #${data.id} registrada en el sistema`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function cerrar() {
    cliente.limpiar();
    if (cotizacionCreada) onRegistrada();
    setCotizacionCreada(null);
    onOpenChange(false);
  }

  function reenviarWhatsApp() {
    if (!cotizacionCreada) return;
    abrirWhatsApp(
      WHATSAPP_ADMIN,
      construirMensajeCarritoWhatsApp(
        items.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precioVenta,
        })),
        cliente.datos(),
        cotizacionCreada.id,
      ),
    );
    cerrar();
  }

  function manejarOpenChange(nuevo: boolean) {
    if (!nuevo) {
      if (!registrarMutation.isPending) cerrar();
      return;
    }
    onOpenChange(nuevo);
  }

  return (
    <Dialog isOpen={abierto} onOpenChange={manejarOpenChange}>
      <DialogHeader>
        <DialogTitle>Solicitar cotización</DialogTitle>
        <DialogDescription>
          Registra tu solicitud de cotización con <strong>{items.length}</strong> producto(s),
          valorada en <strong>{formatCurrency(total)}</strong>.
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-4">
        {cotizacionCreada ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-success-500/10 text-success-500">
              <CheckCircle1 className="size-7" />
            </span>
            <p className="text-sm font-semibold text-text-primary">¡Solicitud recibida!</p>
            <p className="max-w-xs text-xs text-text-secondary">
              Tu cotización <strong>#{cotizacionCreada.id}</strong> quedó registrada. Un asesor se
              pondrá en contacto para confirmar disponibilidad y coordinar tu compra.
            </p>
          </div>
        ) : (
          <>
            <ResumenProductosCarrito items={items} />
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
          </>
        )}
      </DialogBody>

      <DialogFooter>
        {cotizacionCreada ? (
          <>
            <Button variant="ghost" onPress={cerrar}>
              Cerrar
            </Button>
            <Button variant="success" onPress={reenviarWhatsApp}>
              <Whatsapp className="size-4" />
              Enviar por WhatsApp
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onPress={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              variant="success"
              onPress={() => registrarMutation.mutate()}
              isDisabled={!cliente.formularioValido || registrarMutation.isPending}
            >
              <BagShopping2 className="size-4" />
              {registrarMutation.isPending ? "Registrando..." : "Registrar solicitud"}
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
}