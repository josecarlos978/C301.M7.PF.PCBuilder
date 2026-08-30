"use client";

import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";

interface DatosClienteFormProps {
  nombre: string;
  nombreValido: boolean;
  onNombre: (valor: string) => void;
  correo: string;
  correoValido: boolean;
  onCorreo: (valor: string) => void;
  telefono: string;
  onTelefono: (valor: string) => void;
}

export function DatosClienteForm({
  nombre,
  nombreValido,
  onNombre,
  correo,
  correoValido,
  onCorreo,
  telefono,
  onTelefono,
}: DatosClienteFormProps) {
  return (
    <>
      <TextField
        className="w-full gap-2"
        value={nombre}
        onChange={onNombre}
        required
        invalid={nombre.length > 0 && !nombreValido}
      >
        <Label>Nombre completo</Label>
        <Input placeholder="Ej.: Juan Pérez" className="w-full" />
      </TextField>

      <TextField
        className="w-full gap-2"
        value={correo}
        onChange={onCorreo}
        required
        invalid={correo.length > 0 && !correoValido}
      >
        <Label>Correo electrónico</Label>
        <Input type="email" placeholder="juan@ejemplo.com" className="w-full" />
      </TextField>

      <TextField className="w-full gap-2" value={telefono} onChange={onTelefono}>
        <Label>
          Teléfono{" "}
          <span className="text-xs font-normal text-input-placeholder-text">(opcional)</span>
        </Label>
        <Input type="tel" placeholder="+51 999 999 999" className="w-full" />
      </TextField>
    </>
  );
}