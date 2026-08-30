"use client";

import { numero } from "@/services/pcbuilder/atributos";
import type { ProductoDTO } from "@/services/pcbuilder/types";

interface RamInfoProps {
  placa?: ProductoDTO;
  cantidadModulos: number;
  capacidadGB: number;
}

export function RamInfo({ placa, cantidadModulos, capacidadGB }: RamInfoProps) {
  if (!placa) {
    return (
      <p className="rounded-lg border border-dashed border-card-border bg-card-background px-4 py-3 text-xs text-text-secondary">
        Selecciona una placa madre para conocer los límites de RAM de tu build.
      </p>
    );
  }

  const slots = numero(placa.atributos, "ramSlots");
  const maxGB = numero(placa.atributos, "maxMemoriaGB");

  return (
    <div className="rounded-lg border border-card-border bg-card-background px-4 py-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-text-secondary">Límites de la placa:</span>
        <span className="truncate font-medium text-text-primary">{placa.nombre}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1 text-text-secondary">
          Ranuras: <span className="font-semibold text-text-primary">{slots ?? "—"}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-text-secondary">
          Capacidad máx.:{" "}
          <span className="font-semibold text-text-primary">{maxGB ? `${maxGB} GB` : "—"}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-text-secondary">
          Seleccionado:{" "}
          <span className="font-semibold text-text-primary">
            {cantidadModulos} módulo(s) · {capacidadGB} GB
          </span>
        </span>
      </div>
    </div>
  );
}