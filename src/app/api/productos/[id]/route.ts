import { error, leerJSON, ok } from "@/services/api/shared/http";
import { actualizarProducto, eliminarProducto, obtenerProducto } from "@/services/api/productos/service";
import type { ProductoInput } from "@/services/api/productos/types";

interface ContextoId {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const producto = await obtenerProducto(Number(id));
  if (!producto) return error("Producto no encontrado", 404);
  return ok(producto);
}

export async function PATCH(request: Request, contexto: ContextoId) {
  const input = await leerJSON<Partial<ProductoInput>>(request);
  if (!input) return error("Cuerpo de la petición inválido");

  const { id } = await contexto.params;
  try {
    const producto = await actualizarProducto(Number(id), input);
    if (!producto) return error("Producto no encontrado", 404);
    return ok(producto);
  } catch (e) {
    return error("No se pudo actualizar el producto", 500, String(e));
  }
}

export async function DELETE(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const eliminado = await eliminarProducto(Number(id));
  if (!eliminado) return error("Producto no encontrado", 404);
  return ok({ eliminado: true });
}
