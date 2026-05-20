import { RoleLoginPage } from "../components/auth/role-login-page";

export default function OwnerLoginPage() {
  return (
    <RoleLoginPage
      defaultEmail="owner@empresa.com"
      description="Acceso normal para owners: gestion de su empresa, equipo, proyectos, horas HH, finanzas y reportes."
      role="OWNER"
      title="Gestiona la operacion de tu empresa."
    />
  );
}
