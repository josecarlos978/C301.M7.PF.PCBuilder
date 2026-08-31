"use client";

import { Minus, Plus, Trash1 } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import formatCurrency from "@/utils/format-currency";
import type { ItemCarrito } from "./carrito-context";

interface CarritoItemRowProps {
  item: ItemCarrito;
  onSumar: () => void;
  onRestar: () => void;
  onQuitar: () => void;
}

export function CarritoItemRow({ item, onSumar, onRestar, onQuitar }: CarritoItemRowProps) {
  const { producto, cantidad } = item;

  return (
    <div className="flex gap-3 rounded-xl border border-card-border bg-card-background p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{producto.nombre}</p>
        <p className="text-xs text-text-secondary">
          {producto.marca} · {producto.categoria}
        </p>
        <p className="mt-1 text-sm font-medium text-text-primary">
          {formatCurrency(producto.precioVenta * cantidad)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <Button
          variant="danger"
          appearance="ghost"
          size="xs"
          iconOnly
          onPress={onQuitar}
          aria-label={`Quitar ${producto.nombre} del carrito`}
        >
          <Trash1 className="size-3.5" />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            size="xs"
            iconOnly
            isDisabled={cantidad <= 1}
            onPress={onRestar}
            aria-label="Disminuir cantidad"
          >
            <Minus className="size-3" />
          </Button>
          <span className="w-6 text-center text-xs font-semibold text-text-primary">
            {cantidad}
          </span>
          <Button appearance="outline" size="xs" iconOnly onPress={onSumar} aria-label="Aumentar cantidad">
            <Plus className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}