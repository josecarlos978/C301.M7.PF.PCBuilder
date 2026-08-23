export interface CotizacionesPorEstado {
  estado: string;
  cantidad: number;
}

export interface IngresosMes {
  mes: string;
  cotizaciones: number;
  confirmadas: number;
  ingresos: number;
}

export interface ProductoCotizado {
  productoId: number;
  nombre: string;
  marca: string;
  categoria: string;
  vecesCotizado: number;
  unidades: number;
  ingresoAsociado: number;
}

export interface TotalesPanel {
  clientes: number;
  productos: number;
  cotizaciones: number;
  valorTotalCotizado: number;
  ticketPromedio: number;
}

export interface ReporteCompleto {
  generadoEn: string;
  mesesHistorico: number;
  totales: TotalesPanel;
  cotizacionesPorEstado: CotizacionesPorEstado[];
  ingresosPorMes: IngresosMes[];
  topProductos: ProductoCotizado[];
}
