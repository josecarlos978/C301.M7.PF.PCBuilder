"use client";

import { Skeleton } from "@/components/tailgrids/core/skeleton";
import { Alert, AlertDescription, AlertIndicator } from "@/components/tailgrids/core/alert";
import { OpcionCard } from "./opcion-card";
import type { EvaluacionProducto } from "@/services/pcbuilder/types";

interface OpcionesGridProps {
  opciones: EvaluacionProducto[];
  idsSeleccionados: number[];
  cargando: boolean;
  onSeleccionar: (productoId: number) => void;
}

export function OpcionesGrid({ opciones, idsSeleccionados, cargando, onSeleccionar }: OpcionesGridProps) {
  if (cargando) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (opciones.length === 0) {
    return (
      <Alert status="info">
        <AlertIndicator />
        <AlertDescription>
          No hay productos disponibles para este paso en el inventario.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {opciones.map((evaluacion) => (
        <OpcionCard
          key={evaluacion.producto.id}
          evaluacion={evaluacion}
          seleccionado={idsSeleccionados.includes(evaluacion.producto.id)}
          onSeleccionar={() => onSeleccionar(evaluacion.producto.id)}
        />
      ))}
    </div>
  );
}
