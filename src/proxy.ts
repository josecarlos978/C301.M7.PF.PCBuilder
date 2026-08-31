import { NextResponse, type NextRequest } from "next/server";
import { NOMBRE_COOKIE_SESION, tokenSesionValido } from "@/lib/session";

// Rutas top-level que resuelven al layout de "src/app/(with-layouts)" (route groups no
// afectan la URL, así que se listan explícitamente en vez de un prefijo único).
const RUTAS_ADMIN = [
  "/admin",
  "/productos",
  "/clientes",
  "/cotizaciones",
  "/reportes",
  "/profile",
  "/form-elements",
  "/tables",
  "/error-page",
  "/terms-and-conditions",
  "/mail-success",
  "/charts",
  "/ui-elements",
];

function esRutaAdmin(pathname: string): boolean {
  return RUTAS_ADMIN.some((ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sesionValida = tokenSesionValido(request.cookies.get(NOMBRE_COOKIE_SESION)?.value);

  if (esRutaAdmin(pathname) && !sesionValida) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && sesionValida) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/productos/:path*",
    "/clientes/:path*",
    "/cotizaciones/:path*",
    "/reportes/:path*",
    "/profile/:path*",
    "/form-elements/:path*",
    "/tables/:path*",
    "/error-page/:path*",
    "/terms-and-conditions/:path*",
    "/mail-success/:path*",
    "/charts/:path*",
    "/ui-elements/:path*",
    "/login",
  ],
};
