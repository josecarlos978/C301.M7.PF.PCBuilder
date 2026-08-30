"use client";

import { useRouter } from "next/navigation";
import { BagShopping2, ChevronDown } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";

const ESTADISTICAS = [
  { valor: "7", etiqueta: "pasos de selección" },
  { valor: "Automática", etiqueta: "validación de compatibilidad" },
  { valor: "Al instante", etiqueta: "cotización en línea" },
];

export function HomeHero() {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-card-border bg-card-surface-area px-6 py-14 text-center sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
        Configurador + Catálogo
      </span>

      <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight font-bold text-text-primary sm:text-5xl">
        Arma tu <span className="text-primary-500">PC ideal</span> en minutos
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary sm:text-base">
        Selecciona cada componente paso a paso: solo verás piezas compatibles entre sí. Valida tu
        build, cotízala al instante o encarga tu armado desde el catálogo.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onPress={() => router.push("/configurador")}>
          <BagShopping2 className="size-5" />
          Arma tu PC
        </Button>
        <Button
          size="lg"
          variant="success"
          appearance="outline"
          onPress={() => router.push("/catalogo")}
        >
          Explorar catálogo
        </Button>
      </div>

      <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
        {ESTADISTICAS.map((estadistica) => (
          <div key={estadistica.etiqueta} className="text-center">
            <dt className="order-2 mt-1 text-xs text-text-secondary">{estadistica.etiqueta}</dt>
            <dd className="order-1 text-xl font-bold text-primary-500">{estadistica.valor}</dd>
          </div>
        ))}
      </dl>

      <ChevronDown className="mx-auto mt-10 size-5 animate-bounce text-input-placeholder-text" />
    </section>
  );
}