"use client";

import { Cart2, Chip2, CreditCard, UserMultiple1 } from "@tailgrids/icons";
import { Card } from "@/components/tailgrids/core/card";
import type { TotalesPanel } from "@/services/api/reportes/types";
import formatCurrency from "@/utils/format-currency";

interface KpiCardsProps {
  totales: TotalesPanel;
}

export function KpiCards({ totales }: KpiCardsProps) {
  const tarjetas = [
    {
      etiqueta: "Clientes registrados",
      valor: String(totales.clientes),
      Icono: UserMultiple1,
    },
    {
      etiqueta: "Productos en inventario",
      valor: String(totales.productos),
      Icono: Chip2,
    },
    {
      etiqueta: "Cotizaciones emitidas",
      valor: String(totales.cotizaciones),
      Icono: Cart2,
    },
    {
      etiqueta: "Ticket promedio",
      valor: formatCurrency(totales.ticketPromedio),
      Icono: CreditCard,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ etiqueta, valor, Icono }) => (
        <Card key={etiqueta} className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm text-text-secondary">{etiqueta}</p>
            <p className="mt-1 text-xl font-semibold text-text-primary">{valor}</p>
          </div>
          <span className="flex size-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 [&>svg]:size-6 dark:bg-white/5">
            <Icono />
          </span>
        </Card>
      ))}
    </div>
  );
}
