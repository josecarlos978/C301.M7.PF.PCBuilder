"use client";

import Link from "next/link";
import { Card } from "@/components/tailgrids/core/card";
import { EstadoBadge } from "@/components/crm/shared/estado-badge";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, TableRoot } from "@/components/tailgrids/core/table";
import type { CotizacionDTO } from "@/services/api/cotizaciones/client";
import formatCurrency from "@/utils/format-currency";

const LIMITE = 5;

interface CotizacionesRecientesProps {
  cotizaciones: CotizacionDTO[];
}

export function CotizacionesRecientes({ cotizaciones }: CotizacionesRecientesProps) {
  const recientes = cotizaciones.slice(0, LIMITE);

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
        <div>
          <h3 className="text-base font-medium text-text-primary">Cotizaciones recientes</h3>
          <p className="text-sm text-text-secondary">Últimas {LIMITE} cotizaciones registradas</p>
        </div>
        <Link
          href="/cotizaciones"
          className="text-sm font-medium text-button-primary-outline-text hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <div className="p-5">
        {recientes.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-secondary">Aún no hay cotizaciones registradas.</p>
        ) : (
          <TableRoot fullBleed>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recientes.map((cotizacion) => (
                <TableRow key={cotizacion.id}>
                  <TableCell>
                    <Link
                      href={`/cotizaciones/${cotizacion.id}`}
                      className="font-semibold text-button-primary-outline-text hover:underline"
                    >
                      #{String(cotizacion.id).padStart(4, "0")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-text-primary">{cotizacion.cliente.nombre}</p>
                    <p className="text-xs text-text-secondary">{cotizacion.cliente.correo}</p>
                  </TableCell>
                  <TableCell>
                    {new Date(cotizacion.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-text-primary">
                    {formatCurrency(cotizacion.total)}
                  </TableCell>
                  <TableCell>
                    <EstadoBadge estado={String(cotizacion.estado)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        )}
      </div>
    </Card>
  );
}
