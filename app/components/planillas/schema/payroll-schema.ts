import type { PayrollFormValues, PayrollScope } from "../types/payroll";

export function validatePayrollForm(
  form: PayrollFormValues,
  scope: PayrollScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para la planilla.";
  }

  if (!form.anio.trim()) {
    return "Completa el anio.";
  }

  if (!form.mes.trim()) {
    return "Selecciona el mes.";
  }

  if (form.detalles.length === 0) {
    return "Agrega al menos un detalle a la planilla.";
  }

  for (const detail of form.detalles) {
    if (!detail.empleadoId.trim()) {
      return "Selecciona un empleado en cada detalle.";
    }

    if (!detail.sueldoBase.trim()) {
      return "Completa el sueldo base en cada detalle.";
    }
  }

  return "";
}

export function resolveEmpresaId(
  form: PayrollFormValues,
  scope: PayrollScope,
) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
