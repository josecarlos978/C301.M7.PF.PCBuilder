import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | CyM",
};

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-gray-secondary_alt_2 px-4">
      <div className="w-full max-w-100 rounded-2xl border border-card-border bg-card-surface-area p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo-cym.png" alt="CyM" width={140} height={68} className="h-10 w-auto" priority />
          <h1 className="mt-2 text-lg font-semibold text-text-primary">Panel administrativo</h1>
          <p className="text-sm text-text-secondary">Ingresa tus credenciales para continuar</p>
        </div>

        <LoginForm from={from} />
      </div>
    </div>
  );
}
