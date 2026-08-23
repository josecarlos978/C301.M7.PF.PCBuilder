export class ApiError extends Error {
  readonly status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const respuesta = await fetch(url, init);
  const datos: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      datos && typeof datos === "object" && "error" in datos
        ? String((datos as { error: unknown }).error)
        : `Error ${respuesta.status}`;
    throw new ApiError(mensaje, respuesta.status);
  }

  return datos as T;
}

export function apiGet<T>(url: string): Promise<T> {
  return request<T>(url);
}

export function apiPost<T>(url: string, cuerpo: unknown): Promise<T> {
  return request<T>(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
}

export function apiPatch<T>(url: string, cuerpo: unknown): Promise<T> {
  return request<T>(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
}

export function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" });
}
