import type { Session } from "../../../types/domain";
import type {
  CreateTaskPayload,
  Task,
  TaskFormValues,
  TaskScope,
  UpdateTaskPayload,
} from "../types/task";

const emptyForm: TaskFormValues = {
  proyectoId: "",
  etapaProyectoId: "",
  tipoTareaId: "",
  nombre: "",
  descripcion: "",
  horasPlanificadas: "",
  estado: "",
};

export function createTaskScope(session: Session): TaskScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createTaskFormValues(
  task: Task | null,
  selectedProjectId: string,
): TaskFormValues {
  if (!task) {
    return {
      ...emptyForm,
      proyectoId: selectedProjectId,
    };
  }

  return {
    proyectoId: task.proyectoId.toString(),
    etapaProyectoId: normalizeId(task.etapaProyectoId),
    tipoTareaId: normalizeId(task.tipoTareaId),
    nombre: task.nombre,
    descripcion: task.descripcion,
    horasPlanificadas: task.horasPlanificadas.toString(),
    estado: task.estado ?? "",
  };
}

export function updateTaskFormValue(
  form: TaskFormValues,
  key: keyof TaskFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateTaskPayload(form: TaskFormValues): CreateTaskPayload {
  const etapaProyectoId = parseOptionalId(form.etapaProyectoId);
  const tipoTareaId = parseOptionalId(form.tipoTareaId);

  return {
    ...(etapaProyectoId ? { etapaProyectoId } : {}),
    ...(tipoTareaId ? { tipoTareaId } : {}),
    proyectoId: Number.parseInt(form.proyectoId, 10),
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
  };
}

export function buildUpdateTaskPayload(form: TaskFormValues): UpdateTaskPayload {
  const etapaProyectoId = parseOptionalId(form.etapaProyectoId);
  const tipoTareaId = parseOptionalId(form.tipoTareaId);

  return {
    ...(etapaProyectoId ? { etapaProyectoId } : {}),
    ...(tipoTareaId ? { tipoTareaId } : {}),
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
    estado: normalizeTaskStatus(form.estado),
  };
}

function normalizeId(value?: number | null) {
  return typeof value === "number" ? value.toString() : "";
}

function parseOptionalId(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}

function normalizeTaskStatus(value: string) {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "PENDIENTE":
      return "PENDIENTE";
    case "EN_CURSO":
    case "EN CURSO":
      return "EN_CURSO";
    case "FINALIZADO":
    case "FINALIZADA":
    case "FINALIZADO/A":
      return "FINALIZADO";
    default:
      return normalized;
  }
}
