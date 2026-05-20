import { ModulePage } from "../../components/platform/module-page";

export default function EmpleadosPage() {
  return (
    <ModulePage
      description="Gestion de personal, roles, contratos, estado laboral y asignaciones a proyectos."
      eyebrow="HH.HH"
      stats={[
        { label: "Empleados activos", value: "42" },
        { label: "Lideres", value: "6" },
        { label: "Altas pendientes", value: "3" },
      ]}
      title="Empleados"
    />
  );
}
