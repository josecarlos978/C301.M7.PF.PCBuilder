"use client";

import { useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import type { ProductoDTO } from "@/services/api/productos/client";
import type { ProductoInput } from "@/services/api/productos/types";
import { CATEGORIA_POR_PASO } from "@/services/pcbuilder/constants";
import { ProductoImagen } from "@/components/tienda/producto-imagen";
import { AtributosEditor } from "./atributos-editor";

const CATEGORIAS = Object.values(CATEGORIA_POR_PASO);

interface ProductoFormDialogProps {
  abierto: boolean;
  producto: ProductoDTO | null;
  guardando: boolean;
  onClose: () => void;
  onGuardar: (input: ProductoInput) => void;
}

export function ProductoFormDialog({ abierto, producto, guardando, onClose, onGuardar }: ProductoFormDialogProps) {
  return (
    <Dialog isOpen={abierto} onOpenChange={(v) => !v && onClose()}>
      {abierto && (
        <FormularioProducto
          producto={producto}
          guardando={guardando}
          onClose={onClose}
          onGuardar={onGuardar}
        />
      )}
    </Dialog>
  );
}

function FormularioProducto({
  producto,
  guardando,
  onClose,
  onGuardar,
}: Omit<ProductoFormDialogProps, "abierto">) {
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [marca, setMarca] = useState(producto?.marca ?? "");
  const [precioVenta, setPrecioVenta] = useState(producto ? String(producto.precioVenta) : "");
  const [categoria, setCategoria] = useState<string>(producto?.categoria ?? CATEGORIAS[0]);
  const [subcategoria, setSubcategoria] = useState(producto?.subcategoria ?? "");
  const [imagenUrl, setImagenUrl] = useState(producto?.imagenUrl ?? "");
  const [atributos, setAtributos] = useState<Record<string, string>>(producto?.atributos ?? {});
  const [error, setError] = useState<string | null>(null);

  function enviar() {
    const precio = Number(precioVenta.replace(",", "."));
    if (!nombre.trim()) return setError("El nombre es obligatorio");
    if (!marca.trim()) return setError("La marca es obligatoria");
    if (!Number.isFinite(precio) || precio < 0) return setError("El precio debe ser un número mayor o igual a 0");

    onGuardar({
      nombre: nombre.trim(),
      marca: marca.trim(),
      precioVenta: precio,
      categoria,
      subcategoria: subcategoria.trim() || categoria,
      imagenUrl: imagenUrl.trim() || null,
      atributos,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{producto ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        <DialogDescription>
          {producto
            ? `Actualizando ${producto.nombre}. Al guardar se reemplazan todas las especificaciones.`
            : "Registra un nuevo componente del inventario."}
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="max-h-[60vh] space-y-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="producto-nombre">Nombre</Label>
            <Input id="producto-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Ryzen 7 7800X3D" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="producto-marca">Marca</Label>
            <Input id="producto-marca" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ej. AMD" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="producto-precio">Precio de venta (USD)</Label>
            <Input id="producto-precio" inputMode="decimal" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="399.99" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="producto-subcategoria">Subcategoría</Label>
            <Input id="producto-subcategoria" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} placeholder="Ej. Desktop AM5" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="producto-imagen">URL de imagen (opcional)</Label>
            <div className="flex items-center gap-3">
              <ProductoImagen
                imagenUrl={imagenUrl.trim() || null}
                nombre={nombre || "?"}
                className="size-14 shrink-0 rounded-lg"
              />
              <Input
                id="producto-imagen"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Select aria-label="Categoría" className="w-full" value={categoria} onChange={(v) => setCategoria(v as string)}>
          <SelectLabel>Categoría</SelectLabel>
          <SelectTrigger className="w-full border-border-secondary bg-input-background py-2.5">
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((cat) => (
              <SelectItem key={cat} id={cat} textValue={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AtributosEditor inicial={producto?.atributos} onChange={setAtributos} />

        {error && <p className="text-sm text-input-error">{error}</p>}
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={onClose}>
          Cancelar
        </Button>
        <Button onPress={enviar} isDisabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </>
  );
}
