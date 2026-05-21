import { RoleLoginPage } from "../components/auth/role-login-page";

export default function LoginPage() {
  return (
    <RoleLoginPage
      description="Ingresa con tu correo y contrasenia. Si tu rol es owner entraras al portal empresarial; cualquier otro perfil autenticado entrara al portal de desarrollador para revisar sus proyectos y tareas."
      title="Accede a ProfitTrack desde un solo login."
    />
  );
}
