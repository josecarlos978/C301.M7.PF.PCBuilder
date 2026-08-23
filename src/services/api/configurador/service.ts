import { prisma } from "@/lib/prisma";
import { CATEGORIA_POR_PASO } from "@/services/pcbuilder/constants";
import { evaluarPaso, validarSeleccion } from "@/services/pcbuilder/reglas";
import type {
  EvaluacionProducto,
  Paso,
  ProductoDTO,
  ProductosResueltos,
  ResultadoValidacion,
  SeleccionConfiguracion,
} from "@/services/pcbuilder/types";
import { aDTO } from "@/services/api/productos/service";

async function resolverUno(id: number | undefined): Promise<ProductoDTO | undefined> {
  if (id === undefined) return undefined;
  const producto = await prisma.producto.findUnique({ where: { id }, include: { atributos: true } });
  return producto ? aDTO(producto) : undefined;
}

export async function resolverSeleccion(seleccion: SeleccionConfiguracion): Promise<ProductosResueltos> {
  const ramIds = seleccion.ramIds ?? [];
  const ram = await prisma.producto.findMany({
    where: { id: { in: ramIds } },
    include: { atributos: true },
  });

  return {
    cpu: await resolverUno(seleccion.cpuId),
    placa: await resolverUno(seleccion.placaId),
    ram: ram.map(aDTO),
    gpu: await resolverUno(seleccion.gpuId),
    cooler: await resolverUno(seleccion.coolerId),
    case: await resolverUno(seleccion.caseId),
    psu: await resolverUno(seleccion.psuId),
  };
}

export async function obtenerOpciones(
  paso: Exclude<Paso, "cpu">,
  seleccion: SeleccionConfiguracion,
): Promise<EvaluacionProducto[]> {
  const sel = await resolverSeleccion(seleccion);

  const candidatos = await prisma.producto.findMany({
    where: { categoria: CATEGORIA_POR_PASO[paso] },
    include: { atributos: true },
    orderBy: { nombre: "asc" },
  });

  return evaluarPaso(paso, sel, candidatos.map(aDTO));
}

export async function validarConfiguracion(
  seleccion: SeleccionConfiguracion,
): Promise<ResultadoValidacion & { seleccion: ProductosResueltos }> {
  const sel = await resolverSeleccion(seleccion);
  return { ...validarSeleccion(sel), seleccion: sel };
}
