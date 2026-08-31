"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BagShopping2, Trash1 } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import {
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/tailgrids/core/sheet";
import formatCurrency from "@/utils/format-currency";
import { useCarrito } from "./carrito-context";
import { CarritoItemRow } from "./carrito-item-row";
import { SolicitarCotizacionDialog } from "./solicitar-cotizacion-dialog";

interface CarritoSheetProps {
  onOpenChange: (abierto: boolean) => void;
}

export function CarritoSheet({ onOpenChange }: CarritoSheetProps) {
  const carrito = useCarrito();
  const [solicitarAbierto, setSolicitarAbierto] = useState(false);
  const vacio = carrito.items.length === 0;

  function solicitar() {
    setSolicitarAbierto(true);
    onOpenChange(false);
  }

  return (
    <SheetContent side="right" className="bg-card-surface-area text-text-primary">
      <SheetHeader>
        <SheetTitle>Tu carrito de cotización</SheetTitle>
        <SheetDescription>
          Resumen de los productos que quieres cotizar. Al registrar tu solicitud, un asesor se
          pondrá en contacto contigo.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-3">
        {vacio ? (
          <p className="mt-6 text-center text-sm text-input-placeholder-text">
            Aún no has agregado productos. Explora el catálogo y agrega lo que necesites.
          </p>
        ) : (
          carrito.items.map((item) => (
            <CarritoItemRow
              key={item.producto.id}
              item={item}
              onSumar={() => carrito.actualizarCantidad(item.producto.id, item.cantidad + 1)}
              onRestar={() => carrito.actualizarCantidad(item.producto.id, item.cantidad - 1)}
              onQuitar={() => {
                carrito.quitar(item.producto.id);
                toast.info(`${item.producto.nombre} fue eliminado del carrito`);
              }}
            />
          ))
        )}
      </SheetBody>

      {!vacio && (
        <SheetFooter className="flex-col gap-2">
          <div className="flex items-center justify-between border-t border-card-border pt-2">
            <span className="text-xs font-medium text-text-secondary">Total estimado</span>
            <span className="text-xs font-semibold text-text-primary">
              {formatCurrency(carrito.total)}
            </span>
          </div>
          <Button variant="success" size="sm" className="text-xs" onPress={solicitar}>
            <BagShopping2 className="size-3.5" />
            Solicitar cotización
          </Button>
          <Button variant="danger" appearance="ghost" size="xs" className="text-xs" onPress={carrito.vaciar}>
            <Trash1 className="size-3.5" />
            Vaciar carrito
          </Button>
        </SheetFooter>
      )}

      <SolicitarCotizacionDialog
        abierto={solicitarAbierto}
        onOpenChange={setSolicitarAbierto}
        items={carrito.items}
        total={carrito.total}
        detalles={carrito.items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        }))}
        onRegistrada={() => {
          carrito.vaciar();
          toast.success("Carrito vaciado tras registrar tu solicitud");
        }}
      />
    </SheetContent>
  );
}