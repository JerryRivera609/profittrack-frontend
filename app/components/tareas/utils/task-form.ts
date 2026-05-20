import type { Session } from "../../../types/domain";
import type {
  CreateTaskPayload,
  Task,
  TaskFormValues,
  TaskLifecycleAction,
  TaskScope,
  UpdateTaskPayload,
} from "../types/task";

const emptyForm: TaskFormValues = {
  proyectoId: "",
  tipoTareaId: "",
  empleadoAsignadoId: "",
  nombre: "",
  descripcion: "",
  horasPlanificadas: "",
  fechaInicioPlanificada: "",
  fechaFinPlanificada: "",
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
    tipoTareaId: normalizeId(task.tipoTareaId),
    empleadoAsignadoId: normalizeId(task.empleadoAsignadoId),
    nombre: task.nombre,
    descripcion: task.descripcion,
    horasPlanificadas: task.horasPlanificadas.toString(),
    fechaInicioPlanificada: normalizeDate(task.fechaInicioPlanificada),
    fechaFinPlanificada: normalizeDate(task.fechaFinPlanificada),
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
  return {
    proyectoId: Number.parseInt(form.proyectoId, 10),
    tipoTareaId: Number.parseInt(form.tipoTareaId, 10),
    empleadoAsignadoId: Number.parseInt(form.empleadoAsignadoId, 10),
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    fechaFinPlanificada: form.fechaFinPlanificada,
  };
}

export function buildUpdateTaskPayload(form: TaskFormValues): UpdateTaskPayload {
  return {
    tipoTareaId: Number.parseInt(form.tipoTareaId, 10),
    empleadoAsignadoId: Number.parseInt(form.empleadoAsignadoId, 10),
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    fechaFinPlanificada: form.fechaFinPlanificada,
    estado: form.estado.trim(),
  };
}

export function buildTaskLifecyclePayload(
  task: Task,
  action: TaskLifecycleAction,
): UpdateTaskPayload {
  const today = new Date().toISOString().slice(0, 10);

  return {
    tipoTareaId: task.tipoTareaId ?? 0,
    empleadoAsignadoId: task.empleadoAsignadoId ?? 0,
    nombre: task.nombre,
    descripcion: task.descripcion,
    horasPlanificadas: task.horasPlanificadas,
    fechaInicioPlanificada: normalizeDate(task.fechaInicioPlanificada),
    fechaFinPlanificada: normalizeDate(task.fechaFinPlanificada),
    fechaInicioReal:
      action === "start" ? today : normalizeDate(task.fechaInicioReal) || undefined,
    fechaFinReal:
      action === "finish" ? today : normalizeDate(task.fechaFinReal) || undefined,
    estado: action === "start" ? "En curso" : "Finalizada",
  };
}

function normalizeDate(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

function normalizeId(value?: number | null) {
  return typeof value === "number" ? value.toString() : "";
}
