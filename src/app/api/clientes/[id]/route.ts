import { error, leerJSON, ok } from "@/services/api/shared/http";
import { actualizarCliente, eliminarCliente, obtenerCliente } from "@/services/api/clientes/service";
import type { ClienteInput } from "@/services/api/clientes/types";

interface ContextoId {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const cliente = await obtenerCliente(Number(id));
  if (!cliente) return error("Cliente no encontrado", 404);
  return ok(cliente);
}

export async function PATCH(request: Request, contexto: ContextoId) {
  const input = await leerJSON<Partial<ClienteInput>>(request);
  if (!input) return error("Cuerpo de la petición inválido");

  const { id } = await contexto.params;
  try {
    const cliente = await actualizarCliente(Number(id), input);
    if (!cliente) return error("Cliente no encontrado", 404);
    return ok(cliente);
  } catch (e) {
    return error("No se pudo actualizar el cliente", 500, String(e));
  }
}

export async function DELETE(_request: Request, contexto: ContextoId) {
  const { id } = await contexto.params;
  const eliminado = await eliminarCliente(Number(id));
  if (!eliminado) return error("Cliente no encontrado", 404);
  return ok({ eliminado: true });
}
