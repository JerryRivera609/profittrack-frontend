import { ModulePage } from "../../components/platform/module-page";

export default function TareasPage() {
  return (
    <ModulePage
      description="Backlog, responsables, prioridades, estados, estimaciones y seguimiento de entregables."
      eyebrow="Productividad"
      stats={[
        { label: "Abiertas", value: "57" },
        { label: "Vencidas", value: "12" },
        { label: "Cerradas semana", value: "41" },
      ]}
      title="Tareas"
    />
  );
}
