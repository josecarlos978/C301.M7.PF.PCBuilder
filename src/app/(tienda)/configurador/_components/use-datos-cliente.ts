"use client";

import { useState } from "react";
import type { DatosCliente } from "./cotizacion-archivos";

export function useDatosCliente() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const nombreValido = nombre.trim().length > 1;
  const correoValido = /.+@.+\..+/.test(correo.trim());
  const formularioValido = nombreValido && correoValido;

  function datos(): DatosCliente {
    return {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim() || undefined,
    };
  }

  function limpiar() {
    setNombre("");
    setCorreo("");
    setTelefono("");
  }

  return {
    nombre,
    setNombre,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    nombreValido,
    correoValido,
    formularioValido,
    datos,
    limpiar,
  };
}