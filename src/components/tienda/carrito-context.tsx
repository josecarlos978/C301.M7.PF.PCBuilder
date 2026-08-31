"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { ProductoDTO } from "@/services/pcbuilder/types";

export interface ItemCarrito {
  producto: ProductoDTO;
  cantidad: number;
}

const CLAVE_STORAGE = "pcbuilder:carrito";
const SNAPSHOT_VACIO: ItemCarrito[] = [];

function cargarPersistido(): ItemCarrito[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_STORAGE);
    if (!crudo) return [];
    const datos = JSON.parse(crudo) as unknown;
    if (!Array.isArray(datos)) return [];
    return datos
      .filter(
        (item): item is ItemCarrito =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as ItemCarrito).producto?.id === "number" &&
          typeof (item as ItemCarrito).producto?.nombre === "string" &&
          typeof (item as ItemCarrito).producto?.precioVenta === "number" &&
          typeof (item as ItemCarrito).cantidad === "number" &&
          (item as ItemCarrito).cantidad >= 1,
      )
      .map((item) => ({ ...item, cantidad: Math.floor(item.cantidad) }));
  } catch {
    return [];
  }
}

// Store externo al árbol de React (patrón useSyncExternalStore) para leer/escribir el
// carrito persistido en localStorage sin mismatch de hidratación ni setState dentro de efectos.
let itemsActuales: ItemCarrito[] | null = null;
const listeners = new Set<() => void>();

function obtenerItems(): ItemCarrito[] {
  if (itemsActuales === null) {
    itemsActuales = cargarPersistido();
  }
  return itemsActuales;
}

function actualizarItems(actualizador: (prev: ItemCarrito[]) => ItemCarrito[]) {
  itemsActuales = actualizador(obtenerItems());
  try {
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(itemsActuales));
  } catch {
    // localStorage no disponible: el carrito vive solo en memoria
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ItemCarrito[] {
  return obtenerItems();
}

function getServerSnapshot(): ItemCarrito[] {
  return SNAPSHOT_VACIO;
}

interface CarritoContextValue {
  items: ItemCarrito[];
  total: number;
  cantidadItems: number;
  agregar: (producto: ProductoDTO) => void;
  quitar: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  enCarrito: (productoId: number) => boolean;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const valor = useMemo<CarritoContextValue>(() => {
    return {
      items,
      total: items.reduce((suma, item) => suma + item.producto.precioVenta * item.cantidad, 0),
      cantidadItems: items.reduce((suma, item) => suma + item.cantidad, 0),
      agregar(producto) {
        actualizarItems((prev) => {
          const existente = prev.find((item) => item.producto.id === producto.id);
          if (existente) {
            return prev.map((item) =>
              item.producto.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item,
            );
          }
          return [...prev, { producto, cantidad: 1 }];
        });
      },
      quitar(productoId) {
        actualizarItems((prev) => prev.filter((item) => item.producto.id !== productoId));
      },
      actualizarCantidad(productoId, cantidad) {
        actualizarItems((prev) =>
          cantidad <= 0
            ? prev.filter((item) => item.producto.id !== productoId)
            : prev.map((item) =>
                item.producto.id === productoId ? { ...item, cantidad } : item,
              ),
        );
      },
      vaciar() {
        actualizarItems(() => []);
      },
      enCarrito(productoId) {
        return items.some((item) => item.producto.id === productoId);
      },
    };
  }, [items]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextValue {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return contexto;
}
