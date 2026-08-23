"use client";

import { Pencil1, Trash1 } from "@tailgrids/icons";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/crm/shared/data-table";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import type { ProductoDTO } from "@/services/api/productos/client";
import formatCurrency from "@/utils/format-currency";

interface ProductosTableProps {
  productos: ProductoDTO[];
  eliminando: boolean;
  onEditar: (producto: ProductoDTO) => void;
  onEliminar: (producto: ProductoDTO) => void;
}

const MAX_SPECS_VISIBLES = 3;

export function ProductosTable({ productos, eliminando, onEditar, onEliminar }: ProductosTableProps) {
  const columnas = useMemo<ColumnDef<ProductoDTO, unknown>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Producto",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-text-primary">{row.original.nombre}</p>
            <p className="text-xs text-text-secondary">
              {row.original.marca} · {row.original.subcategoria}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "categoria",
        header: "Categoría",
      },
      {
        accessorKey: "precioVenta",
        header: "Precio",
        cell: ({ getValue }) => (
          <span className="font-medium text-text-primary">{formatCurrency(Number(getValue()))}</span>
        ),
      },
      {
        id: "atributos",
        header: "Especificaciones",
        enableSorting: false,
        cell: ({ row }) => {
          const entradas = Object.entries(row.original.atributos);
          return (
            <div className="flex max-w-md flex-wrap gap-1">
              {entradas.slice(0, MAX_SPECS_VISIBLES).map(([clave, valor]) => (
                <Badge key={clave} color="gray" size="sm" className="normal-case">
                  {clave}: {valor}
                </Badge>
              ))}
              {entradas.length > MAX_SPECS_VISIBLES && (
                <Badge color="blue" size="sm">
                  +{entradas.length - MAX_SPECS_VISIBLES} más
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="xs" aria-label={`Editar ${row.original.nombre}`} onPress={() => onEditar(row.original)}>
              <Pencil1 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="text-button-error-outline-text!"
              aria-label={`Eliminar ${row.original.nombre}`}
              isDisabled={eliminando}
              onPress={() => onEliminar(row.original)}
            >
              <Trash1 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [eliminando, onEditar, onEliminar],
  );

  return (
    <DataTable columns={columnas} data={productos} emptyMessage="No hay productos que coincidan con el filtro" />
  );
}
