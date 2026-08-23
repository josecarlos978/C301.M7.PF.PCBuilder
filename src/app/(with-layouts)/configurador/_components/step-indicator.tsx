"use client";

import { Check } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import type { DefinicionPaso } from "./pasos-config";

interface StepIndicatorProps {
  pasos: DefinicionPaso[];
  indiceActual: number;
  pasosCompletados: Set<string>;
  pasosSaltables: Set<string>;
  onSeleccionar: (indice: number) => void;
}

export function StepIndicator({
  pasos,
  indiceActual,
  pasosCompletados,
  pasosSaltables,
  onSeleccionar,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Pasos del configurador" className="w-full overflow-x-auto pb-1">
      <ol className="flex min-w-max items-start gap-1">
        {pasos.map((paso, indice) => {
          const esActual = indice === indiceActual;
          const completado = pasosCompletados.has(paso.paso);
          const saltable = pasosSaltables.has(paso.paso);
          const alcanzable = indice <= indiceActual;

          return (
            <li key={paso.paso} className="flex items-start">
              <button
                type="button"
                disabled={!alcanzable}
                onClick={() => onSeleccionar(indice)}
                aria-current={esActual ? "step" : undefined}
                className={cn(
                  "flex w-22 flex-col items-center gap-1.5 rounded-lg px-2 py-2 text-center transition-colors",
                  alcanzable ? "cursor-pointer hover:bg-background-gray-secondary_alt" : "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    esActual && "border-primary-500 bg-primary-500 text-white-100",
                    !esActual && completado && "border-success-500 bg-success-500/10 text-success-500",
                    !esActual && !completado && "border-card-border bg-card-background text-text-secondary",
                    saltable && "border-dashed",
                  )}
                >
                  {completado && !esActual ? <Check className="size-4" /> : indice + 1}
                </span>
                <span
                  className={cn(
                    "text-xs leading-tight font-medium",
                    esActual ? "text-text-primary" : "text-text-secondary",
                  )}
                >
                  {paso.etiqueta}
                  {saltable && <span className="block text-[10px] font-normal">auto</span>}
                </span>
              </button>
              {indice < pasos.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn("mt-6.5 h-0.5 w-6 rounded-full", completado ? "bg-success-500/60" : "bg-card-border")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
