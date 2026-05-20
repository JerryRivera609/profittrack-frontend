import type { Employee, EmployeeFormValues, EmployeeScope } from "../types/employee";

export const employeeFormFieldOrder: Array<keyof EmployeeFormValues> = [
  "empresaId",
  "rolId",
  "nombres",
  "apellidos",
  "numeroDocumento",
  "correo",
  "telefono",
  "contrasenia",
  "fechaIngreso",
  "fechaSalida",
];

export function validateEmployeeForm(
  form: EmployeeFormValues,
  employee: Employee | null,
  scope: EmployeeScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el empleado.";
  }

  if (!form.rolId.trim()) {
    return "Ingresa el rolId del empleado.";
  }

  if (!form.nombres.trim() || !form.apellidos.trim()) {
    return "Completa nombres y apellidos.";
  }

  if (!form.numeroDocumento.trim()) {
    return "Completa el numero de documento.";
  }

  if (!form.correo.trim()) {
    return "Completa el correo.";
  }

  if (!form.telefono.trim()) {
    return "Completa el telefono.";
  }

  if (!employee && !form.contrasenia.trim()) {
    return "Ingresa una contrasenia para crear el empleado.";
  }

  if (!form.fechaIngreso) {
    return "Selecciona la fecha de ingreso.";
  }

  return "";
}

export function resolveEmpresaId(
  form: EmployeeFormValues,
  scope: EmployeeScope,
) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
