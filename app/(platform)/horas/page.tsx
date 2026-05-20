import { ModulePage } from "../../components/platform/module-page";

export default function HorasPage() {
  return (
    <ModulePage
      description="Registro, aprobacion y valorizacion de horas hombre por tarea, proyecto y empleado."
      eyebrow="Horas HH"
      stats={[
        { label: "Registradas semana", value: "342" },
        { label: "Pendientes", value: "36" },
        { label: "Aprobadas", value: "289" },
      ]}
      title="Control de horas hombre"
    />
  );
}
