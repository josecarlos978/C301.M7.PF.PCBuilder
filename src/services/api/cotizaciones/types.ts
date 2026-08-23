import { ESTADOS_COTIZACION, type EstadoCotizacion } from "@/services/pcbuilder/constants";

export interface DetalleCotizacionInput {
  productoId: number;
  cantidad: number;
}

export interface CotizacionInput {
  clienteId: number;
  estado?: EstadoCotizacion;
  detalles: DetalleCotizacionInput[];
}

export interface CotizacionFiltros {
  clienteId?: number;
  estado?: string;
}

export { ESTADOS_COTIZACION };
export type { EstadoCotizacion };
