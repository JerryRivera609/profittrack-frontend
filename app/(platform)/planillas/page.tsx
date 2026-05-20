import { ModulePage } from "../../components/platform/module-page";

export default function PlanillasPage() {
  return (
    <ModulePage
      description="Calculo de planillas, pagos, descuentos, cierres mensuales y exportaciones contables."
      eyebrow="RR.HH financiero"
      stats={[
        { label: "Periodo actual", value: "Mayo" },
        { label: "Colaboradores", value: "42" },
        { label: "Pendiente cierre", value: "S/ 18k" },
      ]}
      title="Planillas"
    />
  );
}
