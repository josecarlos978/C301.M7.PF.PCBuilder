"use client";

import { Xmark } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { TextField } from "@/components/tailgrids/core/text-field";

interface CpuFiltrosProps {
  marcas: string[];
  sockets: string[];
  marca: string;
  socket: string;
  precioMax: string;
  total: number;
  onMarca: (valor: string) => void;
  onSocket: (valor: string) => void;
  onPrecioMax: (valor: string) => void;
  onLimpiar: () => void;
}

export function CpuFiltros({
  marcas,
  sockets,
  marca,
  socket,
  precioMax,
  total,
  onMarca,
  onSocket,
  onPrecioMax,
  onLimpiar,
}: CpuFiltrosProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-card-border bg-card-background p-4">
      <Select className="w-44" value={marca} onChange={(v) => onMarca(String(v ?? "todas"))}>
        <SelectLabel>Marca</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem id="todas" textValue="Todas las marcas">
            Todas las marcas
          </SelectItem>
          {marcas.map((marcaDisponible) => (
            <SelectItem key={marcaDisponible} id={marcaDisponible} textValue={marcaDisponible}>
              {marcaDisponible}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select className="w-40" value={socket} onChange={(v) => onSocket(String(v ?? "todos"))}>
        <SelectLabel>Socket</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem id="todos" textValue="Todos los sockets">
            Todos los sockets
          </SelectItem>
          {sockets.map((socketDisponible) => (
            <SelectItem key={socketDisponible} id={socketDisponible} textValue={socketDisponible}>
              {socketDisponible}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TextField className="w-32" value={precioMax} onChange={onPrecioMax}>
        <Label>Precio máx.</Label>
        <Input type="number" min={0} step="0.01" placeholder="0.00" className="w-full" />
      </TextField>

      <Button appearance="ghost" size="sm" onPress={onLimpiar}>
        <Xmark className="size-4" />
        Limpiar
      </Button>

      <p className="ml-auto self-center text-sm font-medium text-text-secondary">
        {total} procesador(es)
      </p>
    </div>
  );
}