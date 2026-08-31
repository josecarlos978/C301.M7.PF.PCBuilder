"use client";

import { useActionState } from "react";
import { Alert, AlertDescription, AlertIndicator } from "@/components/tailgrids/core/alert";
import { Button } from "@/components/tailgrids/core/button";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { login, type LoginFormState } from "@/services/auth/actions";

const ESTADO_INICIAL: LoginFormState = {};

interface LoginFormProps {
  from?: string;
}

export function LoginForm({ from }: LoginFormProps) {
  const [estado, accion, enviando] = useActionState(login, ESTADO_INICIAL);

  return (
    <form action={accion} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="from" value={from ?? "/admin"} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-usuario">Usuario</Label>
        <Input id="login-usuario" name="usuario" autoComplete="username" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-clave">Contraseña</Label>
        <Input id="login-clave" name="clave" type="password" autoComplete="current-password" required />
      </div>

      {estado.error && (
        <Alert status="error">
          <AlertIndicator />
          <AlertDescription>{estado.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="mt-2 w-full" isDisabled={enviando}>
        {enviando ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
