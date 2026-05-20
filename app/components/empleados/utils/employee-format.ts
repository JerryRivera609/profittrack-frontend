import type { Employee, EmployeeScope, EmployeeStats } from "../types/employee";

export function getEmployeeFullName(employee: Pick<Employee, "nombres" | "apellidos">) {
  return `${employee.nombres} ${employee.apellidos}`.trim();
}

export function formatEmployeeDate(value?: string | null) {
  return value?.slice(0, 10) || "-";
}

export function getVisibleEmployees(
  employees: Employee[],
  scope: EmployeeScope,
) {
  const scopedEmployees =
    scope.isAdmin || !scope.sessionEmpresaId
      ? employees
      : employees.filter((employee) => employee.empresaId === scope.sessionEmpresaId);

  return [...scopedEmployees].sort((a, b) =>
    getEmployeeFullName(a).localeCompare(getEmployeeFullName(b)),
  );
}

export function getEmployeeStats(employees: Employee[]): EmployeeStats[] {
  return [
    {
      label: "Empleados visibles",
      value: employees.length.toString(),
    },
    {
      label: "Activos",
      value: employees.filter((employee) => employee.activo).length.toString(),
    },
    {
      label: "Roles distintos",
      value: new Set(employees.map((employee) => employee.nombreRol)).size.toString(),
    },
  ];
}
