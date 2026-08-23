import { Pencil1, Trash1 } from "@tailgrids/icons";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/crm/shared/data-table";
import { Button } from "@/components/tailgrids/core/button";
import type { ClienteConCotizaciones } from "@/services/api/clientes/client";

interface ClientesTableProps {
  clientes: ClienteConCotizaciones[];
  filtro: string;
  eliminando: boolean;
  onEditar: (cliente: ClienteConCotizaciones) => void;
  onEliminar: (cliente: ClienteConCotizaciones) => void;
}

export function ClientesTable({ clientes, filtro, eliminando, onEditar, onEliminar }: ClientesTableProps) {
  const columnas = useMemo<ColumnDef<ClienteConCotizaciones, unknown>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Cliente",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-text-primary">{row.original.nombre}</p>
            <p className="text-xs text-text-secondary">{row.original.correo}</p>
          </div>
        ),
      },
      {
        accessorKey: "telefono",
        header: "Teléfono",
        cell: ({ getValue }) => (getValue() ? String(getValue()) : "—"),
      },
      {
        accessorFn: (fila) => fila._count?.cotizaciones ?? 0,
        id: "cotizaciones",
        header: "Cotizaciones",
      },
      {
        accessorKey: "createdAt",
        header: "Registro",
        cell: ({ getValue }) =>
          new Date(String(getValue())).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
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
    [onEditar, onEliminar, eliminando],
  );

  return (
    <DataTable
      columns={columnas}
      data={clientes}
      globalFilter={filtro}
      emptyMessage="No hay clientes registrados todavía"
    />
  );
}
