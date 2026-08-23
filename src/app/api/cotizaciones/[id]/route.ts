import { error, leerJSON, ok } from "@/services/api/shared/http";
import { cambiarEstado, eliminarCotizacion, obtenerCotizacion } from "@/services/api/cotizaciones/service";
import { ESTADOS_COTIZACION } from "@/services/pcbuilder/constants";

interface ContextoId {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const cotizacion = await obtenerCotizacion(Number(id));
  if (!cotizacion) return error("Cotización no encontrada", 404);
  return ok(cotizacion);
}

export async function PATCH(request: Request, contexto: ContextoId) {
  const input = await leerJSON<{ estado?: string }>(request);
  if (!input?.estado) return error("estado es obligatorio");
  if (!(ESTADOS_COTIZACION as readonly string[]).includes(input.estado)) {
    return error(`estado debe ser uno de: ${ESTADOS_COTIZACION.join(", ")}`);
  }

  const { id } = await contexto.params;
  try {
    const cotizacion = await cambiarEstado(Number(id), input.estado as (typeof ESTADOS_COTIZACION)[number]);
    if (!cotizacion) return error("Cotización no encontrada", 404);
    return ok(cotizacion);
  } catch (e) {
    return error("No se pudo actualizar la cotización", 500, String(e));
  }
}

export async function DELETE(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const eliminado = await eliminarCotizacion(Number(id));
  if (!eliminado) return error("Cotización no encontrada", 404);
  return ok({ eliminado: true });
}
