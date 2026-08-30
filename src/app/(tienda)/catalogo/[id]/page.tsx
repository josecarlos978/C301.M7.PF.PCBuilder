import type { Metadata } from "next";
import { ProductoDetalleView } from "./_components/producto-detalle-view";

export const metadata: Metadata = {
  title: "Detalle de producto",
};

interface ProductoDetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: ProductoDetallePageProps) {
  const { id } = await params;
  return <ProductoDetalleView productoId={Number(id)} />;
}