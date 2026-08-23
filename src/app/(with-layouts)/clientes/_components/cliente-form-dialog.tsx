"use client";

import { useState } from "react";
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
import type { ClienteInput } from "@/services/api/clientes/types";
import type { ClienteConCotizaciones } from "@/services/api/clientes/client";

interface ClienteFormDialogProps {
  abierto: boolean;
  cliente: ClienteConCotizaciones | null;
  guardando: boolean;
  onClose: () => void;
  onGuardar: (input: ClienteInput) => void;
}

export function ClienteFormDialog({ abierto, cliente, guardando, onClose, onGuardar }: ClienteFormDialogProps) {
  return (
    <Dialog isOpen={abierto} onOpenChange={(v) => !v && onClose()}>
      {abierto && (
        <FormularioCliente
          cliente={cliente}
          guardando={guardando}
          onClose={onClose}
          onGuardar={onGuardar}
        />
      )}
    </Dialog>
  );
}

function FormularioCliente({
  cliente,
  guardando,
  onClose,
  onGuardar,
}: Omit<ClienteFormDialogProps, "abierto">) {
  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [correo, setCorreo] = useState(cliente?.correo ?? "");
  const [telefono, setTelefono] = useState(cliente?.telefono ?? "");
  const [error, setError] = useState<string | null>(null);

  function enviar() {
    if (!nombre.trim()) return setError("El nombre es obligatorio");
    if (!correo.trim()) return setError("El correo es obligatorio");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return setError("Correo inválido");

    onGuardar({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim() || undefined,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{cliente ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        <DialogDescription>
          {cliente ? `Actualizando los datos de ${cliente.nombre}.` : "Registra un nuevo cliente para cotizaciones."}
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cliente-nombre">Nombre</Label>
          <Input
            id="cliente-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Juan Pérez"
            state={error && !nombre.trim() ? "error" : "default"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cliente-correo">Correo</Label>
          <Input
            id="cliente-correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="juan@correo.com"
            state={error && !correo.trim() ? "error" : "default"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cliente-telefono">Teléfono (opcional)</Label>
          <Input
            id="cliente-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
        {error && <p className="text-sm text-input-error">{error}</p>}
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={onClose}>
          Cancelar
        </Button>
        <Button onPress={enviar} isDisabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </>
  );
}
