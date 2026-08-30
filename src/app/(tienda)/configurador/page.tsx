import type { Metadata } from "next";
import WizardContainer from "./_components/wizard-container";

export const metadata: Metadata = {
  title: "Configurador de PC",
  description:
    "Selecciona cada parte de tu PC, valida compatibilidad, descarga tu cotización y envíala por WhatsApp.",
};

export default function ConfiguradorPage() {
  return <WizardContainer />;
}
