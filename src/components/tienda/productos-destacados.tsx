"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "@tailgrids/icons";
import { toast } from "sonner";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import type { ProductoDTO } from "@/services/pcbuilder/types";
import { listarProductos } from "@/services/api/productos/client";
import { useCarrito } from "./carrito-context";
import { ProductoCard } from "./producto-card";

export function ProductosDestacados() {
  const query = useQuery({
    queryKey: ["catalogo", "productos"],
    queryFn: () => listarProductos(),
    staleTime: 60_000,
  });
  const carrito = useCarrito();

  const productos = useMemo(() => query.data ?? [], [query.data]);

  const destacados = useMemo(() => {
    const masBaratoPorCategoria = new Map<string, ProductoDTO>();
    for (const producto of productos) {
      const actual = masBaratoPorCategoria.get(producto.categoria);
      if (!actual || producto.precioVenta < actual.precioVenta) {
        masBaratoPorCategoria.set(producto.categoria, producto);
      }
    }
    return Array.from(masBaratoPorCategoria.values())
      .sort((a, b) => a.precioVenta - b.precioVenta)
      .slice(0, 8);
  }, [productos]);

  function agregarAlCarrito(producto: ProductoDTO) {
    carrito.agregar(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  }

  if (!query.isPending && destacados.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Selección de PCBuilder</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Una muestra por categoría con los precios más accesibles del inventario
            {productos.length > 0 && ` (${productos.length} productos en total)`}.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          Ver todos
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {query.isPending ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {destacados.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              enCarrito={carrito.enCarrito(producto.id)}
              onAgregar={() => agregarAlCarrito(producto)}
            />
          ))}
        </div>
      )}
    </section>
  );
}