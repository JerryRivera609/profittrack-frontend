import { RoleLoginPage } from "../components/auth/role-login-page";

export default function LoginPage() {
  return (
    <RoleLoginPage
      description="Ingresa con tu correo y contrasenia. El sistema identificara si eres Administrador u Owner y te llevara a la interfaz correspondiente."
      title="Accede a ProfitTrack desde un solo login."
    />
  );
}
