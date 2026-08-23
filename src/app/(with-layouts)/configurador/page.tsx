import type { Metadata } from "next";
import WizardContainer from "./_components/wizard-container";

export const metadata: Metadata = {
  title: "Configurador de PC",
};

export default function ConfiguradorPage() {
  return <WizardContainer />;
}
