"use client";

import { DEFINICION_PASOS } from "@/components/configurador/pasos-config";

export function HomePasos() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-text-primary">Un flujo guiado, paso a paso</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Cada paso valida la compatibilidad con lo elegido antes. Salta los pasos que no necesites.
      </p>

      <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEFINICION_PASOS.map((definicion, indice) => (
          <li
            key={definicion.paso}
            className="flex items-start gap-3 rounded-xl border border-card-border bg-card-background p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-sm font-bold text-primary-500">
              {indice + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{definicion.etiqueta}</p>
              <p className="text-xs text-text-secondary">{definicion.descripcion}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}