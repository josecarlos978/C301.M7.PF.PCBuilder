"use client";

import { BagShopping2, Check, Download1, Trash1, Whatsapp } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import type { ProductoDTO } from "@/services/pcbuilder/types";
import formatCurrency from "@/utils/format-currency";

export interface FilaResumen {
  etiqueta: string;
  obligatorio: boolean;
  productos: ProductoDTO[];
}

interface ResumenPanelProps {
  filas: FilaResumen[];
  total: number;
  validando: boolean;
  puedeEnviar: boolean;
  onValidar: () => void;
  onComprarOnline: () => void;
  onDescargar: () => void;
  onEnviarWhatsApp: () => void;
  onLimpiar: () => void;
}

export function ResumenPanel({
  filas,
  total,
  validando,
  puedeEnviar,
  onValidar,
  onComprarOnline,
  onDescargar,
  onEnviarWhatsApp,
  onLimpiar,
}: ResumenPanelProps) {
  return (
    <Card className="p-0">
      <CardHeader className="border-b border-card-border px-5 py-4">
        <CardTitle level={4}>Tu cotización</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ul className="space-y-3">
          {filas.map((fila) => (
            <li key={fila.etiqueta} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-text-secondary">
                {fila.etiqueta}
                {!fila.obligatorio && <span className="ml-1 text-xs">(opcional)</span>}
              </span>
              <div className="text-right">
                {fila.productos.length === 0 ? (
                  <span className="text-xs text-input-placeholder-text">Sin seleccionar</span>
                ) : (
                  fila.productos.map((p) => (
                    <p key={p.id} className="font-medium text-text-primary">
                      {p.nombre}
                      <span className="block text-xs font-normal text-text-secondary">
                        {formatCurrency(p.precioVenta)}
                      </span>
                    </p>
                  ))
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-card-border pt-4">
          <span className="text-sm font-medium text-text-secondary">Total estimado</span>
          <span className="text-lg font-semibold text-text-primary">{formatCurrency(total)}</span>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button onPress={onValidar} isDisabled={validando}>
            <Check className="size-4" />
            {validando ? "Validando..." : "Validar compatibilidad"}
          </Button>
          <Button variant="success" onPress={onComprarOnline} isDisabled={!puedeEnviar}>
            <BagShopping2 className="size-4" />
            Comprar Online
          </Button>
          <Button
            variant="success"
            appearance="outline"
            onPress={onEnviarWhatsApp}
            isDisabled={!puedeEnviar}
          >
            <Whatsapp className="size-4" />
            Enviar por WhatsApp
          </Button>
          <Button appearance="outline" onPress={onDescargar}>
            <Download1 className="size-4" />
            Descargar cotización
          </Button>
          <Button variant="danger" appearance="ghost" size="sm" onPress={onLimpiar}>
            <Trash1 className="size-4" />
            Empezar de nuevo
          </Button>
        </div>
        {!puedeEnviar && !validando && (
          <p className="mt-3 text-center text-xs text-input-placeholder-text">
            Valida tu build para habilitar el envío y la descarga.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
