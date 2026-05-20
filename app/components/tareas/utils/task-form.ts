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
  tipoTareaId: "",
  empleadoAsignadoId: "",
  nombre: "",
  descripcion: "",
  horasPlanificadas: "",
  fechaInicioPlanificada: "",
  fechaFinPlanificada: "",
  fechaInicioReal: "",
  fechaFinReal: "",
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
    tipoTareaId: task.tipoTareaId.toString(),
    empleadoAsignadoId: task.empleadoAsignadoId.toString(),
    nombre: task.nombre,
    descripcion: task.descripcion,
    horasPlanificadas: task.horasPlanificadas.toString(),
    fechaInicioPlanificada: normalizeDate(task.fechaInicioPlanificada),
    fechaFinPlanificada: normalizeDate(task.fechaFinPlanificada),
    fechaInicioReal: normalizeDate(task.fechaInicioReal),
    fechaFinReal: normalizeDate(task.fechaFinReal),
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
    fechaInicioReal: form.fechaInicioReal || undefined,
    fechaFinReal: form.fechaFinReal || undefined,
    estado: form.estado.trim(),
  };
}

function normalizeDate(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}
