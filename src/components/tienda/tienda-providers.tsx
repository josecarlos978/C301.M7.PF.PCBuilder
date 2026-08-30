"use client";

import type { ReactNode } from "react";
import { CarritoProvider } from "./carrito-context";

export function TiendaProviders({ children }: { children: ReactNode }) {
  return <CarritoProvider>{children}</CarritoProvider>;
}