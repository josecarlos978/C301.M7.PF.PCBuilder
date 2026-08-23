import type { ReporteCompleto } from "./types";
import { apiGet } from "@/services/api/shared/client-http";

export type { ReporteCompleto };

export function generarReporte(): Promise<ReporteCompleto> {
  return apiGet("/api/reportes");
}
