"use client";

import { useState } from "react";
import { BagShopping2 } from "@tailgrids/icons";
import { Sheet, SheetOverlay, SheetTrigger } from "@/components/tailgrids/core/sheet";
import { useCarrito } from "./carrito-context";
import { CarritoSheet } from "./carrito-sheet";

export function CarritoTrigger() {
  const [abierto, setAbierto] = useState(false);
  const { cantidadItems } = useCarrito();

  return (
    <Sheet isOpen={abierto} onOpenChange={setAbierto}>
      <SheetTrigger
        aria-label={`Abrir carrito (${cantidadItems} producto(s))`}
        className="relative flex size-9 items-center justify-center rounded-lg border border-card-border bg-card-background text-text-secondary transition outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <BagShopping2 className="size-5" />
        {cantidadItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white-100">
            {cantidadItems}
          </span>
        )}
      </SheetTrigger>
      <SheetOverlay isDismissable />
      <CarritoSheet onOpenChange={setAbierto} />
    </Sheet>
  );
}