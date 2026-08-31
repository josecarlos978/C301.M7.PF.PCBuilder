import "dotenv/config";
import { prisma } from "../src/lib/prisma";

interface ProductoSeed {
  nombre: string;
  marca: string;
  precioVenta: number;
  categoria: string;
  subcategoria: string;
  atributos: Record<string, string>;
}

// Imágenes referenciales por categoría (no son fotos del SKU exacto), tomadas de
// Wikimedia Commons según documentos/01.imagen productos/imagenes_referenciales_categorias.md
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

function cpu(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  socket: string,
  tipoMemoria: string,
  tdp: number,
  requiereCooler: boolean,
  tieneGraficosIntegrados: boolean,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Procesadores",
    subcategoria,
    atributos: {
      socket,
      tipoMemoria,
      tdp: String(tdp),
      requiereCooler: String(requiereCooler),
      tieneGraficosIntegrados: String(tieneGraficosIntegrados),
    },
  };
}

function placa(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  socket: string,
  tipoMemoria: string,
  factorForma: string,
  ramSlots: number,
  maxMemoriaGB: number,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Mainboard",
    subcategoria,
    atributos: {
      socket,
      tipoMemoria,
      factorForma,
      ramSlots: String(ramSlots),
      maxMemoriaGB: String(maxMemoriaGB),
    },
  };
}

function ram(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  tipoMemoria: string,
  capacidadGB: number,
  frecuenciaMHz: number,
  factorForma: string,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Memoria RAM",
    subcategoria,
    atributos: {
      tipoMemoria,
      capacidadGB: String(capacidadGB),
      frecuenciaMHz: String(frecuenciaMHz),
      factorForma,
    },
  };
}

function gpu(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  vramGB: number,
  consumoWatts: number,
  largoMm: number,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Tarjetas de Video",
    subcategoria,
    atributos: {
      vramGB: String(vramGB),
      consumoRecomendadoFuenteWatts: String(consumoWatts),
      largoMm: String(largoMm),
    },
  };
}

function cooler(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  socketsSoportados: string,
  tdpSoportadoWatts: number,
  tipoRefrigeracion: string,
  numeroVentiladores: number,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Cooler",
    subcategoria,
    atributos: {
      socketsSoportados,
      tdpSoportadoWatts: String(tdpSoportadoWatts),
      tipoRefrigeracion,
      numeroVentiladores: String(numeroVentiladores),
    },
  };
}

function casePc(
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  soportaFactoresForma: string[],
  largoMaxGpuMm: number,
  tieneFuentePoder: boolean,
  potenciaFuenteWatts: number,
  soportaFanCoolerVentiladores: number,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Cases",
    subcategoria,
    atributos: {
      soportaFactoresForma: soportaFactoresForma.join(", "),
      largoMaxGpuMm: String(largoMaxGpuMm),
      tieneFuentePoder: String(tieneFuentePoder),
      potenciaFuenteWatts: String(potenciaFuenteWatts),
      soportaFanCoolerVentiladores: String(soportaFanCoolerVentiladores),
    },
  };
}

function psu(
  nombre: string,
  marca: string,
  precioVenta: number,
  potenciaWatts: number,
  certificacion80Plus: string,
  factorForma: string,
  esModular: boolean,
): ProductoSeed {
  return {
    nombre,
    marca,
    precioVenta,
    categoria: "Fuente de Poder",
    subcategoria: "CASES, FUENTE PARA GAMING",
    atributos: {
      potenciaWatts: String(potenciaWatts),
      certificacion80Plus,
      factorForma,
      esModular: String(esModular),
    },
  };
}

function extra(
  categoria: string,
  subcategoria: string,
  nombre: string,
  marca: string,
  precioVenta: number,
  atributos: Record<string, string>,
): ProductoSeed {
  return { nombre, marca, precioVenta, categoria, subcategoria, atributos };
}

