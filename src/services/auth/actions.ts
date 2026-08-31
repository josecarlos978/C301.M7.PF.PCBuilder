"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  crearTokenSesion,
  DURACION_SESION_SEGUNDOS,
  NOMBRE_COOKIE_SESION,
} from "@/lib/session";

export interface LoginFormState {
  error?: string;
}

function compararSeguro(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function destinoSeguro(valor: FormDataEntryValue | null): string {
  if (typeof valor !== "string") return "/admin";
  // Solo permite rutas internas relativas (evita redirecciones a otros dominios).
  if (!valor.startsWith("/") || valor.startsWith("//")) return "/admin";
  return valor;
}

export async function login(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const usuario = String(formData.get("usuario") ?? "");
  const clave = String(formData.get("clave") ?? "");
  const destino = destinoSeguro(formData.get("from"));

  const usuarioEsperado = process.env.ADMIN_USER;
  const claveEsperada = process.env.ADMIN_PASSWORD;

  if (!usuarioEsperado || !claveEsperada) {
    return { error: "El login no está configurado (faltan ADMIN_USER/ADMIN_PASSWORD en el servidor)." };
  }

  const credencialesValidas =
    compararSeguro(usuario, usuarioEsperado) && compararSeguro(clave, claveEsperada);

  if (!credencialesValidas) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  const cookieStore = await cookies();
  cookieStore.set(NOMBRE_COOKIE_SESION, crearTokenSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_SESION_SEGUNDOS,
  });

  redirect(destino);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NOMBRE_COOKIE_SESION);
  redirect("/login");
}
