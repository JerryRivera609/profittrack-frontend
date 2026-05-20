import { ModulePage } from "../../components/platform/module-page";

export default function ConfiguracionPage() {
  return (
    <ModulePage
      description="Parametros de empresa, roles, permisos, notificaciones, integraciones y seguridad."
      eyebrow="Sistema"
      stats={[
        { label: "Roles", value: "4" },
        { label: "Permisos", value: "38" },
        { label: "Integraciones", value: "2" },
      ]}
      title="Configuracion"
    />
  );
}
