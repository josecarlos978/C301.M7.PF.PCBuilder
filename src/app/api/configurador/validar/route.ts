import { error, leerJSON, ok } from "@/services/api/shared/http";
import { validarConfiguracion } from "@/services/api/configurador/service";
import type { SeleccionConfiguracion } from "@/services/pcbuilder/types";

export async function POST(request: Request) {
  const seleccion = await leerJSON<SeleccionConfiguracion>(request);
  if (!seleccion) return error("Cuerpo de la petición inválido");

  try {
    const resultado = await validarConfiguracion(seleccion);
    return ok(resultado);
  } catch (e) {
    return error("No se pudo validar la configuración", 500, String(e));
  }
}
