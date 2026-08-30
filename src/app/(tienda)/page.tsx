import type { Metadata } from "next";
import { HomeView } from "./_components/home-view";

export const metadata: Metadata = {
  description:
    "Arma tu PC a medida con el configurador paso a paso de PCBuilder: elige CPU, placa, RAM, GPU y más, valida la compatibilidad y cotiza al instante. También puedes explorar el catálogo completo.",
};

export default function HomePage() {
  return <HomeView />;
}