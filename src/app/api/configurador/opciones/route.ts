import { error, ok } from "@/services/api/shared/http";
import { obtenerOpciones } from "@/services/api/configurador/service";
import { esPasoValido } from "@/services/api/productos/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const paso = searchParams.get("paso");
  if (!paso) return error("El parámetro paso es obligatorio");
  if (!esPasoValido(paso)) return error("paso inválido");
  if (paso === "cpu") return error("Use GET /api/productos?categoria=Procesadores para opciones de CPU");

  const seleccion = {
    cpuId: numeroDe(searchParams.get("cpuId")),
    placaId: numeroDe(searchParams.get("placaId")),
    gpuId: numeroDe(searchParams.get("gpuId")),
    coolerId: numeroDe(searchParams.get("coolerId")),
    caseId: numeroDe(searchParams.get("caseId")),
    psuId: numeroDe(searchParams.get("psuId")),
  };

  try {
    const evaluaciones = await obtenerOpciones(paso, seleccion);
    return ok({ paso, seleccion, opciones: evaluaciones });
  } catch (e) {
    return error("No se pudieron obtener las opciones", 500, String(e));
  }
}

function numeroDe(valor: string | null): number | undefined {
  if (!valor) return undefined;
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}
