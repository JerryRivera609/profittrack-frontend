import { ModulePage } from "../../components/platform/module-page";

export default function ReportesPage() {
  return (
    <ModulePage
      description="Reportes ejecutivos, productividad, rentabilidad por proyecto y comparativos mensuales."
      eyebrow="Analitica"
      stats={[
        { label: "Reportes guardados", value: "14" },
        { label: "Programados", value: "5" },
        { label: "Exportaciones", value: "31" },
      ]}
      title="Reportes"
    />
  );
}
