"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download1 } from "@tailgrids/icons";
import { Alert, AlertDescription, AlertIndicator } from "@/components/tailgrids/core/alert";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { importarProductos } from "@/services/api/productos/client";
import {
  descargarPlantillaProductos,
  parsearArchivoProductos,
  type FilaImportada,
} from "@/services/api/productos/importar-archivo";

interface ImportarProductosDialogProps {
  abierto: boolean;
  onClose: () => void;
}

export function ImportarProductosDialog({ abierto, onClose }: ImportarProductosDialogProps) {
  return (
    <Dialog isOpen={abierto} onOpenChange={(v) => !v && onClose()}>
      {abierto && <ContenidoImportar onClose={onClose} />}
    </Dialog>
  );
}

function ContenidoImportar({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [filas, setFilas] = useState<FilaImportada[] | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);

  const validas = filas?.filter((f) => f.input !== null) ?? [];
  const invalidas = filas?.filter((f) => f.input === null) ?? [];

  const importarMutation = useMutation({
    mutationFn: () => importarProductos(validas.map((f) => f.input!)),
    onSuccess: ({ importados }) => {
      toast.success(`${importados} producto(s) importado(s)`);
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
      void queryClient.invalidateQueries({ queryKey: ["configurador"] });
      cerrar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function cerrar() {
    setNombreArchivo(null);
    setFilas(null);
    setErrorArchivo(null);
    onClose();
  }

  async function manejarArchivo(archivoSeleccionado: File | undefined) {
    if (!archivoSeleccionado) return;
    setNombreArchivo(archivoSeleccionado.name);
    setFilas(null);
    setErrorArchivo(null);
    setProcesando(true);
    try {
      const resultado = await parsearArchivoProductos(archivoSeleccionado);
      if (resultado.length === 0) {
        setErrorArchivo("El archivo no tiene filas de datos (además del encabezado)");
      } else {
        setFilas(resultado);
      }
    } catch {
      setErrorArchivo("No se pudo leer el archivo. Verifica que sea un CSV o Excel válido.");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Importar productos desde CSV/Excel</DialogTitle>
        <DialogDescription>
          Columnas reconocidas: nombre, marca, precioVenta, categoria, subcategoria, imagenUrl
          (opcional). Cualquier otra columna se guarda como atributo técnico del producto.
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="max-h-[60vh] space-y-4 overflow-y-auto">
        <div className="flex flex-wrap items-center gap-3">
          <Button appearance="outline" size="sm" onPress={descargarPlantillaProductos}>
            <Download1 className="size-4" />
            Descargar plantilla Excel
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-card-border bg-input-background px-3.5 py-2 text-sm font-medium text-text-primary hover:bg-background-gray-secondary_alt">
            {nombreArchivo ?? "Elegir archivo..."}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => manejarArchivo(e.target.files?.[0])}
            />
          </label>
        </div>

        {procesando && <p className="text-sm text-text-secondary">Leyendo archivo...</p>}

        {errorArchivo && (
          <Alert status="error">
            <AlertIndicator />
            <AlertDescription>{errorArchivo}</AlertDescription>
          </Alert>
        )}

        {filas && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge color="success">{validas.length} listas para importar</Badge>
              {invalidas.length > 0 && (
                <Badge color="error">{invalidas.length} con errores</Badge>
              )}
            </div>

            {invalidas.length > 0 && (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-card-border p-2">
                {invalidas.map((f) => (
                  <p key={f.fila} className="text-xs text-text-secondary">
                    <span className="font-medium text-text-primary">Fila {f.fila}:</span>{" "}
                    {f.errores.join("; ")}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <Button variant="ghost" onPress={cerrar}>
          Cancelar
        </Button>
        <Button
          onPress={() => importarMutation.mutate()}
          isDisabled={validas.length === 0 || importarMutation.isPending}
        >
          {importarMutation.isPending ? "Importando..." : `Importar ${validas.length} producto(s)`}
        </Button>
      </DialogFooter>
    </>
  );
}
