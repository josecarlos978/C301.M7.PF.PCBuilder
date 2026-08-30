"use client";

import Link from "next/link";
import { Plus } from "@tailgrids/icons";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import type { ProductoDTO } from "@/services/pcbuilder/types";
import formatCurrency from "@/utils/format-currency";

const MAX_ATRIBUTOS = 3;

function formatearClave(clave: string): string {
  return clave
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

interface ProductoCardProps {
  producto: ProductoDTO;
  enCarrito: boolean;
  onAgregar: () => void;
}

export function ProductoCard({ producto, enCarrito, onAgregar }: ProductoCardProps) {
  const atributos = Object.entries(producto.atributos).slice(0, MAX_ATRIBUTOS);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/catalogo/${producto.id}`} className="group min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary transition-colors group-hover:text-primary-500">
            {producto.nombre}
          </p>
          <p className="text-xs text-text-secondary">{producto.marca}</p>
        </Link>
        <Badge color="blue" size="sm">
          {producto.subcategoria}
        </Badge>
      </div>

      <ul className="space-y-1">
        {atributos.map(([clave, valor]) => (
          <li key={clave} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-text-secondary">{formatearClave(clave)}</span>
            <span className="text-right font-medium text-text-primary">{valor}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-card-border pt-3">
        <p className="text-base font-semibold text-text-primary">
          {formatCurrency(producto.precioVenta)}
        </p>
        <Button
          size="sm"
          onPress={onAgregar}
          isDisabled={enCarrito}
          variant={enCarrito ? "success" : "primary"}
        >
          <Plus className="size-3.5" />
          {enCarrito ? "En tu carrito" : "Agregar"}
        </Button>
      </div>
    </Card>
  );
}