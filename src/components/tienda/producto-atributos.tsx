import type { AtributosProducto } from "@/services/pcbuilder/types";

function formatearClave(clave: string): string {
  return clave
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

export function ProductoAtributos({ atributos }: { atributos: AtributosProducto }) {
  const entradas = Object.entries(atributos);

  if (entradas.length === 0) {
    return <p className="text-sm text-text-secondary">Sin especificaciones registradas.</p>;
  }

  return (
    <dl className="divide-y divide-card-border">
      {entradas.map(([clave, valor]) => (
        <div key={clave} className="flex items-center justify-between gap-3 py-2 text-sm">
          <dt className="text-text-secondary">{formatearClave(clave)}</dt>
          <dd className="text-right font-medium text-text-primary">{valor}</dd>
        </div>
      ))}
    </dl>
  );
}