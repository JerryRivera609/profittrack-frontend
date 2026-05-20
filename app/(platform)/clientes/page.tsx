import { ModulePage } from "../../components/platform/module-page";

export default function ClientesPage() {
  return (
    <ModulePage
      description="Cartera de clientes, contactos, contratos, proyectos vinculados y rentabilidad por cuenta."
      eyebrow="CRM operativo"
      stats={[
        { label: "Clientes activos", value: "18" },
        { label: "Contratos", value: "26" },
        { label: "Cuentas criticas", value: "2" },
      ]}
      title="Clientes"
    />
  );
}
