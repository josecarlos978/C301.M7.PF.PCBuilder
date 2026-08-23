import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(mensaje: string, status = 400, detalles?: unknown) {
  return NextResponse.json({ error: mensaje, detalles }, { status });
}

export async function leerJSON<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
