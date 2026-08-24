import { booleano, lista, numero, texto } from "./atributos";
import type {
  EvaluacionProducto,
  Paso,
  ProductoDTO,
  ProductosResueltos,
  ResultadoValidacion,
} from "./types";

export function fuenteEfectivaWatts(sel: ProductosResueltos): number {
  const wattsPsu = sel.psu ? (numero(sel.psu.atributos, "potenciaWatts") ?? 0) : 0;
  const wattsFuenteCase =
    sel.case && booleano(sel.case.atributos, "tieneFuentePoder")
      ? (numero(sel.case.atributos, "potenciaFuenteWatts") ?? 0)
      : 0;
  return Math.max(wattsPsu, wattsFuenteCase);
}

export function requerimientoWatts(sel: ProductosResueltos): number | undefined {
  if (!sel.gpu) return undefined;
  return numero(sel.gpu.atributos, "consumoRecomendadoFuenteWatts");
}

function evaluarPlaca(placa: ProductoDTO, sel: ProductosResueltos): string[] {
  const motivos: string[] = [];
  const cpu = sel.cpu;

  if (cpu) {
    const socketCpu = texto(cpu.atributos, "socket");
    const socketPlaca = texto(placa.atributos, "socket");
    if (socketCpu && socketPlaca && socketCpu.toLowerCase() !== socketPlaca.toLowerCase()) {
      motivos.push(`Socket incompatible: el CPU requiere ${socketCpu} y la placa es ${socketPlaca}`);
    }

    const memoriasCpu = lista(cpu.atributos, "tipoMemoria").map((m) => m.toLowerCase());
    const memoriasPlaca = lista(placa.atributos, "tipoMemoria").map((m) => m.toLowerCase());
    if (
      memoriasCpu.length > 0 &&
      memoriasPlaca.length > 0 &&
      !memoriasPlaca.some((memoriaPlaca) => memoriasCpu.includes(memoriaPlaca))
    ) {
      motivos.push(`Tipo de memoria incompatible: el CPU soporta ${lista(cpu.atributos, "tipoMemoria").join(" / ")} y la placa es ${texto(placa.atributos, "tipoMemoria")}`);
    }
  }

  return motivos;
}

function evaluarRam(ram: ProductoDTO, sel: ProductosResueltos): string[] {
  const motivos: string[] = [];
  const placa = sel.placa;

  if (placa) {
    const memoriasPlaca = lista(placa.atributos, "tipoMemoria").map((m) => m.toLowerCase());
    const memoriasRam = lista(ram.atributos, "tipoMemoria").map((m) => m.toLowerCase());
    if (
      memoriasPlaca.length > 0 &&
      memoriasRam.length > 0 &&
      !memoriasRam.some((memoriaRam) => memoriasPlaca.includes(memoriaRam))
    ) {
      motivos.push(`Tipo de memoria incompatible: la placa soporta ${lista(placa.atributos, "tipoMemoria").join(" / ")} y la RAM es ${texto(ram.atributos, "tipoMemoria")}`);
    }
  }

  return motivos;
}

function evaluarCooler(cooler: ProductoDTO, sel: ProductosResueltos): string[] {
  const motivos: string[] = [];
  const cpu = sel.cpu;

  if (cpu) {
    const socketCpu = texto(cpu.atributos, "socket")?.toLowerCase();
    const socketsCooler = lista(cooler.atributos, "socketsSoportados").map((s) => s.toLowerCase());
    if (socketCpu && socketsCooler.length > 0 && !socketsCooler.includes(socketCpu)) {
      motivos.push(`Socket incompatible: el cooler soporta ${lista(cooler.atributos, "socketsSoportados").join(", ")} y el CPU es ${texto(cpu.atributos, "socket")}`);
    }

    const tdpCpu = numero(cpu.atributos, "tdp");
    const tdpCooler = numero(cooler.atributos, "tdpSoportadoWatts");
    if (tdpCpu !== undefined && tdpCooler !== undefined && tdpCooler < tdpCpu) {
      motivos.push(`TDP insuficiente: el CPU requiere ${tdpCpu}W y el cooler soporta ${tdpCooler}W`);
    }
  }

  return motivos;
}

function evaluarCase(casePc: ProductoDTO, sel: ProductosResueltos): string[] {
  const motivos: string[] = [];
  const placa = sel.placa;

  if (placa) {
    const factorPlaca = texto(placa.atributos, "factorForma");
    const soportados = lista(casePc.atributos, "soportaFactoresForma");
    if (factorPlaca && soportados.length > 0 && !soportados.some((f) => f.toLowerCase() === factorPlaca.toLowerCase())) {
      motivos.push(`Factor de forma incompatible: el case no soporta placas ${factorPlaca}`);
    }
  }

  const gpu = sel.gpu;
  if (gpu) {
    const largoGpu = numero(gpu.atributos, "largoMm");
    const largoMaxCase = numero(casePc.atributos, "largoMaxGpuMm");
    if (largoGpu !== undefined && largoMaxCase !== undefined && largoMaxCase < largoGpu) {
      motivos.push(`Espacio insuficiente para GPU: la tarjeta mide ${largoGpu}mm y el case admite hasta ${largoMaxCase}mm`);
    }
  }

  const cooler = sel.cooler;
  if (cooler) {
    const ventiladoresCooler = numero(cooler.atributos, "numeroVentiladores");
    const ventiladoresCase = numero(casePc.atributos, "soportaFanCoolerVentiladores");
    if (ventiladoresCooler !== undefined && ventiladoresCase !== undefined && ventiladoresCase < ventiladoresCooler) {
      motivos.push(`Ventiladores insuficientes: el cooler usa ${ventiladoresCooler} y el case admite ${ventiladoresCase}`);
    }
  }

  return motivos;
}

