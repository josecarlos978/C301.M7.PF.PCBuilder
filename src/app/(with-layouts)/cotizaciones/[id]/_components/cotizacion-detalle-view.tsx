"use client";

import { ArrowLeft } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/crm/shared/page-header";
import { EstadoBadge } from "@/components/crm/shared/estado-badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tailgrids/core/dropdown";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRoot,
} from "@/components/tailgrids/core/table";
import { cambiarEstadoCotizacion, obtenerCotizacion } from "@/services/api/cotizaciones/client";
import { ESTADOS_COTIZACION } from "@/services/pcbuilder/constants";
import formatCurrency from "@/utils/format-currency";
import { AccionesCotizacion } from "./acciones-cotizacion";

interface CotizacionDetalleViewProps {
  id: number;
}

export default function CotizacionDetalleView({ id }: CotizacionDetalleViewProps) {
  const queryClient = useQueryClient();

  const cotizacionQuery = useQuery({
    queryKey: ["cotizaciones", id],
    queryFn: () => obtenerCotizacion(id),
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: (estado: string) => cambiarEstadoCotizacion(id, estado),
    onSuccess: () => {
      toast.success("Estado actualizado");
      void queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
      void queryClient.invalidateQueries({ queryKey: ["reportes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (cotizacionQuery.isPending) {
    return (
      <div className="mt-6 space-y-5 px-2 lg:px-5">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const cotizacion = cotizacionQuery.data;

  if (!cotizacion) {
    return (
      <div className="mt-6 space-y-5">
        <PageHeader
          titulo="Detalle de cotización"
          items={[
            { href: "/", label: "Home" },
            { href: "/cotizaciones", label: "CRM" },
            { href: `/cotizaciones/${id}`, label: `#${id}` },
          ]}
        />
        <div className="px-2 lg:px-5">
          <Card>
            <p className="text-sm text-text-secondary">
              No se encontró la cotización #{id}. Puede haber sido eliminada.
            </p>
            <Link
              href="/cotizaciones"
              className="mt-4 inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-button-primary-outline-stroke bg-button-primary-outline-background px-3 py-1.5 text-sm font-medium text-button-primary-outline-text transition-colors hover:bg-button-primary-outline-hover-background"
            >
              <ArrowLeft className="size-4" />
              Volver a cotizaciones
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo={`Cotización #${String(cotizacion.id).padStart(4, "0")}`}
        items={[
          { href: "/", label: "Home" },
          { href: "/cotizaciones", label: "CRM" },
          { href: `/cotizaciones/${cotizacion.id}`, label: `#${cotizacion.id}` },
        ]}
        acciones={
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Cambiar estado" isDisabled={cambiarEstadoMutation.isPending}>
              <EstadoBadge estado={String(cotizacion.estado)} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ESTADOS_COTIZACION.map((estado) => (
                <DropdownMenuItem key={estado} onAction={() => cambiarEstadoMutation.mutate(estado)}>
                  <EstadoBadge estado={estado} />
                  {String(cotizacion.estado) === estado ? "(actual)" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Card className="p-0">
              <CardHeader className="border-b border-card-border px-5 py-4">
                <CardTitle level={4}>Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-5">
                <p className="font-semibold text-text-primary">{cotizacion.cliente.nombre}</p>
                <p className="text-sm text-text-secondary">{cotizacion.cliente.correo}</p>
                {cotizacion.cliente.telefono && (
                  <p className="text-sm text-text-secondary">{cotizacion.cliente.telefono}</p>
                )}
                <p className="pt-2 text-xs text-text-secondary">
                  Creada el{" "}
                  {new Date(String(cotizacion.fecha)).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            <AccionesCotizacion cotizacion={cotizacion} />

            <Button appearance="outline" size="sm" onPress={() => history.back()}>
              <ArrowLeft className="size-4" />
              Volver
            </Button>
          </div>

          <Card className="p-0">
            <CardHeader className="border-b border-card-border px-5 py-4">
              <CardTitle level={4}>Componentes del build</CardTitle>
            </CardHeader>

            <div className="p-5">
              <TableRoot>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio unitario</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizacion.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>
                        <p className="font-medium text-text-primary">{detalle.producto.nombre}</p>
                        <p className="text-xs text-text-secondary">
                          {detalle.producto.marca} · {detalle.producto.categoria}
                        </p>
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{formatCurrency(detalle.precioUnitario)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(detalle.precioUnitario * detalle.cantidad)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot>
                  <TableRow>
                    <td colSpan={3} className="px-5 py-4 text-right text-sm font-semibold text-title-50">
                      Total
                    </td>
                    <TableCell className="text-base font-semibold">{formatCurrency(cotizacion.total)}</TableCell>
                  </TableRow>
                </tfoot>
              </TableRoot>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
