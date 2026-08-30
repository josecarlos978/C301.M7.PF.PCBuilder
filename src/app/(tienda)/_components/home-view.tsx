"use client";

import { ProductosDestacados } from "@/components/tienda/productos-destacados";
import { HomeCategorias } from "./home-categorias";
import { HomeHero } from "./home-hero";
import { HomePasos } from "./home-pasos";

export function HomeView() {
  return (
    <div className="mx-auto w-full max-w-384 space-y-14 px-4 py-8 sm:px-6">
      <HomeHero />
      <HomePasos />
      <HomeCategorias />
      <ProductosDestacados />
    </div>
  );
}