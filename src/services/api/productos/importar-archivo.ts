import * as XLSX from "xlsx";
import type { AtributosProducto } from "@/services/pcbuilder/types";
import type { ProductoInput } from "./types";

export interface FilaImportada {
  fila: number;
  input: ProductoInput | null;
  errores: string[];
}

type CampoBase = "nombre" | "marca" | "precioVenta" | "categoria" | "subcategoria" | "imagenUrl";

// Encabezados aceptados (normalizados a minúsculas) para las columnas fijas del producto.
// Cualquier otra columna de la hoja se toma como un atributo (clave = encabezado, valor = celda).
const CAMPOS_BASE: Record<string, CampoBase> = {
  nombre: "nombre",
  marca: "marca",
  precio: "precioVenta",
  precioventa: "precioVenta",
  "precio de venta": "precioVenta",
  categoria: "categoria",
  categoría: "categoria",
  subcategoria: "subcategoria",
  subcategoría: "subcategoria",
  imagenurl: "imagenUrl",
  imagen: "imagenUrl",
  "url de imagen": "imagenUrl",
};

function filaVacia(fila: Record<string, unknown>): boolean {
  return Object.values(fila).every((valor) => String(valor ?? "").trim() === "");
}

function procesarFila(fila: Record<string, unknown>, numeroFila: number): FilaImportada {
  const errores: string[] = [];
  let nombre = "";
  let marca = "";
  let categoria = "";
  let subcategoria = "";
  let imagenUrl: string | undefined;
  let precioVentaTexto = "";
  let precioVenta: number | null = null;
  const atributos: AtributosProducto = {};

  for (const [encabezadoOriginal, valorCrudo] of Object.entries(fila)) {
    const valor = String(valorCrudo ?? "").trim();
    const campoBase = CAMPOS_BASE[encabezadoOriginal.trim().toLowerCase()];

    if (!campoBase) {
      if (valor) atributos[encabezadoOriginal.trim()] = valor;
      continue;
    }

    switch (campoBase) {
      case "nombre":
        nombre = valor;
        break;
      case "marca":
        marca = valor;
        break;
      case "categoria":
        categoria = valor;
        break;
      case "subcategoria":
        subcategoria = valor;
        break;
      case "imagenUrl":
        if (valor) imagenUrl = valor;
        break;
      case "precioVenta":
        precioVentaTexto = valor;
        break;
    }
  }

  if (precioVentaTexto) {
    const numero = Number(precioVentaTexto.replace(",", "."));
    precioVenta = Number.isFinite(numero) ? numero : null;
  }

  if (!nombre) errores.push("Falta el nombre");
  if (!marca) errores.push("Falta la marca");
  if (!categoria) errores.push("Falta la categoría");
  if (!precioVentaTexto) errores.push("Falta el precio de venta");
  else if (precioVenta === null) errores.push(`El precio de venta "${precioVentaTexto}" no es un número válido`);
  else if (precioVenta < 0) errores.push("El precio de venta no puede ser negativo");

  if (errores.length > 0) {
    return { fila: numeroFila, input: null, errores };
  }

  return {
    fila: numeroFila,
    input: {
      nombre,
      marca,
      precioVenta: precioVenta!,
      categoria,
      subcategoria: subcategoria || categoria,
      imagenUrl,
      atributos,
    },
    errores: [],
  };
}

export async function parsearArchivoProductos(archivo: File): Promise<FilaImportada[]> {
  const buffer = await archivo.arrayBuffer();
  const libro = XLSX.read(buffer, { type: "array" });
  const primeraHoja = libro.Sheets[libro.SheetNames[0]];
  if (!primeraHoja) return [];

  const filasCrudas = XLSX.utils.sheet_to_json<Record<string, unknown>>(primeraHoja, {
    defval: "",
    raw: false,
  });

  return filasCrudas
    .map((fila, indice) => ({ fila, numeroFila: indice + 2 })) // fila 1 = encabezado
    .filter(({ fila }) => !filaVacia(fila))
    .map(({ fila, numeroFila }) => procesarFila(fila, numeroFila));
}

export function descargarPlantillaProductos(): void {
  const encabezados = ["nombre", "marca", "precioVenta", "categoria", "subcategoria", "imagenUrl", "socket", "tdp"];
  const filas = [
    encabezados,
    // Con imagenUrl: opcional, si la dejas vacía el producto muestra un ícono con la inicial del nombre.
    [
      "PROC AMD RYZEN 5 8500G 3.50GHZ",
      "AMD",
      214.51,
      "Procesadores",
      "CPU AMD RYZEN 5 SAM5 8XXX",
      "https://commons.wikimedia.org/wiki/Special:FilePath/AMD_Ryzen_9_7900X.jpg?width=1200",
      "AM5",
      65,
    ],
    // Sin imagenUrl: también es válido, la columna queda vacía.
    ["MB AR B850M-X WIFI S/V/L DDR5", "ASROCK", 194.13, "Mainboard", "MB SOCKET AM5 AMD", "", "AM5", ""],
  ];

  const hoja = XLSX.utils.aoa_to_sheet(filas);
  hoja["!cols"] = encabezados.map((encabezado) => ({ wch: Math.max(encabezado.length + 4, 14) }));

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Productos");
  XLSX.writeFile(libro, "plantilla-productos.xlsx");
}
