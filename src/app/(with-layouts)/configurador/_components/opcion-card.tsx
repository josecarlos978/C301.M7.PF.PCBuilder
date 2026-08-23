"use client";

import { Xmark } from "@tailgrids/icons";
import { Badge } from "@/components/tailgrids/core/badge";
import { Card } from "@/components/tailgrids/core/card";
import { cn } from "@/utils/cn";
import type { EvaluacionProducto } from "@/services/pcbuilder/types";
import formatCurrency from "@/utils/format-currency";

const MAX_ATRIBUTOS = 4;

function formatearClave(clave: string): string {
  return clave
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

interface OpcionCardProps {
  evaluacion: EvaluacionProducto;
  seleccionado: boolean;
  onSeleccionar: () => void;
}

export function OpcionCard({ evaluacion, seleccionado, onSeleccionar }: OpcionCardProps) {
  const { producto, compatible, motivos } = evaluacion;
  const atributos = Object.entries(producto.atributos).slice(0, MAX_ATRIBUTOS);

  return (
    <Card
      role="button"
      tabIndex={compatible ? 0 : -1}
      aria-disabled={!compatible}
      aria-pressed={seleccionado}
      onClick={compatible ? onSeleccionar : undefined}
      onKeyDown={(e) => {
        if (!compatible) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSeleccionar();
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col gap-3 transition-all",
        seleccionado && "border-primary-500 ring-2 ring-primary-500/20",
        !compatible && "cursor-not-allowed opacity-65 hover:shadow-none",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-text-primary">{producto.nombre}</p>
          <p className="text-xs text-text-secondary">{producto.marca}</p>
        </div>
        {compatible ? (
          <Badge color="success" size="sm">
            Compatible
          </Badge>
        ) : (
          <Badge color="error" size="sm">
            Incompatible
          </Badge>
        )}
      </div>

      <ul className="space-y-1">
        {atributos.map(([clave, valor]) => (
          <li key={clave} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-text-secondary">{formatearClave(clave)}</span>
            <span className="font-medium text-text-primary">{valor}</span>
          </li>
        ))}
      </ul>

      {motivos.length > 0 && (
        <ul className="space-y-1 border-t border-card-border pt-2">
          {motivos.map((motivo) => (
            <li key={motivo} className="flex items-start gap-1.5 text-xs text-error-500">
              <Xmark className="mt-0.5 size-3.5 shrink-0" />
              {motivo}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-auto pt-1 text-base font-semibold text-text-primary">
        {formatCurrency(producto.precioVenta)}
      </p>
    </Card>
  );
}
