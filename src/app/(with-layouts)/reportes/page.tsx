import type { Metadata } from "next";
import ReportesView from "./_components/reportes-view";

export const metadata: Metadata = {
  title: "Reportes",
};

export default function ReportesPage() {
  return <ReportesView />;
}
