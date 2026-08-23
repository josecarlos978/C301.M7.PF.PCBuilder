import type { Metadata } from "next";
import CotizacionDetalleView from "./_components/cotizacion-detalle-view";

export const metadata: Metadata = {
  title: "Detalle de cotización",
};

interface DetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function CotizacionDetallePage({ params }: DetallePageProps) {
  const { id } = await params;
  return <CotizacionDetalleView id={Number(id)} />;
}
