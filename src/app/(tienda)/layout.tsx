import type { Metadata } from "next";
import Link from "next/link";
import { NOMBRE_TIENDA } from "@/config/tienda";

export const metadata: Metadata = {
  title: {
    template: "%s | PCBuilder",
    default: "PCBuilder — Arma tu PC a medida",
  },
  description:
    "Configura tu PC por partes, valida la compatibilidad y recibe tu cotización al instante.",
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-background-gray-secondary_alt_2">
      <header className="sticky top-0 z-20 border-b border-card-border bg-card-surface-area/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-384 items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/configurador" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white-100">
              PC
            </span>
            <span className="text-lg font-bold text-text-primary">{NOMBRE_TIENDA}</span>
          </Link>
          <Link
            href="/configurador"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Configurador
          </Link>
        </div>
      </header>

      <main className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">{children}</main>

      <footer className="border-t border-card-border bg-card-surface-area">
        <div className="mx-auto w-full max-w-384 px-4 py-5 sm:px-6">
          <p className="text-center text-xs text-input-placeholder-text">
            {NOMBRE_TIENDA} © {new Date().getFullYear()} — Cotiza tu PC ideal en minutos
          </p>
        </div>
      </footer>
    </div>
  );
}
