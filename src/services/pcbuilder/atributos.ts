import type { AtributosProducto } from "./types";

export function texto(attrs: AtributosProducto, clave: string): string | undefined {
  const valor = attrs[clave];
  return valor === undefined || valor.trim() === "" ? undefined : valor.trim();
}

export function numero(attrs: AtributosProducto, clave: string): number | undefined {
  const valor = texto(attrs, clave);
  if (valor === undefined) return undefined;
  const n = Number(valor.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

export function booleano(attrs: AtributosProducto, clave: string): boolean {
  const valor = texto(attrs, clave)?.toLowerCase();
  return valor === "true" || valor === "si" || valor === "1";
}

export function lista(attrs: AtributosProducto, clave: string): string[] {
  const valor = texto(attrs, clave);
  if (!valor) return [];
  return valor
    .split(",")
    .map((parte) => parte.trim())
    .filter(Boolean);
}
