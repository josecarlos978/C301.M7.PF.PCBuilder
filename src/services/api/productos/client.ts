import type { ProductoInput } from "./types";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api/shared/client-http";
import type { ProductoDTO } from "@/services/pcbuilder/types";

export type { ProductoDTO };

export function listarProductos(filtros: { categoria?: string; busca?: string } = {}): Promise<ProductoDTO[]> {
  const params = new URLSearchParams();
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.busca) params.set("busca", filtros.busca);
  const query = params.toString();
  return apiGet(`/api/productos${query ? `?${query}` : ""}`);
}

export function crearProducto(input: ProductoInput): Promise<ProductoDTO> {
  return apiPost("/api/productos", input);
}

export function actualizarProducto(id: number, input: Partial<ProductoInput>): Promise<ProductoDTO> {
  return apiPatch(`/api/productos/${id}`, input);
}

export function eliminarProducto(id: number): Promise<{ eliminado: boolean }> {
  return apiDelete(`/api/productos/${id}`);
}
