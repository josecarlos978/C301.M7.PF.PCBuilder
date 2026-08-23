import type { AtributosProducto } from "@/services/pcbuilder/types";

export interface ProductoInput {
  nombre: string;
  marca: string;
  precioVenta: number;
  categoria: string;
  subcategoria: string;
  atributos?: AtributosProducto;
}

export interface ProductoFiltros {
  categoria?: string;
  busca?: string;
}
