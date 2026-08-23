import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ClienteFiltros, ClienteInput } from "./types";

export async function listarClientes(filtros: ClienteFiltros = {}) {
  const where: Prisma.ClienteWhereInput = {};

  if (filtros.busca) {
    where.OR = [
      { nombre: { contains: filtros.busca } },
      { correo: { contains: filtros.busca } },
    ];
  }

  return prisma.cliente.findMany({
    where,
    include: { _count: { select: { cotizaciones: true } } },
    orderBy: { nombre: "asc" },
  });
}

export async function obtenerCliente(id: number) {
  return prisma.cliente.findUnique({
    where: { id },
    include: { cotizaciones: { orderBy: { fecha: "desc" } } },
  });
}

export async function crearCliente(input: ClienteInput) {
  return prisma.cliente.create({ data: input });
}

export async function actualizarCliente(id: number, input: Partial<ClienteInput>) {
  const existente = await prisma.cliente.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.cliente.update({ where: { id }, data: input });
}

export async function eliminarCliente(id: number): Promise<boolean> {
  const existente = await prisma.cliente.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.cliente.delete({ where: { id } });
  return true;
}
