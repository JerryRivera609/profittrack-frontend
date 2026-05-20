import type { Project, ProjectFormValues, ProjectScope } from "../types/project";

export function validateProjectForm(
  form: ProjectFormValues,
  project: Project | null,
  scope: ProjectScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el proyecto.";
  }

  if (!form.clienteId.trim()) {
    return "Completa el clienteId.";
  }

  if (!form.tipoServicioId.trim()) {
    return "Completa el tipoServicioId.";
  }

  if (!form.liderEmpleadoId.trim()) {
    return "Completa el liderEmpleadoId.";
  }

  if (!form.codigo.trim()) {
    return "Completa el codigo del proyecto.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre del proyecto.";
  }

  if (!form.descripcion.trim()) {
    return "Completa la descripcion.";
  }

  if (!form.fechaInicioPlanificada) {
    return "Selecciona la fecha de inicio planificada.";
  }

  if (!form.fechaFinPlanificada) {
    return "Selecciona la fecha de fin planificada.";
  }

  if (!form.horasPlanificadas.trim()) {
    return "Completa las horas planificadas.";
  }

  if (!form.presupuestoPlanificado.trim()) {
    return "Completa el presupuesto planificado.";
  }

  if (!form.margenPlanificado.trim()) {
    return "Completa el margen planificado.";
  }

  if (!form.precioVenta.trim()) {
    return "Completa el precio de venta.";
  }

  if (project && !form.estado.trim()) {
    return "Completa el estado del proyecto.";
  }

  return "";
}

export function resolveEmpresaId(form: ProjectFormValues, scope: ProjectScope) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
