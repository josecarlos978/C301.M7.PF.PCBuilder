export interface ClienteInput {
  nombre: string;
  correo: string;
  telefono?: string;
}

export interface ClienteFiltros {
  busca?: string;
}
