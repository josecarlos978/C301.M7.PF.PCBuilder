import { Badge } from "@/components/tailgrids/core/badge";

const COLOR_POR_ESTADO: Record<string, "success" | "warning" | "error" | "gray"> = {
  Confirmada: "success",
  Borrador: "warning",
  Rechazada: "error",
};

export function EstadoBadge({ estado }: { estado: string }) {
  return (
    <Badge color={COLOR_POR_ESTADO[estado] ?? "gray"} size="md">
      {estado}
    </Badge>
  );
}
