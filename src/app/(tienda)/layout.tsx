import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TiendaProviders } from "@/components/tienda/tienda-providers";
import { CarritoTrigger } from "@/components/tienda/carrito-trigger";
import { NOMBRE_TIENDA } from "@/config/tienda";

export const metadata: Metadata = {
  title: {
    template: "%s | CyM",
    absolute: "CyM — Arma tu PC a medida",
  },
  description:
    "Configura tu PC por partes, valida la compatibilidad y recibe tu cotización al instante.",
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <TiendaProviders>
      <div className="flex h-full flex-col bg-background-gray-secondary_alt_2">
        <header className="sticky top-0 z-20 border-b border-card-border bg-card-surface-area/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-384 items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-cym.png"
                  alt={NOMBRE_TIENDA}
                  width={140}
                  height={68}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/configurador"
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  Configurador
                </Link>
                <Link
                  href="/catalogo"
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  Catálogo
                </Link>
              </nav>
            </div>
            <CarritoTrigger />
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
    </TiendaProviders>
  );
}
