"use client";

import { Minus, Plus } from "@tailgrids/icons";
import { useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";

interface AtributosEditorProps {
  inicial?: Record<string, string>;
  onChange: (atributos: Record<string, string>) => void;
}

interface ParAtributo {
  clave: string;
  valor: string;
}

function aPares(inicial?: Record<string, string>): ParAtributo[] {
  const pares = Object.entries(inicial ?? {}).map(([clave, valor]) => ({ clave, valor }));
  return pares.length === 0 ? [{ clave: "", valor: "" }] : pares;
}

export function AtributosEditor({ inicial, onChange }: AtributosEditorProps) {
  const [pares, setPares] = useState<ParAtributo[]>(() => aPares(inicial));

  function aplicar(nuevos: ParAtributo[]) {
    setPares(nuevos);
    const limpios = nuevos.filter((p) => p.clave.trim() !== "");
    onChange(Object.fromEntries(limpios.map((p) => [p.clave.trim(), p.valor])));
  }

  function actualizar(indice: number, campo: keyof ParAtributo, texto: string) {
    aplicar(pares.map((par, i) => (i === indice ? { ...par, [campo]: texto } : par)));
  }

  function agregar() {
    setPares((prev) => [...prev, { clave: "", valor: "" }]);
  }

  function quitar(indice: number) {
    const nuevos = pares.filter((_, i) => i !== indice);
    aplicar(nuevos.length > 0 ? nuevos : [{ clave: "", valor: "" }]);
  }

  return (
    <div className="space-y-2">
      <Label>Especificaciones técnicas</Label>
      <div className="space-y-2">
        {pares.map((par, indice) => (
          <div key={indice} className="flex items-center gap-2">
            <Input
              aria-label={`Clave del atributo ${indice + 1}`}
              placeholder="clave (ej. socket)"
              value={par.clave}
              onChange={(e) => actualizar(indice, "clave", e.target.value)}
              className="flex-1"
            />
            <Input
              aria-label={`Valor del atributo ${indice + 1}`}
              placeholder="valor (ej. AM5)"
              value={par.valor}
              onChange={(e) => actualizar(indice, "valor", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="danger"
              appearance="ghost"
              size="xs"
              iconOnly
              aria-label={`Quitar atributo ${indice + 1}`}
              onPress={() => quitar(indice)}
            >
              <Minus className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="primary" appearance="outline" size="sm" onPress={agregar}>
        <Plus className="size-4" />
        Añadir atributo
      </Button>
    </div>
  );
}
