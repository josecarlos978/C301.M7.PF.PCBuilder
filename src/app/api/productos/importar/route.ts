import { error, leerJSON, ok } from "@/services/api/shared/http";
import { importarProductos } from "@/services/api/productos/service";
import type { ProductoInput } from "@/services/api/productos/types";

export async function POST(request: Request) {
  const body = await leerJSON<{ productos: ProductoInput[] }>(request);
  if (!body || !Array.isArray(body.productos) || body.productos.length === 0) {
    return error("No se recibieron productos para importar");
  }

  for (const producto of body.productos) {
    if (!producto.nombre || !producto.marca || !producto.categoria) {
      return error("Cada producto debe tener nombre, marca y categoria");
    }
    if (typeof producto.precioVenta !== "number" || producto.precioVenta < 0) {
      return error("precioVenta debe ser un número mayor o igual a 0 en todos los productos");
    }
  }

  try {
    const importados = await importarProductos(body.productos);
    return ok({ importados }, 201);
  } catch (e) {
    return error("No se pudo completar la importación", 500, String(e));
  }
}
