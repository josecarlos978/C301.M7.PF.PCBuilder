import type { ClienteInput } from "./types";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api/shared/client-http";

export interface ClienteDTO {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  createdAt: string;
}

export interface ClienteConCotizaciones extends ClienteDTO {
  _count?: { cotizaciones: number };
}

export function listarClientes(busca?: string): Promise<ClienteConCotizaciones[]> {
  return apiGet(`/api/clientes${busca ? `?busca=${encodeURIComponent(busca)}` : ""}`);
}

export function crearCliente(input: ClienteInput): Promise<ClienteDTO> {
  return apiPost("/api/clientes", input);
}

export function actualizarCliente(id: number, input: Partial<ClienteInput>): Promise<ClienteDTO> {
  return apiPatch(`/api/clientes/${id}`, input);
}

export function eliminarCliente(id: number): Promise<{ eliminado: boolean }> {
  return apiDelete(`/api/clientes/${id}`);
}
