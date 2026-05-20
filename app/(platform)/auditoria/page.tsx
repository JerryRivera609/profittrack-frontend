import { ModulePage } from "../../components/platform/module-page";

export default function AuditoriaPage() {
  return (
    <ModulePage
      description="Trazabilidad de cambios sensibles, sesiones, permisos y operaciones criticas."
      eyebrow="Seguridad"
      stats={[
        { label: "Eventos hoy", value: "128" },
        { label: "Alertas", value: "4" },
        { label: "Usuarios auditados", value: "21" },
      ]}
      title="Auditoria"
    />
  );
}
