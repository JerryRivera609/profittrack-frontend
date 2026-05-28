import type { Stage, StageFormValues, StageProject } from "../types/stage";

const emptyForm: StageFormValues = {
  descripcion: "",
  estado: "PLANIFICADO",
  fechaFinPlanificada: "",
  fechaFinReal: "",
  fechaInicioPlanificada: "",
  fechaInicioReal: "",
  horasPlanificadas: "0",
  nombre: "",
  orden: "1",
};

export function createStageFormValues(
  stage: Stage | null,
  project: StageProject | null,
  stages: Stage[],
): StageFormValues {
  if (!stage) {
    const remainingHours = Math.max(
      (project?.horasPlanificadas ?? 0) - sumStageHours(stages),
      0,
    );

    return {
      ...emptyForm,
      fechaFinPlanificada: normalizeDateInput(project?.fechaFinPlanificada),
      fechaInicioPlanificada: normalizeDateInput(project?.fechaInicioPlanificada),
      horasPlanificadas: formatDecimalValue(remainingHours),
      orden: `${stages.length + 1}`,
    };
  }

  return {
    descripcion: stage.descripcion ?? "",
    estado: stage.estado ?? "PLANIFICADO",
    fechaFinPlanificada: normalizeDateInput(stage.fechaFinPlanificada),
    fechaFinReal: normalizeDateInput(stage.fechaFinReal),
    fechaInicioPlanificada: normalizeDateInput(stage.fechaInicioPlanificada),
    fechaInicioReal: normalizeDateInput(stage.fechaInicioReal),
    horasPlanificadas: stage.horasPlanificadas.toString(),
    nombre: stage.nombre,
    orden: stage.orden.toString(),
  };
}

export function updateStageFormValue<Key extends keyof StageFormValues>(
  form: StageFormValues,
  key: Key,
  value: StageFormValues[Key],
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateStagePayload(
  form: StageFormValues,
  projectId: number,
) {
  return {
    descripcion: normalizeStageDescription(form),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    horasPlanificadas: parseDecimalInput(form.horasPlanificadas),
    nombre: form.nombre.trim(),
    orden: parseIntegerInput(form.orden),
    proyectoId: projectId,
  };
}

export function buildUpdateStagePayload(form: StageFormValues) {
  return {
    descripcion: normalizeStageDescription(form),
    estado: normalizeStageStatus(form.estado),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaFinReal: form.fechaFinReal || undefined,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    fechaInicioReal: form.fechaInicioReal || undefined,
    horasPlanificadas: parseDecimalInput(form.horasPlanificadas),
    nombre: form.nombre.trim(),
    orden: parseIntegerInput(form.orden),
  };
}

export function validateStageForm(form: StageFormValues, stage: Stage | null) {
  if (!form.nombre.trim()) {
    return "Completa el nombre de la etapa.";
  }

  if (!form.orden.trim() || parseIntegerInput(form.orden) <= 0) {
    return "Completa un orden valido para la etapa.";
  }

  if (!form.horasPlanificadas.trim()) {
    return "Completa las horas planificadas de la etapa.";
  }

  if (parseDecimalInput(form.horasPlanificadas) < 0) {
    return "Las horas planificadas no pueden ser negativas.";
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

  if (stage && !form.estado.trim()) {
    return "Completa el estado de la etapa.";
  }

  return "";
}

export function getStageStats(
  stages: Stage[],
  selectedProject: StageProject | null,
): Array<{ label: string; value: string }> {
  const plannedHours = selectedProject?.horasPlanificadas ?? 0;
  const stageHours = sumStageHours(stages);
  const realHours = stages.reduce((total, stage) => total + stage.horasReales, 0);

  return [
    {
      label: "Etapas activas",
      value: stages.length.toString(),
    },
    {
      label: "Horas etapas",
      value: `${formatDecimalValue(stageHours)} / ${formatDecimalValue(plannedHours)}`,
    },
    {
      label: "Horas reales",
      value: formatDecimalValue(realHours),
    },
  ];
}

export function sumStageHours(stages: Stage[]) {
  return stages.reduce((total, stage) => total + stage.horasPlanificadas, 0);
}

export function getProjectedStageHours(
  stages: Stage[],
  stage: Stage | null,
  form: StageFormValues,
) {
  const currentHours = stage?.horasPlanificadas ?? 0;

  return sumStageHours(stages) - currentHours + parseDecimalInput(form.horasPlanificadas);
}

export function isStageHoursBalanced(stages: Stage[], project: StageProject | null) {
  if (!project) {
    return true;
  }

  return Math.abs(sumStageHours(stages) - project.horasPlanificadas) <= 0.01;
}

export function formatDecimalValue(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function formatStageDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatStageStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

function normalizeDateInput(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

function normalizeStageDescription(form: StageFormValues) {
  return form.descripcion.trim() || form.nombre.trim() || "Etapa sin descripcion";
}

function normalizeStageStatus(value: string) {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "PLANIFICADO":
      return "PLANIFICADO";
    case "EN_PROCESO":
    case "EN PROCESO":
      return "EN_PROCESO";
    case "PAUSADO":
      return "PAUSADO";
    case "FINALIZADO":
    case "FINALIZADA":
      return "FINALIZADO";
    case "CANCELADO":
      return "CANCELADO";
    default:
      return normalized;
  }
}

function parseDecimalInput(value: string) {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function parseIntegerInput(value: string) {
  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}
