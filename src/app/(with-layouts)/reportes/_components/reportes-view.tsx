"use client";

import { useQuery } from "@tanstack/react-query";
import { Download1, FileFormatPdf } from "@tailgrids/icons";
import { KpiCards } from "@/components/crm/shared/kpi-cards";
import { PageHeader } from "@/components/crm/shared/page-header";
import { TablaTopProductos } from "@/components/crm/shared/tabla-top-productos";
import { Button } from "@/components/tailgrids/core/button";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import { generarReporte } from "@/services/api/reportes/client";
import { ChartEstados } from "./chart-estados-pie";
import { ChartIngresosMes } from "./chart-ingresos-mes";
import { descargarExcelReporte } from "./reporte-excel";
import { descargarPdfReporte } from "./reporte-pdf";

export default function ReportesView() {
  const reporteQuery = useQuery({
    queryKey: ["reportes"],
    queryFn: generarReporte,
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Reportes"
        items={[
          { href: "/admin", label: "Home" },
          { href: "/reportes", label: "CRM" },
          { href: "/reportes", label: "Reportes" },
        ]}
        acciones={
          reporteQuery.data && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                appearance="outline"
                onPress={() => descargarExcelReporte(reporteQuery.data)}
              >
                <Download1 className="size-4" />
                Exportar Excel
              </Button>
              <Button
                size="sm"
                appearance="outline"
                onPress={() => descargarPdfReporte(reporteQuery.data)}
              >
                <FileFormatPdf className="size-4" />
                Exportar PDF
              </Button>
            </div>
          )
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        {reporteQuery.isPending ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : reporteQuery.data ? (
          <>
            <KpiCards totales={reporteQuery.data.totales} />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <ChartIngresosMes datos={reporteQuery.data.ingresosPorMes} />
              <ChartEstados datos={reporteQuery.data.cotizacionesPorEstado} />
            </div>
            <TablaTopProductos productos={reporteQuery.data.topProductos} />
          </>
        ) : (
          <p className="text-sm text-text-secondary">No se pudo cargar el reporte.</p>
        )}
      </div>
    </div>
  );
}
