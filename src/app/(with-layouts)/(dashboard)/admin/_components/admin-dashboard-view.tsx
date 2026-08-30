"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { KpiCards } from "@/components/crm/shared/kpi-cards";
import { PageHeader } from "@/components/crm/shared/page-header";
import { TablaTopProductos } from "@/components/crm/shared/tabla-top-productos";
import { buttonStyles } from "@/components/tailgrids/core/button";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import { listarCotizaciones } from "@/services/api/cotizaciones/client";
import { generarReporte } from "@/services/api/reportes/client";
import { CotizacionesRecientes } from "./cotizaciones-recientes";

export default function AdminDashboardView() {
  const reporteQuery = useQuery({
    queryKey: ["reportes"],
    queryFn: generarReporte,
  });

  const cotizacionesQuery = useQuery({
    queryKey: ["cotizaciones"],
    queryFn: () => listarCotizaciones(),
  });

  const cargando = reporteQuery.isPending || cotizacionesQuery.isPending;

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Resumen general"
        items={[
          { href: "/admin", label: "Home" },
          { href: "/admin", label: "Panel" },
        ]}
        acciones={
          <Link
            href="/reportes"
            className={buttonStyles({ variant: "primary", appearance: "outline", size: "sm" })}
          >
            Ver reportes completos
          </Link>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        {cargando ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        ) : reporteQuery.data && cotizacionesQuery.data ? (
          <>
            <KpiCards totales={reporteQuery.data.totales} />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <CotizacionesRecientes cotizaciones={cotizacionesQuery.data} />
              <TablaTopProductos productos={reporteQuery.data.topProductos} />
            </div>
          </>
        ) : (
          <p className="text-sm text-text-secondary">No se pudo cargar el resumen.</p>
        )}
      </div>
    </div>
  );
}