const CATALOGO: ProductoSeed[] = [
  // ---------- Procesadores ----------
  cpu("CPU AMD RYZEN 5 SAM5 8XXX", "PROC AMD RYZEN 5 8500G 3.50GHZ", "AMD", 214.51, "AM5", "DDR5", 65, false, true),
  cpu("CPU AMD RYZEN 5 SAM5 8XXX", "PROC AMD RYZEN 5 8600G 4.30GHZ", "AMD", 260.43, "AM5", "DDR5", 65, false, true),
  cpu("CPU AMD RYZEN 5 SAM5 9XXX", "PROC AMD RYZEN 5 9600X 3.90GHZ", "AMD", 360.22, "AM5", "DDR5", 65, true, true),
  cpu("CPU AMD RYZEN 7 SAM5 8XXX", "PROC AMD RYZEN 7 8700F 4.10GHZ", "AMD", 352.78, "AM5", "DDR5", 65, false, false),
  cpu("CPU AMD RYZEN 7 SAM5 8XXX", "PROC AMD RYZEN 7 8700G 4.20GHZ", "AMD", 359.39, "AM5", "DDR5", 65, false, true),
  cpu("CPU AMD RYZEN 7 SAM5 9XXX", "PROC AMD RYZEN 7 9800X3D 4.70G", "AMD", 753.36, "AM5", "DDR5", 120, true, true),
  cpu("CPU AMD RYZEN 7 SAM5 9XXX", "PROC AMD RYZEN 7 9850X3D 4.70G", "AMD", 802.92, "AM5", "DDR5", 120, true, true),
  cpu("CPU CI5 12XXX S1700", "PROC INT CORE I5-12400 2.50GHZ", "Intel", 394.92, "LGA1700", "DDR4, DDR5", 117, false, true),
  cpu("CPU CI5 12XXX S1700", "PROC INT CORE I5-12400F 2.50GZ (Opción A)", "Intel", 243.74, "LGA1700", "DDR4, DDR5", 117, false, false),
  cpu("CPU CI5 12XXX S1700", "PROC INT CORE I5-12400F 2.50GZ (Opción B)", "Intel", 307.36, "LGA1700", "DDR4, DDR5", 117, false, false),
  cpu("CPU CI5 14XXX S1700", "PROC INT CORE I5-14400 2.50GHZ", "Intel", 456.05, "LGA1700", "DDR4, DDR5", 65, false, true),
  cpu("CPU CI5 14XXX S1700", "PROC INT CORE I5-14400F 2.50GZ", "Intel", 291.5, "LGA1700", "DDR4, DDR5", 65, false, false),
  cpu("CPU CI5 14XXX S1700", "PROC INT CORE I5-14600K 3.50G", "Intel", 419.95, "LGA1700", "DDR4, DDR5", 125, true, true),
  cpu("CPU CI5 14XXX S1700", "PROC INT CORE I5-14600KF 3.50G", "Intel", 404.83, "LGA1700", "DDR4, DDR5", 125, true, false),
  cpu("CPU CI7 12XXX S1700", "PROC INT CORE I7-12700F 2.10GZ", "Intel", 484.97, "LGA1700", "DDR4, DDR5", 180, false, false),
  cpu("CPU CI7 12XXX S1700", "PROC INT CORE I7-12700K 3.60GH", "Intel", 502.31, "LGA1700", "DDR4, DDR5", 125, true, true),
  cpu("CPU CI7 12XXX S1700", "PROC INT CORE I7-12700KF 3.60G", "Intel", 500.66, "LGA1700", "DDR4, DDR5", 125, true, false),
  cpu("CPU CI7 14XXX S1700", "PROC INT CORE I7-14700 2.10GHZ", "Intel", 637.78, "LGA1700", "DDR4, DDR5", 65, false, true),
  cpu("CPU CI7 14XXX S1700", "PROC INT CORE I7-14700F 2.10GZ", "Intel", 575.01, "LGA1700", "DDR4, DDR5", 65, false, false),
  cpu("CPU CI7 14XXX S1700", "PROC INT CORE I7-14700KF 3.40G", "Intel", 627.87, "LGA1700", "DDR4, DDR5", 125, true, false),
  cpu("CPU CI7 14XXX S1700", "PROC INT CORE I7-14700KF TRAY", "Intel", 543.62, "LGA1700", "DDR4, DDR5", 125, true, false),
  cpu("CPU CI7 14XXX S1700", "PROC INT CORE I7-14700 2.1 OEM", "Intel", 609.7, "LGA1700", "DDR4, DDR5", 65, true, true),
  cpu("CPU CI9 14XXX S1700", "PROC INT CORE I9-14900 2.0GHZ", "Intel", 984.67, "LGA1700", "DDR4, DDR5", 65, false, true),
  cpu("CPU CI9 14XXX S1700", "PROC INT CORE I9-14900F 2.0GHZ", "Intel", 939.78, "LGA1700", "DDR4, DDR5", 65, false, false),
  cpu("CPU CI9 14XXX S1700", "PROC INT CORE I9-14900K 3.20G", "Intel", 935.35, "LGA1700", "DDR4, DDR5", 125, true, true),
  cpu("CPU CI9 14XXX S1700", "PROC INT CORE I9-14900KF 3.20G", "Intel", 873.96, "LGA1700", "DDR4, DDR5", 125, true, false),
  cpu("CPU CI9 14XXX S1700", "PROC INT CORE I9-14900KS 3.20G", "Intel", 1172.54, "LGA1700", "DDR4, DDR5", 150, true, true),
  cpu("CPU CU5 2XX S1851", "PROC INT COR ULTRA 5 225F 3.3G", "Intel", 277.45, "LGA1851", "DDR5", 65, false, false),
  cpu("CPU CU5 2XX S1851", "PROC INT COR ULT 5 245K 4.20GZ", "Intel", 358.57, "LGA1851", "DDR5", 125, true, true),
  cpu("CPU CU5 2XX S1851", "PROC INT COR ULT 5 245KF 4.20G", "Intel", 333.79, "LGA1851", "DDR5", 125, true, false),
  cpu("CPU CU5 2XX S1851", "PROC INT COR ULT 5 250K PLUS", "Intel", 375.09, "LGA1851", "DDR5", 125, true, true),
  cpu("CPU CU5 2XX S1851", "PROC INT COR ULTRA 5 225 3.30G", "Intel", 307.36, "LGA1851", "DDR5", 65, false, true),
  cpu("CPU CU7 2XX S1851", "PROC INT CORE ULT 7 265 2.40G", "Intel", 613.0, "LGA1851", "DDR5", 65, false, true),
  cpu("CPU CU7 2XX S1851", "PROC INT CORE ULT 7 265F 2.40G", "Intel", 583.27, "LGA1851", "DDR5", 65, false, false),
  cpu("CPU CU9 2XX S1851", "PROC INT COR ULT 9 285K 3.70G", "Intel", 987.98, "LGA1851", "DDR5", 125, true, true),

  // ---------- Placas madre ----------
  placa("MB CI9 S1700 DDR4", "MB GB B760M D3HP S/V/L DDR4", "GIGABYTE", 139.64, "LGA1700", "DDR4", "Micro-ATX", 4, 128),
  placa("MB CI9 S1700 DDR4", "MB GB Z790-D S/V/L DDR4", "GIGABYTE", 323.84, "LGA1700", "DDR4", "ATX", 4, 128),
  placa("MB CI9 S1700 DDR4", "MB MS PRO B760M-P S/V/L DDR4", "MSI", 136.33, "LGA1700", "DDR4", "Micro-ATX", 4, 128),
  placa("MB CI9 S1700 DDR4", "MB MS H610M-S S/V/L DDR4", "MSI", 101.64, "LGA1700", "DDR4", "Micro-ATX", 2, 64),
  placa("MB CI9 S1700 DDR5", "MB AS PRIME B760M-A S/V/L DDR5", "ASUS", 161.21, "LGA1700", "DDR5", "Micro-ATX", 4, 192),
  placa("MB CI9 S1700 DDR5", "MB GB B760 DS3H S/V/L DDR5", "GIGABYTE", 168.55, "LGA1700", "DDR5", "ATX", 4, 192),
  placa("MB CI9 S1700 DDR5", "MB GB H610M K V2 S/V/L DDR5", "GIGABYTE", 100.81, "LGA1700", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CI9 S1700 DDR5", "MB MS PRO B760M-E S/V/L DDR5", "MSI", 147.07, "LGA1700", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CU9 S1851 DDR5", "MB AR B860M-H2 S/V/L DDR5", "ASROCK", 151.2, "LGA1851", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CU9 S1851 DDR5", "MB AS PRIME H810M-E S/V/L DDR5", "ASUS", 143.77, "LGA1851", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CU9 S1851 DDR5", "MB GB B860M K S/V/L DDR5", "GIGABYTE", 159.46, "LGA1851", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CU9 S1851 DDR5", "MB MS PRO B860M-E S/V/L DDR5", "MSI", 158.63, "LGA1851", "DDR5", "Micro-ATX", 2, 96),
  placa("MB CU9 S1851 DDR5 GAMING", "MB AR Z890 TAICHI S/V/L DDR5", "ASROCK", 801.26, "LGA1851", "DDR5", "ATX", 4, 256),
  placa("MB CU9 S1851 DDR5 GAMING", "MB AS STRIX B860-A GAMING WIFI", "ASUS", 389.88, "LGA1851", "DDR5", "ATX", 4, 192),
  placa("MB CU9 S1851 DDR5 GAMING", "MB AS STRIX Z890-F GAMING WIFI", "ASUS", 646.22, "LGA1851", "DDR5", "ATX", 4, 192),
  placa("MB SOCKET AM5 AMD", "MB AR B850M-X WIFI S/V/L DDR5", "ASROCK", 194.13, "AM5", "DDR5", "Micro-ATX", 2, 96),
  placa("MB SOCKET AM5 AMD", "MB AS PRIME B650M-A II SVL DR5", "ASUS", 185.88, "AM5", "DDR5", "Micro-ATX", 4, 192),
  placa("MB SOCKET AM5 AMD", "MB GB B840M DS3H S/V/L DDR5", "GIGABYTE", 161.95, "AM5", "DDR5", "Micro-ATX", 4, 192),
  placa("MB SOCKET AM5 AMD", "MB MS PRO X870E-P WIFI DDR5", "MSI", 385.34, "AM5", "DDR5", "ATX", 4, 256),
  placa("MB SOCKET AM5 AMD GAMING", "MB AR X870 STEEL LEGEND WF DR5", "ASROCK", 478.88, "AM5", "DDR5", "ATX", 4, 256),
  placa("MB SOCKET AM5 AMD GAMING", "MB AS B650E-F GMG SVL WF DDR5", "ASUS", 406.39, "AM5", "DDR5", "ATX", 4, 192),
  placa("MB SOCKET AM5 AMD GAMING", "MB AS TUF GAMING B850-PLUS WF", "ASUS", 371.72, "AM5", "DDR5", "ATX", 4, 192),
  placa("MB SOCKET AM5 AMD GAMING", "MB GB B650 GAMING X AX V2 DDR5", "GIGABYTE", 250.5, "AM5", "DDR5", "ATX", 4, 192),

  // ---------- Memoria RAM ----------
  ram("MEM DDR4 3200 PC4-25600", "MEM RAM 8G HIK ARM 3.20GH DDR4", "HIKSEMI", 102.4, "DDR4", 8, 3200, "DIMM"),
  ram("MEM DDR4 3200 PC4-25600", "MEM RAM 8G TF DELTA RGB 3.20GZ", "TEAMGROUP", 110.85, "DDR4", 8, 3200, "DIMM"),
  ram("MEM DDR4 3200 PC4-25600", "MEM RAM 16G FURY BEAST 3.2G D4", "KINGSTON", 207.49, "DDR4", 16, 3200, "DIMM"),
  ram("MEM DDR4 3200 PC4-25600", "MEM RAM 16G XPG GAMMIX D20 3.2", "ADATA", 176.81, "DDR4", 16, 3200, "DIMM"),
  ram("MEM DDR4 3200 PC4-25600", "MEM RAM 32G FURY 3.20G DDR4", "KINGSTON", 710.94, "DDR4", 32, 3200, "DIMM"),
  ram("MEM DDR4 3600 PC4-28800", "MEM RAM 8G FURY BEAST 3.60G D4", "KINGSTON", 156.87, "DDR4", 8, 3600, "DIMM"),
  ram("MEM DDR4 3600 PC4-28800", "MEM RAM 16G BEAST RGB 3.60G D4", "KINGSTON", 226.51, "DDR4", 16, 3600, "DIMM"),
  ram("MEM DDR5 5200 PC5-41600", "MEM RAM 8G HS HIKER 5.20G SOD", "HIKSEMI", 181.41, "DDR5", 8, 5200, "SODIMM"),
  ram("MEM DDR5 5200 PC5-41600", "MEM RAM 16G KF 5.2G RGB WHI D5", "KINGSTON", 359.07, "DDR5", 16, 5200, "DIMM"),
  ram("MEM DDR5 5600 PC5-44800", "MEM RAM 8G XPG LAN RGB 5.60G", "ADATA", 188.31, "DDR5", 8, 5600, "DIMM"),
  ram("MEM DDR5 5600 PC5-44800", "MEM RAM 8G TF VULCAN 5.60G DR5", "TEAMGROUP", 197.83, "DDR5", 8, 5600, "DIMM"),
  ram("MEM DDR5 5600 PC5-44800", "MEM RAM 16G TF VULCAN 5.60GHZ", "TEAMGROUP", 351.78, "DDR5", 16, 5600, "DIMM"),
  ram("MEM DDR5 5600 PC5-44800", "MEM RAM 16G KF BEAST RGB 5.6GZ", "KINGSTON", 357.15, "DDR5", 16, 5600, "DIMM"),

  // ---------- Coolers ----------
  cooler("FAN COOLER CPU", "FAN-COOLER IS-40-XT BLACK", "ADVANCE COMPUTER CORP / ID-COOLING", 170.2, "LGA1700, LGA1200, LGA115X, AM4, AM5", 100, "Aire", 1),
  cooler("FAN COOLER CPU", "FAN-C NC NH-U14S PREMIUM", "NOCTUA", 166.07, "LGA1700, LGA1851, LGA1200, AM4, AM5", 220, "Aire", 1),
  cooler("FAN COOLER CPU", "COOLER PARA CPU TE-8166N AIRE", "TEROS", 44.63, "LGA1700, LGA1200, AM4, AM5", 200, "Aire", 1),
  cooler("COOLER LIQUIDO CPU 240", "COOLER PARA CPU TE-8164N LIQU", "TEROS", 74.34, "LGA1700, LGA1200, AM4, AM5", 265, "Líquida (AIO)", 2),
  cooler("COOLER LIQUIDO CPU 240", "COOLER GB AIO GME 240", "GIGABYTE", 91.1, "LGA1700, LGA1851, AM4, AM5", 280, "Líquida (AIO)", 2),
  cooler("COOLER LIQUIDO CPU 240", "COOLER MSI MAG CLQD A13 240 N", "MSI", 88.79, "LGA1700, LGA1851, AM4, AM5", 270, "Líquida (AIO)", 2),
  cooler("COOLER LIQUIDO CPU 240", "COOLER MSI AIO CORELIQUID E240", "MSI", 146.93, "LGA1700, LGA1851, AM4, AM5", 280, "Líquida (AIO)", 2),
  cooler("COOLER LIQUIDO CPU 360", "LC AS PRIME 360 ARGB WHITE", "ASUS", 135.37, "LGA1700, LGA1851, AM4, AM5", 300, "Líquida (AIO)", 3),
  cooler("COOLER LIQUIDO CPU 360", "COOLER AS AIO RYU III 360 RG X", "ASUS", 512.21, "LGA1700, LGA1851, AM4, AM5", 350, "Líquida (AIO)", 3),
  cooler("COOLER LIQUIDO CPU 360", "COOLER GB AIO GME 360 BLACK", "GIGABYTE", 105.54, "LGA1700, LGA1851, AM4, AM5", 320, "Líquida (AIO)", 3),
  cooler("COOLER LIQUIDO CPU 360", "COOLER MSI MAG CLQD A13 360 N", "MSI", 102.47, "LGA1700, LGA1851, AM4, AM5", 300, "Líquida (AIO)", 3),

  // ---------- Tarjetas de video ----------
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 6G MS RTX3050 LP GDDR6", "MSI", 327.24, 6, 300, 174),
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 8G AS RTX5060 DUAL GDDR7", "ASUS", 733.09, 8, 550, 227),
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 12G AS RTX5070 DUAL OC", "ASUS", 1259.63, 12, 650, 268),
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 12G GB RTX5070 AERO OC GD7", "GIGABYTE", 1135.63, 12, 650, 300),
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 32G AS RTX5090 TUF OC GDR7", "ASUS", 5218.6, 32, 1000, 348),
  gpu("VIDEO, PCI EXP NVIDIA GAM", "VGA 32G GB RTX5090 MASTER", "GIGABYTE", 5857.88, 32, 1000, 358),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 8G GB RX7600 GAMING OC GD6", "GIGABYTE", 492.83, 8, 550, 282),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 8G AS RX9060XT PRIME GDDR6", "ASUS", 580.25, 8, 600, 240),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 16G XF RX9060XT 3X GDDR6", "XFX", 741.52, 16, 650, 304),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 16G AS RX9060XT DUAL GDDR6", "ASUS", 736.14, 16, 650, 227),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 16G GB RX9070 GMG OC GDDR6", "GIGABYTE", 1032.58, 16, 750, 286),
  gpu("VIDEO, PCI EXP RADEON GAM", "VGA 16G GB RX9070XT AO ELT GD6", "GIGABYTE", 1317.9, 16, 800, 330),

  // ---------- Cases ----------
  casePc("CASES ATX VER2.0", "CASE STD ATX TE1036 250W BK", "TEROS", 36.45, ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 300, true, 250, 1),
  casePc("CASES ATX VER2.0", "CASE STD ATX TE1037 250W BK", "TEROS", 36.45, ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 300, true, 250, 1),
  casePc("CASES ATX VER2.0", "CASE STD ATX TE1038 250W BK", "TEROS", 37.06, ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 300, true, 250, 1),
  casePc("CASES ATX VER2.0", "CASE MICRO ATX 450W TE1319G", "TEROS", 51.02, ["Micro-ATX", "Mini-ITX"], 310, true, 450, 2),
  casePc("CASES CON FUENTE P/GAMERS", "CS MS ATX FRGE 120AAF 650W 80B", "MSI", 127.72, ["ATX", "Micro-ATX", "Mini-ITX"], 330, true, 650, 2),
  casePc("CASES CON FUENTE P/GAMERS", "CS MS MATX FRGE M100A 600W 80W", "MSI", 98.27, ["Micro-ATX", "Mini-ITX"], 300, true, 600, 2),
  casePc("CASES SIN FUENTE P/GAMERS", "CASE STD ATX TE1323 BLACK", "TEROS", 47.2, ["ATX", "Micro-ATX", "Mini-ITX"], 320, false, 0, 2),
  casePc("CASES SIN FUENTE P/GAMERS", "CS AS A31 PLUS ATX WHITE ARGB", "ASUS", 115.14, ["ATX", "Micro-ATX", "Mini-ITX"], 380, false, 0, 3),
  casePc("CASES SIN FUENTE P/GAMERS", "CS AS AP202 MATX BLACK ARGB", "ASUS", 145.88, ["Micro-ATX", "Mini-ITX"], 338, false, 0, 3),
  casePc("CASES SIN FUENTE P/GAMERS", "CS AS ATX GT302 ARGB WHITE", "ASUS", 159.03, ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], 407, false, 0, 3),
  casePc("CASES SIN FUENTE P/GAMERS", "CS GB C201P M-ATX ARGB WHITE", "GIGABYTE", 76.67, ["Micro-ATX", "Mini-ITX"], 340, false, 0, 2),
  casePc("CASES SIN FUENTE P/GAMERS", "CS MS ATX MAG FORGE 120A AIRFL", "MSI", 69.82, ["ATX", "Micro-ATX", "Mini-ITX"], 330, false, 0, 2),

  // ---------- Fuentes de poder ----------
  psu("PSU AR 750W NM 80+B CL-750B", "ASROCK", 86.3, 750, "Bronze", "ATX", false),
  psu("PSU AR PG-850P 80+P FM SFX", "ASROCK", 250.44, 850, "Platinum", "SFX", true),
  psu("PSU AR SL-1200P 80+P FM", "ASROCK", 253.51, 1200, "Platinum", "ATX", true),
  psu("PSU AR 1650W FM 80+T TC-1650T", "ASROCK", 615.53, 1650, "Titanium", "ATX", true),
  psu("PSU AS AP-850G FM 80+ GOLD", "ASUS", 144.59, 850, "Gold", "ATX", true),
  psu("PSU AS ROG STRIX 1000P GM 80+P", "ASUS", 292.64, 1000, "Platinum", "ATX", true),
  psu("PSU AS ROG THOR 1200P3 GREY", "ASUS", 569.51, 1200, "Platinum", "ATX", true),
  psu("PSU AS TUF GAMING 1000G WHITE", "ASUS", 212.09, 1000, "Gold", "ATX", true),
  psu("PSU AS TUF-GAMING-750G 80+G", "ASUS", 143.05, 750, "Gold", "ATX", true),
  psu("PSU GB P650G PG5 80+ GOLD", "GIGABYTE", 72.5, 650, "Gold", "ATX", false),
  psu("PSU GB P750BS 750W 80P BRONZE", "GIGABYTE", 90.14, 750, "Bronze", "ATX", false),
  psu("PSU MS A1200PLS PCIE5 80+P", "MSI", 205.95, 1200, "Platinum", "ATX", true),
  psu("PSU MSI MAG A750BN PCIE5 III", "MSI", 85.54, 750, "Bronze", "ATX", false),
  psu("PSU GM ATX 650W TE1325 BK", "TEROS", 52.55, 650, "Bronze", "ATX", false),
  psu("PSU GM ATX 850W TE1320S", "TEROS", 95.51, 850, "Platinum", "ATX", true),

  // ---------- Almacenamiento SSD ----------
  extra("Almacenamiento SSD", "SSD 2.5 SATA", "SSD 128G TG GX2 2.5 SATA III", "TEAMGROUP", 47.97, { capacidad: "128GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", 'SSD BW M100 256GB SATA 2.5"', "BIWIN", 94.01, { capacidad: "256GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", "SSD ADATA SU650 256GB SATA", "ADATA", 78.63, { capacidad: "256GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", "SSD HIKSEMI WAVE(S) 256GB", "HIKSEMI", 81.7, { capacidad: "256GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", 'SSD 512G TF VULCANZ 2.5" SATA', "TEAMGROUP", 120.05, { capacidad: "512GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", 'SSD KING 480GB A400 2.5" SATA', "KINGSTON", 147.67, { capacidad: "480GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", 'SSD KING 960GB A400 2.5" SATA', "KINGSTON", 184.49, { capacidad: "960GB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD 2.5 SATA", 'SSD 1TB TG CX2 2.5" SATA III', "TEAMGROUP", 181.42, { capacidad: "1TB", formato: 'SATA 2.5"' }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD ACER FA100 256GB NVME", "ACER", 95.51, { capacidad: "256GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD HIKSEMI WAVE (P) 256GB", "HIKSEMI", 93.97, { capacidad: "256GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD BW M350 500GB NVME GEN4", "BIWIN", 163.0, { capacidad: "500GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD 512G TG MP33 M.2 NVME G3X4", "TEAMGROUP", 141.53, { capacidad: "512GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD ADATA LEGEND710 512GB NVME", "ADATA", 147.67, { capacidad: "512GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD HIKSEMI FUTUREX 512GB NVME", "HIKSEMI", 156.88, { capacidad: "512GB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD 1T TG NV5000 M.2 PCI-E4X4", "TEAMGROUP", 247.37, { capacidad: "1TB", formato: "M.2 NVMe" }),
  extra("Almacenamiento SSD", "SSD M.2 NVMe", "SSD ADATA LEGEND710 1TB NVME", "ADATA", 219.75, { capacidad: "1TB", formato: "M.2 NVMe" }),

  // ---------- Monitores ----------
  extra("Monitores", "MONITOR CURVO 23 / 27", 'MON ADV 24" FHD 144HZ 1MS CV', "ADVANCE COMPUTER CORP", 129.5, { tamano: '23.6"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR CURVO 23 / 27", 'MON TE 24" FHD 144HZ 1MS CV', "TEROS", 131.04, { tamano: '23.8"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR CURVO 23 / 27", 'MON ADV 27" FHD 144HZ 1MS CV', "ADVANCE COMPUTER CORP", 164.84, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR CURVO 23 / 27", 'MON TE 27" FHD 144HZ 1MS CV', "TEROS", 161.77, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR GAMING CURVO 27 / 31.5", 'MON TE 27" FHD 180HZ 1MS CUR', "TEROS", 152.55, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR GAMING CURVO 27 / 31.5", 'MON TE 27" FHD 200HZ 1MS CV', "TEROS", 194.78, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR GAMING CURVO 27 / 31.5", 'MON TE 32" QHD 180HZ 1MS CV', "TEROS", 272.43, { tamano: '31.5"', resolucion: "QHD (2560 x 1440)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR GAMING CURVO 27 / 31.5", 'MON TE 32" FHD 240HZ 1MS CVO', "TEROS", 269.36, { tamano: '31.5"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Curvo VA" }),
  extra("Monitores", "MONITOR PLANO 21.45 / 23", "HP 21.45 S3 PRO 322PE/VGA/HDMI", "HP COMERCIAL", 150.86, { tamano: '21.45"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 21.45 / 23", "MON LE 21.5 E22-40/VGA/HDMI/DP", "LENOVO - THINKPAD", 190.95, { tamano: '21.5"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 21.45 / 23", 'MON ADV 24" FHD 144HZ 1MS FT', "ADVANCE COMPUTER CORP", 96.76, { tamano: '23.8"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 21.45 / 23", 'MON TE 24" FHD 144HZ 1MS FT', "TEROS", 112.42, { tamano: '23.8"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 21.45 / 23", "MON LG 24 IPS 144HZ 1MS MB FHD", "LG ELECTRONICS", 123.8, { tamano: '24"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 27", "MON 27 AS PA278QV 2K PROART", "ASUS", 400.09, { tamano: '27"', resolucion: "QHD / WQHD (2560 x 1440)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 27", 'MON TE 27" FHD 144HZ 1MS FT', "TEROS", 127.79, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 27", "MON TE 27 QHD 100HZ 1MS CAM/MI", "TEROS", 263.21, { tamano: '27"', resolucion: "QHD (2560 x 1440)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 27", "MON LED 27 IPS FHD 240HZ PIVOT", "LG ELECTRONICS", 261.37, { tamano: '27"', resolucion: "FHD (1920 x 1080)", tipoPantalla: "Plano IPS" }),
  extra("Monitores", "MONITOR PLANO 27", "MON LG 4K U7 27 INCH IPS", "LG ELECTRONICS", 309.43, { tamano: '27"', resolucion: "4K UHD (3840 x 2160)", tipoPantalla: "Plano IPS" }),

  // ---------- Periféricos ----------
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "WIRELESS KEYBOARD MICE COMBO", "LENOVO - IDEA", 58.1, { tipoConexion: "Inalámbrico", interfaz: "Receptor USB", incluyeAuriculares: "false", incluyeMousepad: "false" }),
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "LENOVO 310 USB-A COMBO LA", "LENOVO - IDEA", 42.17, { tipoConexion: "Cableado", interfaz: "USB-A", incluyeAuriculares: "false", incluyeMousepad: "false" }),
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "KIT TECLADO Y MOUSE USBTE5015", "TEROS", 13.5, { tipoConexion: "Cableado", interfaz: "USB", incluyeAuriculares: "false", incluyeMousepad: "false" }),
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "KIT TECLADO+MOUSE COPILOT BK", "TEROS", 17.75, { tipoConexion: "Cableado", interfaz: "USB", teclaEspecial: "Copilot", incluyeAuriculares: "false", incluyeMousepad: "false" }),
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "4 EN 1 TECLADO+ MOUSE+MSPAD+HD", "TEROS", 35.17, { tipoConexion: "Cableado", interfaz: "USB", incluyeAuriculares: "true", incluyeMousepad: "true" }),
  extra("Periféricos", "TECLADO+MOUSE COMBO KIT", "LENOVO 300 USB COMBO KB + MS", "LENOVO - IDEA", 42.17, { tipoConexion: "Cableado", interfaz: "USB", incluyeAuriculares: "false", incluyeMousepad: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "LENOVO 510 WIRELESS KB+MS WHTE", "LENOVO - IDEA", 59.16, { tipoConexion: "Inalámbrico", interfaz: "Receptor USB", color: "Blanco", incluyeAuriculares: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "LENOVO 700 WIRELESS COMBO LA", "LENOVO - IDEA", 83.61, { tipoConexion: "Inalámbrico", interfaz: "Receptor USB", distribucion: "Español (LA)", incluyeAuriculares: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "TECLADO+MOUSE STD W. TE4071", "TEROS", 18.17, { tipoConexion: "Inalámbrico 2.4 GHz", interfaz: "Receptor USB", color: "Negro", incluyeAuriculares: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "KIT TECLADO+MOUSE W. TE5011CS", "TEROS", 18.38, { tipoConexion: "Inalámbrico 2.4 GHz", interfaz: "Receptor USB", sensibilidadMouseDPI: "1000", incluyeAuriculares: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "KIT TECLADO Y MOUSE WIRELESS T", "TEROS", 18.17, { tipoConexion: "Inalámbrico 2.4 GHz", interfaz: "Receptor USB", color: "Negro", incluyeAuriculares: "false" }),
  extra("Periféricos", "TECLADO+MOUSE KIT INALAMB", "TECLADO+MOUSE STD WIRELESS TE", "TEROS", 18.17, { tipoConexion: "Inalámbrico 2.4 GHz", interfaz: "Receptor USB", color: "Blanco", incluyeAuriculares: "false" }),
];

async function crearProducto(p: ProductoSeed) {
  await prisma.producto.create({
    data: {
      nombre: p.nombre,
      marca: p.marca,
      precioVenta: p.precioVenta,
      categoria: p.categoria,
      subcategoria: p.subcategoria,
      imagenUrl: IMAGEN_POR_CATEGORIA[p.categoria],
      atributos: {
        create: Object.entries(p.atributos).map(([clave, valor]) => ({ clave, valor })),
      },
    },
  });
}

async function main() {
  console.log(`Reseteando datos previos (${CATALOGO.length} productos por cargar)...`);
  await prisma.cotizacionDetalle.deleteMany();
  await prisma.cotizacion.deleteMany();
  await prisma.productoAtributo.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.cliente.deleteMany();

  for (const producto of CATALOGO) {
    await crearProducto(producto);
  }
  console.log(`Productos creados: ${await prisma.producto.count()}`);

  const clientePrueba = await prisma.cliente.create({
    data: { nombre: "Cliente Prueba", correo: "prueba@test.cl", telefono: "+56912345678" },
  });
  const clienteAna = await prisma.cliente.create({
    data: { nombre: "Ana Martínez", correo: "ana.martinez@example.com", telefono: "+56987654321" },
  });

  const porNombre = async (nombre: string) => {
    const producto = await prisma.producto.findFirst({ where: { nombre } });
    if (!producto) throw new Error(`Producto no encontrado en catálogo: ${nombre}`);
    return producto;
  };

  const buildConfirmada = [
    { producto: await porNombre("PROC AMD RYZEN 5 8500G 3.50GHZ"), cantidad: 1 },
    { producto: await porNombre("MB AR B850M-X WIFI S/V/L DDR5"), cantidad: 1 },
    { producto: await porNombre("MEM RAM 16G KF BEAST RGB 5.6GZ"), cantidad: 1 },
    { producto: await porNombre("CASE STD ATX TE1323 BLACK"), cantidad: 1 },
    { producto: await porNombre("PSU AS TUF-GAMING-750G 80+G"), cantidad: 1 },
  ];
  const totalConfirmada = buildConfirmada.reduce((s, d) => s + d.producto.precioVenta * d.cantidad, 0);
  const cotizacionConfirmada = await prisma.cotizacion.create({
    data: {
      clienteId: clientePrueba.id,
      estado: "Confirmada",
      total: totalConfirmada,
      detalles: {
        create: buildConfirmada.map((d) => ({
          productoId: d.producto.id,
          cantidad: d.cantidad,
          precioUnitario: d.producto.precioVenta,
        })),
      },
    },
  });

  const buildBorrador = [
    { producto: await porNombre("PROC INT CORE I5-12400F 2.50GZ (Opción A)"), cantidad: 1 },
    { producto: await porNombre("MB MS H610M-S S/V/L DDR4"), cantidad: 1 },
    { producto: await porNombre("MEM RAM 8G HIK ARM 3.20GH DDR4"), cantidad: 2 },
    { producto: await porNombre("CASE MICRO ATX 450W TE1319G"), cantidad: 1 },
    { producto: await porNombre("VGA 6G MS RTX3050 LP GDDR6"), cantidad: 1 },
  ];
  const totalBorrador = buildBorrador.reduce((s, d) => s + d.producto.precioVenta * d.cantidad, 0);
  const cotizacionBorrador = await prisma.cotizacion.create({
    data: {
      clienteId: clienteAna.id,
      estado: "Borrador",
      total: totalBorrador,
      detalles: {
        create: buildBorrador.map((d) => ({
          productoId: d.producto.id,
          cantidad: d.cantidad,
          precioUnitario: d.producto.precioVenta,
        })),
      },
    },
  });

  console.log("Seed ejecutado correctamente 🚀");
  console.log({
    clientes: [clientePrueba.id, clienteAna.id],
    cotizaciones: [
      { id: cotizacionConfirmada.id, estado: "Confirmada", total: totalConfirmada },
      { id: cotizacionBorrador.id, estado: "Borrador", total: totalBorrador },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
