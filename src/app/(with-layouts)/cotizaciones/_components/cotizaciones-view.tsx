"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/crm/shared/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import type { CotizacionDTO } from "@/services/api/cotizaciones/client";
import { cambiarEstadoCotizacion, eliminarCotizacion, listarCotizaciones } from "@/services/api/cotizaciones/client";
import { ESTADOS_COTIZACION } from "@/services/pcbuilder/constants";
import formatCurrency from "@/utils/format-currency";
import { CotizacionesTable } from "./cotizaciones-table";

const FILTROS_ESTADO = ["Todos", ...ESTADOS_COTIZACION] as const;

export default function CotizacionesView() {
  const queryClient = useQueryClient();
  const [estado, setEstado] = useState<string>("Todos");
  const [cotizacionEliminando, setCotizacionEliminando] = useState<CotizacionDTO | null>(null);

  const cotizacionesQuery = useQuery({
    queryKey: ["cotizaciones"],
    queryFn: () => listarCotizaciones(),
  });

  function invalidar() {
    void queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
    void queryClient.invalidateQueries({ queryKey: ["reportes"] });
  }

  const cambiarEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => cambiarEstadoCotizacion(id, estado),
    onSuccess: (c) => {
      toast.success(`Cotización #${c.id} actualizada a ${String(c.estado)}`);
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => eliminarCotizacion(id),
    onSuccess: () => {
      toast.success("Cotización eliminada");
      setCotizacionEliminando(null);
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtradas = useMemo(() => {
    const datos = cotizacionesQuery.data ?? [];
    return estado === "Todos" ? datos : datos.filter((c) => c.estado === estado);
  }, [cotizacionesQuery.data, estado]);

  const valorTotal = filtradas.reduce((suma, c) => suma + c.total, 0);

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Cotizaciones"
        items={[
          { href: "/admin", label: "Home" },
          { href: "/cotizaciones", label: "CRM" },
          { href: "/cotizaciones", label: "Cotizaciones" },
        ]}
        acciones={
          <Select aria-label="Filtrar estado" className="w-44" value={estado} onChange={(v) => setEstado(v as string)}>
            <SelectTrigger className="w-full border-border-secondary bg-input-background">
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {FILTROS_ESTADO.map((filtro) => (
                <SelectItem key={filtro} id={filtro} textValue={filtro}>
                  {filtro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border px-5 py-4">
            <p className="text-sm text-text-secondary">
              {filtradas.length} cotización(es) mostradas
            </p>
            <p className="text-sm font-medium text-text-primary">
              Valor total: {formatCurrency(valorTotal)}
            </p>
          </div>

          <div className="p-5">
            {cotizacionesQuery.isPending ? (
              <Skeleton className="h-72 w-full rounded-lg" />
            ) : (
              <>
                <CotizacionesTable
                  cotizaciones={filtradas}
                  onCambiarEstado={(id, nuevo) => cambiarEstadoMutation.mutate({ id, estado: nuevo })}
                  onEliminar={setCotizacionEliminando}
                  ocupado={eliminarMutation.isPending || cambiarEstadoMutation.isPending}
                />
                {filtradas.length === 0 && (
                  <p className="py-6 text-center text-sm text-text-secondary">
                    No hay cotizaciones para el filtro seleccionado.
                  </p>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {cotizacionEliminando && (
        <Dialog isOpen onOpenChange={(v) => !v && setCotizacionEliminando(null)}>
          <DialogHeader>
            <DialogTitle>Eliminar cotización</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar la cotización <strong>#{cotizacionEliminando.id}</strong> de{" "}
              {cotizacionEliminando.cliente.nombre}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onPress={() => setCotizacionEliminando(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onPress={() => eliminarMutation.mutate(cotizacionEliminando.id)}
              isDisabled={eliminarMutation.isPending}
            >
              {eliminarMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
