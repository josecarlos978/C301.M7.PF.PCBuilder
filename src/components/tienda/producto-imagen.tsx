"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

interface ProductoImagenProps {
  imagenUrl?: string | null;
  nombre: string;
  className?: string;
}

export function ProductoImagen({ imagenUrl, nombre, className }: ProductoImagenProps) {
  const [fallo, setFallo] = useState(false);

  if (!imagenUrl || fallo) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-primary-50 text-lg font-semibold text-primary-500 uppercase",
          className,
        )}
      >
        {nombre.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={imagenUrl}
      alt={nombre}
      loading="lazy"
      onError={() => setFallo(true)}
      className={cn("object-cover", className)}
    />
  );
}
