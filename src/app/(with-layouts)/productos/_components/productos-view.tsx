"use client";

import { Plus, Search1 } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/crm/shared/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { Skeleton } from "@/components/tailgrids/core/skeleton";
import type { ProductoInput } from "@/services/api/productos/types";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  type ProductoDTO,
} from "@/services/api/productos/client";
import { CATEGORIA_POR_PASO } from "@/services/pcbuilder/constants";
import { ProductoFormDialog } from "./producto-form-dialog";
import { ProductosTable } from "./productos-table";

const OPCIONES_CATEGORIA = ["Todas", ...Object.values(CATEGORIA_POR_PASO)];

export default function ProductosView() {
  const queryClient = useQueryClient();
  const [categoria, setCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<ProductoDTO | null>(null);
  const [productoEliminando, setProductoEliminando] = useState<ProductoDTO | null>(null);

  const productosQuery = useQuery({
    queryKey: ["productos"],
    queryFn: () => listarProductos(),
  });

  function invalidar() {
    void queryClient.invalidateQueries({ queryKey: ["productos"] });
    void queryClient.invalidateQueries({ queryKey: ["configurador"] });
  }

  const crearMutation = useMutation({
    mutationFn: (input: ProductoInput) => crearProducto(input),
    onSuccess: () => {
      toast.success("Producto creado");
      cerrarDialogo();
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ProductoInput> }) => actualizarProducto(id, input),
    onSuccess: () => {
      toast.success("Producto actualizado");
      cerrarDialogo();
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: () => {
      toast.success("Producto eliminado");
      setProductoEliminando(null);
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function cerrarDialogo() {
    setDialogoAbierto(false);
    setProductoEditando(null);
  }

  const filtrados = (productosQuery.data ?? []).filter((p) => {
    const coincideCategoria = categoria === "Todas" || p.categoria === categoria;
    if (!coincideCategoria) return false;
    if (!busca.trim()) return true;
    const q = busca.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.marca.toLowerCase().includes(q) ||
      p.subcategoria.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Productos"
        items={[
          { href: "/admin", label: "Home" },
          { href: "/productos", label: "CRM" },
          { href: "/productos", label: "Productos" },
        ]}
        acciones={
          <Button
            size="sm"
            onPress={() => {
              setProductoEditando(null);
              setDialogoAbierto(true);
            }}
          >
            <Plus className="size-4" />
            Nuevo producto
          </Button>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        <Card className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-card-border px-5 py-4">
            <div className="relative max-w-sm flex-1">
              <Search1 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-input-placeholder-text" />
              <Input
                aria-label="Buscar producto"
                placeholder="Buscar por nombre, marca o subcategoría..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              aria-label="Filtrar categoría"
              className="w-52"
              value={categoria}
              onChange={(v) => setCategoria(v as string)}
            >
              <SelectTrigger className="w-full border-border-secondary bg-input-background">
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                {OPCIONES_CATEGORIA.map((cat) => (
                  <SelectItem key={cat} id={cat} textValue={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-5">
            {productosQuery.isPending ? (
              <Skeleton className="h-72 w-full rounded-lg" />
            ) : (
              <ProductosTable
                productos={filtrados}
                onEditar={(p) => {
                  setProductoEditando(p);
                  setDialogoAbierto(true);
                }}
                onEliminar={setProductoEliminando}
                eliminando={eliminarMutation.isPending}
              />
            )}
          </div>
        </Card>
      </div>

      <ProductoFormDialog
        abierto={dialogoAbierto}
        producto={productoEditando}
        guardando={crearMutation.isPending || actualizarMutation.isPending}
        onClose={cerrarDialogo}
        onGuardar={(input) =>
          productoEditando ? actualizarMutation.mutate({ id: productoEditando.id, input }) : crearMutation.mutate(input)
        }
      />

      {productoEliminando && (
        <Dialog isOpen onOpenChange={(v) => !v && setProductoEliminando(null)}>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar <strong>{productoEliminando.nombre}</strong> del inventario? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onPress={() => setProductoEliminando(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onPress={() => eliminarMutation.mutate(productoEliminando.id)}
              isDisabled={eliminarMutation.isPending}
            >
              {eliminarMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
