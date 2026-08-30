import type { Metadata } from "next";
import { CatalogoView } from "./_components/catalogo-view";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora todos los productos de PCBuilder: procesadores, placas, memorias, GPUs, casos y más. Filtra por categoría y agrega a tu carrito de cotización.",
};

export default function CatalogoPage() {
  return <CatalogoView />;
}