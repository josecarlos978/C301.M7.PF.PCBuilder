"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "@tailgrids/icons";
import { CATEGORIA_POR_PASO } from "@/services/pcbuilder/constants";

const SIGLAS: Record<string, string> = {
  Procesadores: "CPU",
  Mainboard: "Placa",
  "Memoria RAM": "RAM",
  "Tarjetas de Video": "GPU",
  Cooler: "Cooler",
  Cases: "Case",
  "Fuente de Poder": "PSU",
};

export function HomeCategorias() {
  const categorias = Object.values(CATEGORIA_POR_PASO) as string[];

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Explora por componente</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Accede directo al catálogo para ver cada familia de productos.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          Ver todo el catálogo
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categorias.map((categoria) => (
          <Link
            key={categoria}
            href="/catalogo"
            className="group flex items-center gap-3 rounded-xl border border-card-border bg-card-background p-4 transition hover:border-primary-500/40 hover:shadow-sm"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-xs font-bold text-primary-500">
              {SIGLAS[categoria] ?? categoria.slice(0, 3).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{categoria}</p>
              <p className="flex shrink-0 items-center gap-0.5 text-xs text-text-secondary transition-colors group-hover:text-primary-500">
                Ver productos
                <ArrowRight className="size-3" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}