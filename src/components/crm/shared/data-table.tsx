"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "@tailgrids/icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, TableRoot } from "@/components/tailgrids/core/table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  globalFilter?: string;
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  globalFilter = "",
  pageSize = 10,
  emptyMessage = "Sin registros para mostrar",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const filas = table.getRowModel().rows;
  const { pageIndex } = table.getState().pagination;
  const totalPaginas = Math.max(table.getPageCount(), 1);

  return (
    <div className="space-y-3">
      <TableRoot>
        <TableHeader>
          {table.getHeaderGroups().map((grupo) => (
            <TableRow key={grupo.id}>
              {grupo.headers.map((header) => {
                const puedeOrdenar = header.column.getCanSort();
                const direccion = header.column.getIsSorted();
                return (
                  <TableHead key={header.id}>
                    {puedeOrdenar ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 uppercase transition-colors hover:text-text-primary"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {direccion === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : direccion === "desc" ? (
                          <ChevronDown className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-text-secondary">
                {emptyMessage}
              </td>
            </TableRow>
          ) : (
            filas.map((fila) => (
              <TableRow key={fila.id}>
                {fila.getVisibleCells().map((celda) => (
                  <TableCell key={celda.id}>
                    {flexRender(celda.column.columnDef.cell, celda.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </TableRoot>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-text-secondary">
            Página {pageIndex + 1} de {totalPaginas}
          </span>
          <Button
            variant="primary"
            appearance="outline"
            size="sm"
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
          <Button
            variant="primary"
            appearance="outline"
            size="sm"
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
