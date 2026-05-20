import { RoleLoginPage } from "../components/auth/role-login-page";

export default function AdminLoginPage() {
  return (
    <RoleLoginPage
      defaultEmail="admin@profittrack.app"
      description="Acceso de administracion global para crear empresas, owners, usuarios, permisos y revisar auditoria."
      role="ADMIN"
      title="Administra toda la plataforma desde un solo portal."
    />
  );
}
