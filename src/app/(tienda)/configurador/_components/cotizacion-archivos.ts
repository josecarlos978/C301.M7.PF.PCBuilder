import type { FilaResumen } from "./resumen-panel";
import { NOMBRE_TIENDA } from "@/config/tienda";
import type { DatosCliente } from "@/services/pcbuilder/types";
import { abrirWhatsApp } from "@/components/tienda/whatsapp";

export { abrirWhatsApp };
export type { DatosCliente };

function fechaLarga(fecha = new Date()): string {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(fecha);
}

function escapeHtml(valor: string): string {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function construirLineasBuild(filas: FilaResumen[]) {
  return filas
    .flatMap((fila) =>
      fila.productos.map((producto) => ({ etiqueta: fila.etiqueta, producto })),
    )
}

export function totalDe(filas: FilaResumen[]): number {
  return filas.flatMap((fila) => fila.productos).reduce((suma, p) => suma + p.precioVenta, 0);
}

export function construirMensajeWhatsApp(
  filas: FilaResumen[],
  datosCliente: DatosCliente,
  numeroCotizacion?: number,
): string {
  const moneda = (v: number) => `$${v.toFixed(2)}`;
  const lineas = [
    `Hola! Quiero cotizar esta PC en ${NOMBRE_TIENDA}:`,
    "",
    "🛠 *Mi build:*",
    ...construirLineasBuild(filas).map(
      ({ etiqueta, producto }) => `• ${etiqueta}: ${producto.nombre} — ${moneda(producto.precioVenta)}`,
    ),
    "",
    `💰 *Total estimado: ${moneda(totalDe(filas))}*`,
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

export function descargarCotizacionHtml(
  filas: FilaResumen[],
  datosCliente?: DatosCliente,
  numeroCotizacion?: number,
): void {
  const moneda = (v: number) => `$${v.toFixed(2)}`;
  const lineas = construirLineasBuild(filas);
  const filasTabla = lineas
    .map(
      ({ etiqueta, producto }) => `
        <tr>
          <td>${escapeHtml(etiqueta)}</td>
          <td>
            <strong>${escapeHtml(producto.nombre)}</strong><br />
            <small>${escapeHtml(producto.marca)} · ${escapeHtml(producto.categoria)}</small>
          </td>
          <td class="num">${moneda(producto.precioVenta)}</td>
        </tr>`,
    )
    .join("");

  const bloqueCliente = datosCliente
    ? `<p class="cliente">
        Cliente: <strong>${escapeHtml(datosCliente.nombre)}</strong>${
          datosCliente.correo ? `<br />Correo: ${escapeHtml(datosCliente.correo)}` : ""
        }${datosCliente.telefono ? `<br />Teléfono: ${escapeHtml(datosCliente.telefono)}` : ""}
      </p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Cotización PC${datosCliente ? ` — ${escapeHtml(datosCliente.nombre)}` : ""}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 40px; }
  .cabecera { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4650e5; padding-bottom: 16px; }
  .marca { font-size: 26px; font-weight: bold; color: #4650e5; }
  .meta { text-align: right; font-size: 12px; color: #6b7280; }
  h1 { font-size: 20px; margin: 24px 0 8px; }
  .cliente { font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; vertical-align: top; }
  th { background: #f3f4f6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
  .num { text-align: right; white-space: nowrap; }
  tfoot td { font-weight: bold; font-size: 15px; background: #f9fafb; }
  .nota { margin-top: 24px; font-size: 11px; color: #6b7280; }
</style>
</head>
<body>
  <div class="cabecera">
    <div class="marca">${escapeHtml(NOMBRE_TIENDA)}</div>
    <div class="meta">
      Cotización ${numeroCotizacion ? `#${numeroCotizacion}` : "web"}<br />
      ${fechaLarga()}
    </div>
  </div>

  <h1>Cotización de PC</h1>
  ${bloqueCliente}

  <table>
    <thead>
      <tr><th>Parte</th><th>Producto</th><th class="num">Precio</th></tr>
    </thead>
    <tbody>${filasTabla}</tbody>
    <tfoot>
      <tr><td colspan="2">Total estimado</td><td class="num">${moneda(totalDe(filas))}</td></tr>
    </tfoot>
  </table>

  <p class="nota">
    Precios sujetos a variación sin previo aviso. Esta cotización fue generada automáticamente
    desde el configurador web.
  </p>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  const sello = new Date().toISOString().slice(0, 10);
  enlace.href = url;
  enlace.download = `cotizacion-pc-${sello}.html`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
