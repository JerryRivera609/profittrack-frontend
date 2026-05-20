import { ModulePage } from "../../components/platform/module-page";

export default function FinanzasPage() {
  return (
    <ModulePage
      description="Ingresos, gastos, rentabilidad, centros de costo y salud financiera de la empresa."
      eyebrow="Finanzas"
      stats={[
        { label: "Ingresos mes", value: "S/ 86k" },
        { label: "Costos HH", value: "S/ 42k" },
        { label: "Margen neto", value: "27%" },
      ]}
      title="Control financiero"
    />
  );
}
