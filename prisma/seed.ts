import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // CPU AMD
  const cpu1 = await prisma.producto.create({
    data: {
      nombre: "PROC AMD RYZEN 5 8500G 3.50GHZ",
      marca: "AMD",
      precioVenta: 214.51,
      categoria: "Procesadores",
      subcategoria: "CPU AMD RYZEN 5 SAM5 8XXX",
      atributos: {
        create: [
          { clave: "socket", valor: "AM5" },
          { clave: "tipoMemoria", valor: "DDR5" },
          { clave: "tdp", valor: "65" },
          { clave: "requiereCooler", valor: "false" },
          { clave: "tieneGraficosIntegrados", valor: "true" },
        ],
      },
    },
  });

  // Placa Madre
  const mb1 = await prisma.producto.create({
    data: {
      nombre: "MB GB B760M D3HP S/V/L DDR4",
      marca: "GIGABYTE",
      precioVenta: 139.64,
      categoria: "Mainboard",
      subcategoria: "MB CI9 S1700 DDR4",
      atributos: {
        create: [
          { clave: "socket", valor: "LGA1700" },
          { clave: "tipoMemoria", valor: "DDR4" },
          { clave: "factorForma", valor: "Micro-ATX" },
          { clave: "ramSlots", valor: "4" },
          { clave: "maxMemoriaGB", valor: "128" },
        ],
      },
    },
  });

  // RAM
  const ram1 = await prisma.producto.create({
    data: {
      nombre: "MEM RAM 16G FURY BEAST 3.2G D4",
      marca: "KINGSTON",
      precioVenta: 207.49,
      categoria: "Memoria RAM",
      subcategoria: "MEM DDR4 3200 PC4-25600",
      atributos: {
        create: [
          { clave: "tipoMemoria", valor: "DDR4" },
          { clave: "capacidadGB", valor: "16" },
          { clave: "frecuenciaMHz", valor: "3200" },
          { clave: "factorForma", valor: "DIMM" },
        ],
      },
    },
  });

  // GPU
  const gpu1 = await prisma.producto.create({
    data: {
      nombre: "VGA 12G AS RTX5070 DUAL OC",
      marca: "ASUS",
      precioVenta: 1259.63,
      categoria: "Tarjetas de Video",
      subcategoria: "VIDEO, PCI EXP NVIDIA GAM",
      atributos: {
        create: [
          { clave: "vramGB", valor: "12" },
          { clave: "consumoRecomendadoFuenteWatts", valor: "650" },
          { clave: "largoMm", valor: "268" },
        ],
      },
    },
  });

  // Case
  const case1 = await prisma.producto.create({
    data: {
      nombre: "CASE STD ATX TE1323 BLACK",
      marca: "TEROS",
      precioVenta: 47.2,
      categoria: "Cases",
      subcategoria: "CASES SIN FUENTE P/GAMERS",
      atributos: {
        create: [
          { clave: "soportaFactoresForma", valor: "ATX, Micro-ATX, Mini-ITX" },
          { clave: "largoMaxGpuMm", valor: "320" },
          { clave: "tieneFuentePoder", valor: "false" },
          { clave: "potenciaFuenteWatts", valor: "0" },
          { clave: "soportaFanCoolerVentiladores", valor: "2" },
        ],
      },
    },
  });

  // PSU
  const psu1 = await prisma.producto.create({
    data: {
      nombre: "PSU AS AP-850G FM 80+ GOLD",
      marca: "ASUS",
      precioVenta: 144.59,
      categoria: "Fuente de Poder",
      subcategoria: "CASES, FUENTE PARA GAMING",
      atributos: {
        create: [
          { clave: "potenciaWatts", valor: "850" },
          { clave: "certificacion80Plus", valor: "Gold" },
          { clave: "factorForma", valor: "ATX" },
          { clave: "esModular", valor: "true" },
        ],
      },
    },
  });

  console.log("Seed ejecutado correctamente 🚀");
  console.log({ cpu1: cpu1.id, mb1: mb1.id, ram1: ram1.id, gpu1: gpu1.id, case1: case1.id, psu1: psu1.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
