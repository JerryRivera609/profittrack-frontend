import { ModulePage } from "../../components/platform/module-page";

export default function ProyectosPage() {
  return (
    <ModulePage
      description="Planificacion, lideres, presupuestos, margenes, hitos y avance por proyecto."
      eyebrow="Project Management"
      stats={[
        { label: "Activos", value: "8" },
        { label: "En riesgo", value: "2" },
        { label: "Margen promedio", value: "31%" },
      ]}
      title="Proyectos"
    />
  );
}
