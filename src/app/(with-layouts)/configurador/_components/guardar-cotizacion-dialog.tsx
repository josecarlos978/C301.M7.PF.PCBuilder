"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import type { CotizacionDTO, DetalleCotizacionInput } from "@/services/api/cotizaciones/client";
import { crearCotizacion } from "@/services/api/cotizaciones/client";
import { listarClientes } from "@/services/api/clientes/client";

interface GuardarCotizacionDialogProps {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  detalles: DetalleCotizacionInput[];
}

export function GuardarCotizacionDialog({ abierto, onOpenChange, detalles }: GuardarCotizacionDialogProps) {
  const [clienteId, setClienteId] = useState<string | undefined>(undefined);

  const clientesQuery = useQuery({
    queryKey: ["clientes"],
    queryFn: () => listarClientes(),
    enabled: abierto,
  });

  const guardarMutation = useMutation({
    mutationFn: () =>
      crearCotizacion({ clienteId: Number(clienteId), estado: "Borrador", detalles }),
    onSuccess: (cotizacion: CotizacionDTO) => {
      toast.success(`Cotización #${cotizacion.id} creada en estado Borrador`);
      onOpenChange(false);
      setClienteId(undefined);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog isOpen={abierto} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Guardar como cotización</DialogTitle>
        <DialogDescription>
          Se creará una cotización en estado <strong>Borrador</strong> con los {detalles.length} producto(s)
          del build actual.
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <Select
          aria-label="Cliente"
          className="w-full"
          value={clienteId}
          onChange={(valor) => setClienteId(valor as string)}
          placeholder="Seleccione un cliente"
          isRequired
          isInvalid={!clienteId && guardarMutation.isError}
        >
          <SelectLabel>Cliente</SelectLabel>
          <SelectTrigger className="w-full border-border-secondary bg-input-background py-2.5">
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent className="min-w-(--trigger-width)">
            {(clientesQuery.data ?? []).map((cliente) => (
              <SelectItem key={cliente.id} id={String(cliente.id)} textValue={cliente.nombre}>
                <div className="flex flex-col">
                  <span>{cliente.nombre}</span>
                  <span className="text-xs text-text-secondary">{cliente.correo}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!clienteId && guardarMutation.isError && (
          <p className="mt-2 text-sm text-input-error">Seleccione un cliente para continuar.</p>
        )}
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          onPress={() => guardarMutation.mutate()}
          isDisabled={!clienteId || guardarMutation.isPending}
        >
          {guardarMutation.isPending ? "Guardando..." : "Crear cotización"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
