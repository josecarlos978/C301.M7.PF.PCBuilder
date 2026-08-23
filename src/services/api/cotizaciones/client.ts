import type { CotizacionFiltros, CotizacionInput, DetalleCotizacionInput } from "./types";
import type { EstadoCotizacion } from "@/services/pcbuilder/constants";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api/shared/client-http";

export type { DetalleCotizacionInput };

export interface DetalleCotizacionDTO {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto: {
    id: number;
    nombre: string;
    marca: string;
    categoria: string;
  };
}

export interface CotizacionDTO {
  id: number;
  clienteId: number;
  fecha: string;
  total: number;
  estado: EstadoCotizacion | string;
  cliente: { id: number; nombre: string; correo: string; telefono: string | null };
  detalles: DetalleCotizacionDTO[];
}

export function listarCotizaciones(filtros: CotizacionFiltros = {}): Promise<CotizacionDTO[]> {
  const params = new URLSearchParams();
  if (filtros.clienteId !== undefined) params.set("clienteId", String(filtros.clienteId));
  if (filtros.estado) params.set("estado", filtros.estado);
  const query = params.toString();
  return apiGet(`/api/cotizaciones${query ? `?${query}` : ""}`);
}

export function obtenerCotizacion(id: number): Promise<CotizacionDTO> {
  return apiGet(`/api/cotizaciones/${id}`);
}

export function crearCotizacion(input: CotizacionInput): Promise<CotizacionDTO> {
  return apiPost("/api/cotizaciones", input);
}

export function cambiarEstadoCotizacion(id: number, estado: string): Promise<CotizacionDTO> {
  return apiPatch(`/api/cotizaciones/${id}`, { estado });
}

export function eliminarCotizacion(id: number): Promise<{ eliminado: boolean }> {
  return apiDelete(`/api/cotizaciones/${id}`);
}
