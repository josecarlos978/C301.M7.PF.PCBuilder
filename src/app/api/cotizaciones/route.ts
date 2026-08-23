import { error, leerJSON, ok } from "@/services/api/shared/http";
import { crearCotizacion, listarCotizaciones } from "@/services/api/cotizaciones/service";
import { ESTADOS_COTIZACION } from "@/services/pcbuilder/constants";
import type { CotizacionInput } from "@/services/api/cotizaciones/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const clienteId = searchParams.get("clienteId");
    const cotizaciones = await listarCotizaciones({
      clienteId: clienteId ? Number(clienteId) : undefined,
      estado: searchParams.get("estado") ?? undefined,
    });
    return ok(cotizaciones);
  } catch (e) {
    return error("No se pudieron listar las cotizaciones", 500, String(e));
  }
}

export async function POST(request: Request) {
  const input = await leerJSON<CotizacionInput>(request);
  if (!input) return error("Cuerpo de la petición inválido");

  if (typeof input.clienteId !== "number") return error("clienteId es obligatorio");
  if (!Array.isArray(input.detalles) || input.detalles.length === 0) {
    return error("La cotización requiere al menos un detalle");
  }

  const detallesInvalidos = input.detalles.some(
    (d) => typeof d.productoId !== "number" || typeof d.cantidad !== "number" || d.cantidad < 1,
  );
  if (detallesInvalidos) return error("Cada detalle requiere productoId y cantidad >= 1");

  const estadoValido =
    input.estado === undefined || (ESTADOS_COTIZACION as readonly string[]).includes(input.estado);
  if (!estadoValido) return error(`estado debe ser uno de: ${ESTADOS_COTIZACION.join(", ")}`);

  try {
    const cotizacion = await crearCotizacion(input);
    return ok(cotizacion, 201);
  } catch (e) {
    return error(e instanceof Error ? e.message : "No se pudo crear la cotización", 400);
  }
}
