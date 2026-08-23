import type { EvaluacionProducto, ResultadoValidacion, SeleccionConfiguracion } from "@/services/pcbuilder/types";
import { apiGet, apiPost } from "@/services/api/shared/client-http";
import type { Paso } from "@/services/pcbuilder/constants";

interface RespuestaOpciones {
  paso: Paso;
  opciones: EvaluacionProducto[];
}

export interface ValidacionCompleta extends ResultadoValidacion {
  seleccion: import("@/services/pcbuilder/types").ProductosResueltos;
}

function construirQuery(seleccion: SeleccionConfiguracion): string {
  const params = new URLSearchParams();
  if (seleccion.cpuId) params.set("cpuId", String(seleccion.cpuId));
  if (seleccion.placaId) params.set("placaId", String(seleccion.placaId));
  if (seleccion.ramIds?.length) params.set("ramIds", seleccion.ramIds.join(","));
  if (seleccion.gpuId) params.set("gpuId", String(seleccion.gpuId));
  if (seleccion.coolerId) params.set("coolerId", String(seleccion.coolerId));
  if (seleccion.caseId) params.set("caseId", String(seleccion.caseId));
  if (seleccion.psuId) params.set("psuId", String(seleccion.psuId));
  return params.toString();
}

export function obtenerOpcionesPaso(
  paso: Exclude<Paso, "cpu">,
  seleccion: SeleccionConfiguracion,
): Promise<RespuestaOpciones> {
  return apiGet(`/api/configurador/opciones?paso=${paso}&${construirQuery(seleccion)}`);
}

export function validarConfiguracion(
  seleccion: SeleccionConfiguracion,
): Promise<ValidacionCompleta> {
  return apiPost("/api/configurador/validar", seleccion);
}
