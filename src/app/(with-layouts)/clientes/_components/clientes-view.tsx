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
import type { ClienteInput } from "@/services/api/clientes/types";
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
  type ClienteConCotizaciones,
} from "@/services/api/clientes/client";
import { ClienteFormDialog } from "./cliente-form-dialog";
import { ClientesTable } from "./clientes-table";

export default function ClientesView() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteConCotizaciones | null>(null);
  const [clienteEliminando, setClienteEliminando] = useState<ClienteConCotizaciones | null>(null);

  const clientesQuery = useQuery({
    queryKey: ["clientes"],
    queryFn: () => listarClientes(),
  });

  const crearMutation = useMutation({
    mutationFn: (input: ClienteInput) => crearCliente(input),
    onSuccess: () => {
      toast.success("Cliente creado");
      cerrarDialogo();
      void queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ClienteInput> }) => actualizarCliente(id, input),
    onSuccess: () => {
      toast.success("Cliente actualizado");
      cerrarDialogo();
      void queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => eliminarCliente(id),
    onSuccess: () => {
      toast.success("Cliente eliminado");
      setClienteEliminando(null);
      void queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function abrirNuevo() {
    setClienteEditando(null);
    setDialogoAbierto(true);
  }

  function abrirEdicion(cliente: ClienteConCotizaciones) {
    setClienteEditando(cliente);
    setDialogoAbierto(true);
  }

  function cerrarDialogo() {
    setDialogoAbierto(false);
    setClienteEditando(null);
  }

  function guardar(input: ClienteInput) {
    if (clienteEditando) {
      actualizarMutation.mutate({ id: clienteEditando.id, input });
    } else {
      crearMutation.mutate(input);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Clientes"
        items={[
          { href: "/", label: "Home" },
          { href: "/clientes", label: "CRM" },
          { href: "/clientes", label: "Clientes" },
        ]}
        acciones={
          <Button size="sm" onPress={abrirNuevo}>
            <Plus className="size-4" />
            Nuevo cliente
          </Button>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        <Card className="p-0">
          <div className="border-b border-card-border px-5 py-4">
            <div className="relative max-w-sm">
              <Search1 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-input-placeholder-text" />
              <Input
                aria-label="Buscar cliente"
                placeholder="Buscar por nombre o correo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="p-5">
            {clientesQuery.isPending ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <SkeletonFila key={i} />
                ))}
              </div>
            ) : (
              <ClientesTable
                clientes={clientesQuery.data ?? []}
                filtro={busca}
                onEditar={abrirEdicion}
                onEliminar={setClienteEliminando}
                eliminando={eliminarMutation.isPending}
              />
            )}
          </div>
        </Card>
      </div>

      <ClienteFormDialog
        abierto={dialogoAbierto}
        cliente={clienteEditando}
        guardando={crearMutation.isPending || actualizarMutation.isPending}
        onClose={cerrarDialogo}
        onGuardar={guardar}
      />

      {clienteEliminando && (
        <DialogoEliminar
          nombre={clienteEliminando.nombre}
          ocupado={eliminarMutation.isPending}
          onCancelar={() => setClienteEliminando(null)}
          onConfirmar={() => eliminarMutation.mutate(clienteEliminando.id)}
        />
      )}
    </div>
  );
}

function SkeletonFila() {
  return <div className="h-12 animate-pulse-custom rounded-lg bg-background-gray-secondary_alt" />;
}

function DialogoEliminar({
  nombre,
  ocupado,
  onCancelar,
  onConfirmar,
}: {
  nombre: string;
  ocupado: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <Dialog isOpen onOpenChange={(abierto) => !abierto && onCancelar()}>
      <DialogHeader>
        <DialogTitle>Eliminar cliente</DialogTitle>
        <DialogDescription>
          ¿Seguro que deseas eliminar a <strong>{nombre}</strong>? Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" onPress={onCancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onPress={onConfirmar} isDisabled={ocupado}>
          {ocupado ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
