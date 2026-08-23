import type { Metadata } from "next";
import ProductosView from "./_components/productos-view";

export const metadata: Metadata = {
  title: "Productos",
};

export default function ProductosPage() {
  return <ProductosView />;
}
