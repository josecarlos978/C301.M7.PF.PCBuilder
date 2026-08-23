"use client";

import { Card } from "@/components/tailgrids/core/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/tailgrids/core/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { IngresosMes } from "@/services/api/reportes/types";
import formatCurrency from "@/utils/format-currency";

interface ChartIngresosMesProps {
  datos: IngresosMes[];
}

export function ChartIngresosMes({ datos }: ChartIngresosMesProps) {
  return (
    <Card className="p-0">
      <div className="border-b border-card-border px-6 py-4">
        <h3 className="text-base font-medium text-text-primary">Ingresos confirmados por mes</h3>
        <p className="text-sm text-text-secondary">Últimos {datos.length} meses</p>
      </div>

      <div className="p-6">
        <div className="h-67.5 w-full">
          <ChartContainer className="h-full w-full" height={270} width="100%">
            <BarChart data={datos} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(valor) => `$${Number(valor) / 1000}k`} />
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={
                  <ChartTooltipContent
                    formatter={(valor) => (
                      <span className="text-sm font-medium text-title-50">
                        Ingresos: {formatCurrency(Number(valor))}
                      </span>
                    )}
                    labelFormatter={(mes) => `Mes ${String(mes)}`}
                  />
                }
              />
              <Bar dataKey="ingresos" fill="var(--color-brand-500)" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
}
