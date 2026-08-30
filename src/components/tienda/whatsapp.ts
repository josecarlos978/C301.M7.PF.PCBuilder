import { NOMBRE_TIENDA } from "@/config/tienda";
import type { DatosCliente, ProductoDTO } from "@/services/pcbuilder/types";

const moneda = (valor: number) => `$${valor.toFixed(2)}`;

export function abrirWhatsApp(numeroAdmin: string, mensaje: string): void {
  const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export interface LineaCarritoWhatsApp {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export function construirMensajeCarritoWhatsApp(
  items: LineaCarritoWhatsApp[],
  datosCliente: DatosCliente,
  numeroCotizacion?: number,
): string {
  const totalItems = items.reduce(
    (suma, item) => suma + item.precioUnitario * item.cantidad,
    0,
  );

  const lineas = [
    `Hola! Quiero cotizar estos productos en ${NOMBRE_TIENDA}:`,
    "",
    "🛒 *Mi selección:*",
    ...items.map(
      (item) =>
        `• ${item.cantidad}× ${item.nombre} — ${moneda(item.precioUnitario * item.cantidad)}`,
    ),
    "",
    `💰 *Total estimado: ${moneda(totalItems)}*`,
    "",
    `👤 Nombre: ${datosCliente.nombre}`,
    datosCliente.correo && `📧 Correo: ${datosCliente.correo}`,
    datosCliente.telefono && `📱 Teléfono: ${datosCliente.telefono}`,
    numeroCotizacion && `🧾 Cotización web #${numeroCotizacion}`,
    "",
    "Quedo atento(a) a su confirmación. Gracias!",
  ].filter(Boolean);

  return lineas.join("\n");
}

export function construirMensajeProductoWhatsApp(producto: ProductoDTO): string {
  return [
    `Hola! Me interesa este producto de ${NOMBRE_TIENDA}:`,
    "",
    `• ${producto.nombre} (${producto.marca})`,
    `• Precio: ${moneda(producto.precioVenta)}`,
    "",
    "Gracias!",
  ].join("\n");
}