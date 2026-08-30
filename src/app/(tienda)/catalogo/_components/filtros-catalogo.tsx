"use client";

import { Search1, Xmark } from "@tailgrids/icons";
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

interface FiltrosCatalogoProps {
  categorias: string[];
  subcategorias: string[];
  categoria: string;
  subcategoria: string;
  busca: string;
  total: number;
  onCategoria: (valor: string) => void;
  onSubcategoria: (valor: string) => void;
  onBusca: (valor: string) => void;
  onLimpiar: () => void;
}

export function FiltrosCatalogo({
  categorias,
  subcategorias,
  categoria,
  subcategoria,
  busca,
  total,
  onCategoria,
  onSubcategoria,
  onBusca,
  onLimpiar,
}: FiltrosCatalogoProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-card-border bg-card-background p-4">
      <Select
        className="w-48"
        value={categoria}
        onChange={(v) => onCategoria(String(v ?? "todas"))}
      >
        <SelectLabel>Categoría</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem id="todas" textValue="Todas las categorías">
            Todas las categorías
          </SelectItem>
          {categorias.map((categoriaDisponible) => (
            <SelectItem
              key={categoriaDisponible}
              id={categoriaDisponible}
              textValue={categoriaDisponible}
            >
              {categoriaDisponible}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        className="w-44"
        value={subcategoria}
        onChange={(v) => onSubcategoria(String(v ?? "todas"))}
      >
        <SelectLabel>Subcategoría</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem id="todas" textValue="Todas las subcategorías">
            Todas las subcategorías
          </SelectItem>
          {subcategorias.map((subcategoriaDisponible) => (
            <SelectItem
              key={subcategoriaDisponible}
              id={subcategoriaDisponible}
              textValue={subcategoriaDisponible}
            >
              {subcategoriaDisponible}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TextField className="w-56 grow" value={busca} onChange={onBusca}>
        <Label>Buscar</Label>
        <Input type="search" placeholder="Por nombre, marca o subcategoría" className="w-full" />
      </TextField>

      <Button appearance="ghost" size="sm" onPress={onLimpiar}>
        <Xmark className="size-4" />
        Limpiar
      </Button>

      <p className="ml-auto flex items-center gap-1 self-center text-sm font-medium text-text-secondary">
        <Search1 className="size-4" />
        {total} producto(s)
      </p>
    </div>
  );
}