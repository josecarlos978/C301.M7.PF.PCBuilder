export interface AtributosProducto {
  [clave: string]: string;
}

export type { Paso } from "./constants";

export interface ProductoDTO {
  id: number;
  nombre: string;
  marca: string;
  precioVenta: number;
  categoria: string;
  subcategoria: string;
  atributos: AtributosProducto;
}

export interface SeleccionConfiguracion {
  cpuId?: number;
  placaId?: number;
  ramIds?: number[];
  gpuId?: number;
  coolerId?: number;
  caseId?: number;
  psuId?: number;
}

export interface ProductosResueltos {
  cpu?: ProductoDTO;
  placa?: ProductoDTO;
  ram: ProductoDTO[];
  gpu?: ProductoDTO;
  cooler?: ProductoDTO;
  case?: ProductoDTO;
  psu?: ProductoDTO;
}

export interface EvaluacionProducto {
  producto: ProductoDTO;
  compatible: boolean;
  motivos: string[];
}

export interface ResultadoValidacion {
  valido: boolean;
  errores: string[];
  advertencias: string[];
}
