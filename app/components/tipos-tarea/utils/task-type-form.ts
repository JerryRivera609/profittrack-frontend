import type { Session } from "../../../types/domain";
import { resolveEmpresaId } from "../schema/task-type-schema";
import type {
  CreateTaskTypePayload,
  TaskType,
  TaskTypeFormValues,
  TaskTypeScope,
  UpdateTaskTypePayload,
} from "../types/task-type";

const emptyForm: TaskTypeFormValues = {
  descripcion: "",
  empresaId: "",
  nombre: "",
};

export function createTaskTypeScope(session: Session): TaskTypeScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createTaskTypeFormValues(
  taskType: TaskType | null,
  session: Session,
): TaskTypeFormValues {
  if (!taskType) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
    };
  }

  return {
    descripcion: taskType.descripcion,
    empresaId: taskType.empresaId.toString(),
    nombre: taskType.nombre,
  };
}

export function updateTaskTypeFormValue(
  form: TaskTypeFormValues,
  key: keyof TaskTypeFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateTaskTypePayload(
  form: TaskTypeFormValues,
  scope: TaskTypeScope,
): CreateTaskTypePayload {
  return {
    descripcion: form.descripcion.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    nombre: form.nombre.trim(),
  };
}

export function buildUpdateTaskTypePayload(
  form: TaskTypeFormValues,
): UpdateTaskTypePayload {
  return {
    descripcion: form.descripcion.trim(),
    nombre: form.nombre.trim(),
  };
}
