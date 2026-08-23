"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card } from "@/components/tailgrids/core/card";
import { ChartContainer, ChartTooltip } from "@/components/tailgrids/core/chart";
import type { CotizacionesPorEstado } from "@/services/api/reportes/types";

interface ChartEstadosProps {
  datos: CotizacionesPorEstado[];
}

const COLOR_POR_ESTADO: Record<string, string> = {
  Confirmada: "var(--color-success-500)",
  Borrador: "var(--color-warning-500)",
  Rechazada: "var(--color-error-500)",
};

export function ChartEstados({ datos }: ChartEstadosProps) {
  const total = datos.reduce((suma, d) => suma + d.cantidad, 0);
  const segmentos = datos.map((d) => ({ ...d, color: COLOR_POR_ESTADO[d.estado] ?? "var(--color-brand-300)" }));

  return (
    <Card className="p-0">
      <div className="border-b border-card-border px-6 py-4">
        <h3 className="text-base font-medium text-text-primary">Cotizaciones por estado</h3>
        <p className="text-sm text-text-secondary">Histórico completo</p>
      </div>

      <div className="p-6">
        <div className="flex h-67.5 flex-col items-center justify-between">
          <div className="relative flex w-full flex-1 items-center justify-center">
            {total === 0 ? (
              <p className="text-sm text-text-secondary">Aún no hay cotizaciones registradas.</p>
            ) : (
              <ChartContainer className="h-full w-full" height={210} width="100%" aspect={undefined}>
                <PieChart>
                  <ChartTooltip cursor={{ fill: "transparent" }} />
                  <Pie
                    data={segmentos}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="cantidad"
                    nameKey="estado"
                    stroke="none"
                  >
                    {segmentos.map((segmento) => (
                      <Cell key={segmento.estado} fill={segmento.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>

          <div className="flex w-full flex-wrap justify-center gap-3 pt-4">
            {segmentos.map((segmento) => (
              <div key={segmento.estado} className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs" style={{ backgroundColor: segmento.color }} />
                <span className="text-sm font-medium text-text-secondary">
                  {segmento.estado} · {segmento.cantidad}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