function evaluarPsu(psu: ProductoDTO, sel: ProductosResueltos): string[] {
  const motivos: string[] = [];
  const requerido = requerimientoWatts(sel);
  const watts = numero(psu.atributos, "potenciaWatts");

  if (requerido !== undefined && watts !== undefined && watts < requerido) {
    motivos.push(`Potencia insuficiente: la GPU requiere una fuente de ${requerido}W y esta PSU entrega ${watts}W`);
  }

  return motivos;
}

export function evaluarPaso(paso: Exclude<Paso, "cpu">, sel: ProductosResueltos, candidatos: ProductoDTO[]): EvaluacionProducto[] {
  return candidatos.map((producto) => {
    let motivos: string[] = [];
    switch (paso) {
      case "placa":
        motivos = evaluarPlaca(producto, sel);
        break;
      case "ram":
        motivos = evaluarRam(producto, sel);
        break;
      case "gpu":
        motivos = [];
        break;
      case "cooler":
        motivos = evaluarCooler(producto, sel);
        break;
      case "case":
        motivos = evaluarCase(producto, sel);
        break;
      case "psu":
        motivos = evaluarPsu(producto, sel);
        break;
    }
    return { producto, compatible: motivos.length === 0, motivos };
  });
}

export function validarSeleccion(sel: ProductosResueltos): ResultadoValidacion {
  const errores: string[] = [];
  const advertencias: string[] = [];

  if (!sel.cpu) errores.push("Debe seleccionar un procesador (CPU).");
  if (!sel.placa) errores.push("Debe seleccionar una placa madre.");
  if (!sel.case) errores.push("Debe seleccionar un case.");

  if (sel.cpu && !booleano(sel.cpu.atributos, "tieneGraficosIntegrados") && !sel.gpu) {
    errores.push("El CPU no tiene gráficos integrados: debe seleccionar una GPU dedicada.");
  }

  if (sel.cpu && booleano(sel.cpu.atributos, "requiereCooler") && !sel.cooler) {
    errores.push("El CPU requiere cooler: debe seleccionar uno compatible.");
  }

  if (sel.ram.length === 0) {
    errores.push("Debe seleccionar al menos un módulo de RAM.");
  }

  if (sel.placa) {
    const memoriasPlaca = lista(sel.placa.atributos, "tipoMemoria").map((m) => m.toLowerCase());

    for (const modulo of sel.ram) {
      const memoriaRam = texto(modulo.atributos, "tipoMemoria")?.toLowerCase();
      if (memoriasPlaca.length > 0 && memoriaRam && !memoriasPlaca.includes(memoriaRam)) {
        errores.push(`La RAM ${modulo.nombre} es ${texto(modulo.atributos, "tipoMemoria")} y la placa soporta ${lista(sel.placa.atributos, "tipoMemoria").join(" / ")}.`);
      }
    }

    const slots = numero(sel.placa.atributos, "ramSlots");
    if (slots !== undefined && sel.ram.length > slots) {
      errores.push(`La configuración excede los ${slots} slots de RAM disponibles en la placa (${sel.ram.length} módulos seleccionados).`);
    }

    for (const modulo of sel.ram) {
      const frecuenciaRam = numero(modulo.atributos, "frecuenciaMHz");
      const frecuenciaPlaca = numero(sel.placa.atributos, "frecuenciaSoportadaMHz");
      if (frecuenciaRam !== undefined && frecuenciaPlaca !== undefined && frecuenciaRam > frecuenciaPlaca) {
        advertencias.push(`La RAM ${modulo.nombre} opera a ${frecuenciaRam}MHz; correrá a la velocidad máxima de la placa (${frecuenciaPlaca}MHz).`);
      }
    }
  }

  if (sel.case && !booleano(sel.case.atributos, "tieneFuentePoder") && !sel.psu) {
    errores.push("El case no incluye fuente de poder: debe seleccionar una PSU.");
  }

  const requerido = requerimientoWatts(sel);
  if (requerido !== undefined) {
    const disponible = fuenteEfectivaWatts(sel);
    if (disponible < requerido) {
      errores.push(`Potencia insuficiente: la GPU requiere ${requerido}W y la configuración solo provee ${disponible}W.`);
    }
  }

  return { valido: errores.length === 0, errores, advertencias };
}
