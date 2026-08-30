"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Whatsapp } from "@tailgrids/icons";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertIndicator } from "@/components/tailgrids/core/alert";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import { WHATSAPP_ADMIN } from "@/config/tienda";
import { obtenerProducto } from "@/services/api/productos/client";
import { ProductoAtributos } from "@/components/tienda/producto-atributos";
import { useCarrito } from "@/components/tienda/carrito-context";
import { abrirWhatsApp, construirMensajeProductoWhatsApp } from "@/components/tienda/whatsapp";
import formatCurrency from "@/utils/format-currency";

export function ProductoDetalleView({ productoId }: { productoId: number }) {
  const query = useQuery({
    queryKey: ["productos", productoId],
    queryFn: () => obtenerProducto(productoId),
  });
  const carrito = useCarrito();
  const producto = query.data;

  function agregarAlCarrito() {
    if (!producto) return;
    carrito.agregar(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  }

  if (query.isPending) {
    return (
      <div className="mx-auto w-full max-w-384 space-y-6 px-4 py-8 sm:px-6">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="mx-auto w-full max-w-384 space-y-6 px-4 py-8 sm:px-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="size-4" />
          Volver al catálogo
        </Link>
        <Alert status="info">
          <AlertIndicator />
          <AlertDescription>
            No encontramos este producto. Puede que haya sido retirado del catálogo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const enCarrito = carrito.enCarrito(producto.id);

  return (
    <div className="mx-auto w-full max-w-384 space-y-6 px-4 py-8 sm:px-6">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-text-primary">{producto.nombre}</h1>
              <p className="mt-1 text-sm text-text-secondary">{producto.marca}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{producto.categoria}</Badge>
                <Badge color="blue">{producto.subcategoria}</Badge>
              </div>
            </div>
            <p className="text-xl font-bold text-primary-500 sm:text-2xl">
              {formatCurrency(producto.precioVenta)}
            </p>
          </div>

          <p className="mt-4 text-sm text-text-secondary">
            Este producto forma parte del catálogo de {producto.categoria}. Revisa sus
            especificaciones técnicas y agrégalo a tu carrito de cotización si cumple lo que
            necesitas.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              onPress={agregarAlCarrito}
              isDisabled={enCarrito}
              variant={enCarrito ? "success" : "primary"}
            >
              <Plus className="size-4" />
              {enCarrito ? "En tu carrito" : "Agregar al carrito"}
            </Button>
            <Button
              variant="success"
              appearance="outline"
              onPress={() => abrirWhatsApp(WHATSAPP_ADMIN, construirMensajeProductoWhatsApp(producto))}
            >
              <Whatsapp className="size-4" />
              Consultar por WhatsApp
            </Button>
          </div>
        </Card>

        <Card className="p-0">
          <CardHeader className="border-b border-card-border px-5 py-4">
            <CardTitle level={4}>Especificaciones técnicas</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <ProductoAtributos atributos={producto.atributos} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}