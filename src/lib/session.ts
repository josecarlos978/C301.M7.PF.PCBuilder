import { createHmac, timingSafeEqual } from "node:crypto";

// Sesión stateless para el login del admin: un token `payload.firma` firmado con
// HMAC-SHA256, sin librerías externas (jose/iron-session). Un solo admin, sin tabla
// de usuarios — ver documentos/03.Especificaciones para el agente/06.Credenciales.md.

export const NOMBRE_COOKIE_SESION = "pcbuilder_admin_session";

const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
export const DURACION_SESION_SEGUNDOS = DURACION_SESION_MS / 1000;

function obtenerSecreto(): string {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) {
    throw new Error("SESSION_SECRET no está definida en las variables de entorno");
  }
  return secreto;
}

function firmar(payloadB64: string): string {
  return createHmac("sha256", obtenerSecreto()).update(payloadB64).digest("base64url");
}

export function crearTokenSesion(): string {
  const payload = JSON.stringify({ exp: Date.now() + DURACION_SESION_MS });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  return `${payloadB64}.${firmar(payloadB64)}`;
}

export function tokenSesionValido(token: string | undefined | null): boolean {
  if (!token) return false;

  const [payloadB64, firma] = token.split(".");
  if (!payloadB64 || !firma) return false;

  const firmaEsperada = firmar(payloadB64);
  const bufFirma = Buffer.from(firma);
  const bufEsperada = Buffer.from(firmaEsperada);
  if (bufFirma.length !== bufEsperada.length || !timingSafeEqual(bufFirma, bufEsperada)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
