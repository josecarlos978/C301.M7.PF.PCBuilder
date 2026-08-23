"use client";

import { Alert, AlertContent, AlertDescription, AlertIndicator, AlertTitle } from "@/components/tailgrids/core/alert";
import type { ValidacionCompleta } from "@/services/api/configurador/client";

interface ValidacionAlertsProps {
  resultado: ValidacionCompleta | null;
}

export function ValidacionAlerts({ resultado }: ValidacionAlertsProps) {
  if (!resultado) return null;

  if (resultado.valido) {
    return (
      <Alert status="success">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Configuración válida</AlertTitle>
          {resultado.advertencias.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5">
              {resultado.advertencias.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <AlertDescription>El build cumple todas las reglas de compatibilidad.</AlertDescription>
          )}
        </AlertContent>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {resultado.errores.length > 0 && (
        <Alert status="error">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>No se puede guardar el build</AlertTitle>
            <ul className="list-inside list-disc space-y-0.5">
              {resultado.errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </AlertContent>
        </Alert>
      )}
      {resultado.advertencias.length > 0 && (
        <Alert status="warning">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Advertencias</AlertTitle>
            <ul className="list-inside list-disc space-y-0.5">
              {resultado.advertencias.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
