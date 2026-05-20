import { RoleLoginPage } from "../../components/auth/role-login-page";

export default function EmployeeLoginPage() {
  return (
    <RoleLoginPage
      defaultEmail="empleado@empresa.com"
      description="Portal para empleados: tareas asignadas, registro de horas hombre y seguimiento personal."
      role="EMPLEADO"
      title="Registra tus horas y avanza tus tareas."
    />
  );
}
