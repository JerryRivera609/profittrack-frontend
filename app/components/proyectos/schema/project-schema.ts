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

  if (!form.fechaInicioPlanificada) {
    return "Selecciona la fecha de inicio planificada.";
  }

  if (!form.fechaFinPlanificada) {
    return "Selecciona la fecha de fin planificada.";
  }

  if (form.fechaInicioPlanificada > form.fechaFinPlanificada) {
    return "La fecha de inicio no puede ser posterior al fin planificado.";
  }

  if (!form.horasPlanificadas.trim()) {
    return "Completa las horas planificadas.";
  }

  const plannedHours = parseDecimalInput(form.horasPlanificadas);

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

  const stageHours = form.etapas.reduce(
    (total, stage) => total + parseDecimalInput(stage.horasPlanificadas),
    0,
  );

  if (form.etapas.length > 0 && !areHoursEqual(plannedHours, stageHours)) {
    return `Las horas planificadas del proyecto deben coincidir con la suma de horas de sus etapas. Proyecto: ${formatHours(plannedHours)} h, etapas: ${formatHours(stageHours)} h.`;
  }

  for (const [index, stage] of form.etapas.entries()) {
    const stageNumber = index + 1;

    if (!stage.nombre.trim()) {
      return `Completa el nombre de la etapa ${stageNumber}.`;
    }

    if (stage.fechaInicioPlanificada && stage.fechaFinPlanificada) {
      if (stage.fechaInicioPlanificada > stage.fechaFinPlanificada) {
        return `La etapa ${stageNumber} tiene una fecha de inicio posterior a su fecha de fin.`;
      }
    }
  }

  return "";
}

export function resolveEmpresaId(form: ProjectFormValues, scope: ProjectScope) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}

function parseDecimalInput(value: string) {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function areHoursEqual(left: number, right: number) {
  return Math.abs(left - right) <= 0.01;
}

function formatHours(value: number) {
  return value.toFixed(2);
}
