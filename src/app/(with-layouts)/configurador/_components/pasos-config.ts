import type { Paso } from "@/services/pcbuilder/constants";

export interface DefinicionPaso {
  paso: Paso;
  etiqueta: string;
  descripcion: string;
}

export const DEFINICION_PASOS: DefinicionPaso[] = [
  { paso: "cpu", etiqueta: "CPU", descripcion: "Procesador" },
  { paso: "placa", etiqueta: "Placa madre", descripcion: "Mainboard" },
  { paso: "ram", etiqueta: "RAM", descripcion: "Memoria (varios módulos)" },
  { paso: "gpu", etiqueta: "GPU", descripcion: "Tarjeta de video" },
  { paso: "cooler", etiqueta: "Cooler", descripcion: "Refrigeración CPU" },
  { paso: "case", etiqueta: "Case", descripcion: "Gabinete" },
  { paso: "psu", etiqueta: "PSU", descripcion: "Fuente de poder" },
];
