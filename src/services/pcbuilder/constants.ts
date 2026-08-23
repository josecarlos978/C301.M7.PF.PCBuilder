export const PASOS = ["cpu", "placa", "ram", "gpu", "cooler", "case", "psu"] as const;

export type Paso = (typeof PASOS)[number];

export const CATEGORIA_POR_PASO: Record<Paso, string> = {
  cpu: "Procesadores",
  placa: "Mainboard",
  ram: "Memoria RAM",
  gpu: "Tarjetas de Video",
  cooler: "Cooler",
  case: "Cases",
  psu: "Fuente de Poder",
};

export const ESTADOS_COTIZACION = ["Borrador", "Confirmada", "Rechazada"] as const;

export type EstadoCotizacion = (typeof ESTADOS_COTIZACION)[number];
