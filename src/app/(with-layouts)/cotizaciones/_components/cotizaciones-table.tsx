"use client";

import { Eye, Trash1 } from "@tailgrids/icons";
import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/crm/shared/data-table";
import { EstadoBadge } from "@/components/crm/shared/estado-badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailgrids/core/dropdown";
import type { CotizacionDTO } from "@/services/api/cotizaciones/client";
import { ESTADOS_COTIZACION } from "@/services/pcbuilder/constants";
import formatCurrency from "@/utils/format-currency";

interface CotizacionesTableProps {
  cotizaciones: CotizacionDTO[];
  ocupado: boolean;
  onCambiarEstado: (id: number, estado: string) => void;
  onEliminar: (cotizacion: CotizacionDTO) => void;
}

export function CotizacionesTable({ cotizaciones, ocupado, onCambiarEstado, onEliminar }: CotizacionesTableProps) {
  const columnas = useMemo<ColumnDef<CotizacionDTO, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "N°",
        cell: ({ getValue }) => (
          <Link
            href={`/cotizaciones/${getValue()}`}
            className="font-semibold text-button-primary-outline-text hover:underline"
          >
            #{String(getValue()).padStart(4, "0")}
          </Link>
        ),
      },
      {
        id: "cliente",
        accessorFn: (fila) => fila.cliente.nombre,
        header: "Cliente",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-text-primary">{row.original.cliente.nombre}</p>
            <p className="text-xs text-text-secondary">{row.original.cliente.correo}</p>
          </div>
        ),
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ getValue }) =>
          new Date(String(getValue())).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "items",
        accessorFn: (fila) => fila.detalles.length,
        header: "Items",
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => (
          <span className="font-semibold text-text-primary">{formatCurrency(Number(getValue()))}</span>
        ),
      },
      {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Cambiar estado de la cotización ${row.original.id}`}
              className="inline-flex"
              isDisabled={ocupado}
            >
              <EstadoBadge estado={String(row.original.estado)} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ESTADOS_COTIZACION.map((estado) => (
                <DropdownMenuItem key={estado} onAction={() => onCambiarEstado(row.original.id, estado)}>
                  <EstadoBadge estado={estado} />
                  {String(row.original.estado) === estado ? "(actual)" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Link
              href={`/cotizaciones/${row.original.id}`}
              aria-label={`Ver detalle de la cotización ${row.original.id}`}
              className="flex size-7 items-center justify-center rounded-md text-button-primary-outline-text transition-colors hover:bg-background-gray-secondary_alt"
            >
              <Eye className="size-4" />
            </Link>
            <Button
              variant="ghost"
              size="xs"
              className="text-button-error-outline-text!"
              aria-label={`Eliminar ${row.original.id}`}
              isDisabled={ocupado}
              onPress={() => onEliminar(row.original)}
            >
              <Trash1 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [ocupado, onCambiarEstado, onEliminar],
  );

  return <DataTable columns={columnas} data={cotizaciones} emptyMessage="Sin cotizaciones" />;
}
