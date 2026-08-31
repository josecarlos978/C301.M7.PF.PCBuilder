import formatCurrency from "@/utils/format-currency";
import type { ItemCarrito } from "./carrito-context";
import { ProductoImagen } from "./producto-imagen";

interface ResumenProductosCarritoProps {
  items: ItemCarrito[];
}

export function ResumenProductosCarrito({ items }: ResumenProductosCarritoProps) {
  return (
    <div className="flex max-h-48 flex-col gap-2 overflow-y-auto rounded-lg border border-card-border p-2">
      {items.map(({ producto, cantidad }) => (
        <div key={producto.id} className="flex items-center gap-2.5">
          <ProductoImagen
            imagenUrl={producto.imagenUrl}
            nombre={producto.nombre}
            className="size-10 shrink-0 rounded-md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-text-primary">{producto.nombre}</p>
            <p className="text-xs text-text-secondary">Cantidad: {cantidad}</p>
          </div>
          <p className="shrink-0 text-xs font-semibold text-text-primary">
            {formatCurrency(producto.precioVenta * cantidad)}
          </p>
        </div>
      ))}
    </div>
  );
}
