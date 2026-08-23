"use client";

import { Card } from "@/components/tailgrids/core/card";
import { Badge } from "@/components/tailgrids/core/badge";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, TableRoot } from "@/components/tailgrids/core/table";
import type { ProductoCotizado } from "@/services/api/reportes/types";
import formatCurrency from "@/utils/format-currency";

interface TablaTopProductosProps {
  productos: ProductoCotizado[];
}

export function TablaTopProductos({ productos }: TablaTopProductosProps) {
  return (
    <Card className="p-0">
      <div className="border-b border-card-border px-6 py-4">
        <h3 className="text-base font-medium text-text-primary">Top productos más cotizados</h3>
        <p className="text-sm text-text-secondary">Ranking por unidades incluidas en cotizaciones</p>
      </div>

      <div className="p-5">
        {productos.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-secondary">Sin datos de cotizaciones aún.</p>
        ) : (
          <TableRoot fullBleed>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Ingreso asociado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto, indice) => (
                <TableRow key={producto.productoId}>
                  <TableCell>{indice + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium text-text-primary">{producto.nombre}</p>
                    <p className="text-xs text-text-secondary">{producto.marca}</p>
                  </TableCell>
                  <TableCell>
                    <Badge color="gray" size="sm">
                      {producto.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{producto.unidades}</TableCell>
                  <TableCell>{formatCurrency(producto.ingresoAsociado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        )}
      </div>
    </Card>
  );
}
