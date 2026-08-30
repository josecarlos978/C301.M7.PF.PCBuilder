"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertIndicator } from "@/components/tailgrids/core/alert";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import type { ProductoDTO } from "@/services/pcbuilder/types";
import { listarProductos } from "@/services/api/productos/client";
import { useCarrito } from "@/components/tienda/carrito-context";
import { ProductoCard } from "@/components/tienda/producto-card";
import { FiltrosCatalogo } from "./filtros-catalogo";

export function CatalogoView() {
  const query = useQuery({
    queryKey: ["catalogo", "productos"],
    queryFn: () => listarProductos(),
    staleTime: 60_000,
  });
  const carrito = useCarrito();
  const [categoria, setCategoria] = useState("todas");
  const [subcategoria, setSubcategoria] = useState("todas");
  const [busca, setBusca] = useState("");

  const productos = useMemo(() => query.data ?? [], [query.data]);

  const categorias = useMemo(
    () =>
      Array.from(new Set(productos.map((p) => p.categoria)))
        .filter(Boolean)
        .sort(),
    [productos],
  );

  const subcategorias = useMemo(
    () =>
      Array.from(
        new Set(
          productos
            .filter((p) => categoria === "todas" || p.categoria === categoria)
            .map((p) => p.subcategoria),
        ),
      )
        .filter(Boolean)
        .sort(),
    [productos, categoria],
  );

  const filtrados = useMemo(() => {
    const termino = busca.trim().toLowerCase();
    return productos.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (subcategoria !== "todas" && p.subcategoria !== subcategoria) return false;
      if (termino !== "") {
        const coincide =
          p.nombre.toLowerCase().includes(termino) ||
          p.marca.toLowerCase().includes(termino) ||
          p.subcategoria.toLowerCase().includes(termino);
        if (!coincide) return false;
      }
      return true;
    });
  }, [productos, categoria, subcategoria, busca]);

  function agregarAlCarrito(producto: ProductoDTO) {
    carrito.agregar(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  }

  return (
    <div className="mx-auto w-full max-w-384 space-y-6 px-4 py-8 sm:px-6">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Catálogo de <span className="text-primary-500">productos</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
          Explora todo el stock de {categorias.length > 0 ? `PCBuilder (${productos.length} productos)` : "PCBuilder"}. Filtra
          por categoría o busca tu componente ideal y agrégalo a tu carrito de cotización.
        </p>
      </section>

      <FiltrosCatalogo
        categorias={categorias}
        subcategorias={subcategorias}
        categoria={categoria}
        subcategoria={subcategoria}
        busca={busca}
        total={filtrados.length}
        onCategoria={(valor) => {
          setCategoria(valor);
          setSubcategoria("todas");
        }}
        onSubcategoria={setSubcategoria}
        onBusca={setBusca}
        onLimpiar={() => {
          setCategoria("todas");
          setSubcategoria("todas");
          setBusca("");
        }}
      />

      {query.isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <Alert status="info">
          <AlertIndicator />
          <AlertDescription>
            No hay productos que coincidan con los filtros. Ajusta la búsqueda o limpia los
            filtros.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              enCarrito={carrito.enCarrito(producto.id)}
              onAgregar={() => agregarAlCarrito(producto)}
            />
          ))}
        </div>
      )}
    </div>
  );
}