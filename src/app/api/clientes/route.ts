import { error, leerJSON, ok } from "@/services/api/shared/http";
import { crearCliente, listarClientes } from "@/services/api/clientes/service";
import type { ClienteInput } from "@/services/api/clientes/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const clientes = await listarClientes({ busca: searchParams.get("busca") ?? undefined });
    return ok(clientes);
  } catch (e) {
    return error("No se pudieron listar los clientes", 500, String(e));
  }
}

export async function POST(request: Request) {
  const input = await leerJSON<ClienteInput>(request);
  if (!input) return error("Cuerpo de la petición inválido");
  if (!input.nombre || !input.correo) return error("nombre y correo son obligatorios");

  try {
    const cliente = await crearCliente(input);
    return ok(cliente, 201);
  } catch (e) {
    return error("No se pudo crear el cliente", 500, String(e));
  }
}
