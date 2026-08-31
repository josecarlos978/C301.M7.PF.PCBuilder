import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

// Rellena imagenUrl solo en productos que aún no tienen una (no pisa ediciones manuales
// hechas desde el admin). Mismo mapeo que prisma/seed.ts, ver
// documentos/01.imagen productos/imagenes_referenciales_categorias.md
const IMAGEN_POR_CATEGORIA: Record<string, string> = {
  Procesadores: "https://commons.wikimedia.org/wiki/Special:FilePath/AMD_Ryzen_9_7900X.jpg?width=1200",
  Mainboard: "https://commons.wikimedia.org/wiki/Special:FilePath/Atx_computer_motherboard_with_cpu_and_fan.jpg?width=1200",
  "Memoria RAM": "https://commons.wikimedia.org/wiki/Special:FilePath/DDR5_SDRAM_(with_scale)_IMGP6298_smial_wp.jpg?width=1200",
  Cooler: "https://commons.wikimedia.org/wiki/Special:FilePath/CPU_fan_and_heatsink.jpg?width=1200",
  "Tarjetas de Video": "https://commons.wikimedia.org/wiki/Special:FilePath/NVIDIA_GPU.jpg?width=1200",
  Cases: "https://commons.wikimedia.org/wiki/Special:FilePath/Computer_case_-_Full_Tower.jpg?width=1200",
  "Fuente de Poder": "https://commons.wikimedia.org/wiki/Special:FilePath/ATX_Computer_power_supply_unit.jpg?width=1200",
  "Almacenamiento SSD": "https://commons.wikimedia.org/wiki/Special:FilePath/1TB_2280_NVME_SSD.jpg?width=1200",
  Monitores: "https://commons.wikimedia.org/wiki/Special:FilePath/Computer_monitor.jpg?width=1200",
  "Periféricos": "https://commons.wikimedia.org/wiki/Special:FilePath/Keyboard_with_mouse.jpg?width=1200",
};

async function main() {
  let total = 0;
  for (const [categoria, imagenUrl] of Object.entries(IMAGEN_POR_CATEGORIA)) {
    const resultado = await prisma.producto.updateMany({
      where: { categoria, imagenUrl: null },
      data: { imagenUrl },
    });
    console.log(`${categoria}: ${resultado.count} productos actualizados`);
    total += resultado.count;
  }
  console.log(`Total: ${total} productos actualizados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
