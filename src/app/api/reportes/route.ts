import { error, ok } from "@/services/api/shared/http";
import { generarReporte } from "@/services/api/reportes/service";

export async function GET() {
  try {
    return ok(await generarReporte());
  } catch (e) {
    return error("No se pudo generar el reporte", 500, String(e));
  }
}
