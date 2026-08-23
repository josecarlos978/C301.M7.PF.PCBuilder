import { error, leerJSON, ok } from "@/services/api/shared/http";
import { crearProducto, listarProductos } from "@/services/api/productos/service";
import type { ProductoInput } from "@/services/api/productos/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const productos = await listarProductos({
      categoria: searchParams.get("categoria") ?? undefined,
      busca: searchParams.get("busca") ?? undefined,
    });
    return ok(productos);
  } catch (e) {
    return error("No se pudieron listar los productos", 500, String(e));
  }
}

export async function POST(request: Request) {
  const input = await leerJSON<ProductoInput>(request);
  if (!input) return error("Cuerpo de la petición inválido");

  const { nombre, marca, precioVenta, categoria } = input;
  if (!nombre || !marca || !categoria) {
    return error("nombre, marca y categoria son obligatorios");
  }
  if (typeof precioVenta !== "number" || precioVenta < 0) {
    return error("precioVenta debe ser un número mayor o igual a 0");
  }

  try {
    const producto = await crearProducto(input);
    return ok(producto, 201);
  } catch (e) {
    return error("No se pudo crear el producto", 500, String(e));
  }
}
