import type {
  TaskType,
  TaskTypeFormValues,
  TaskTypeScope,
} from "../types/task-type";

export function validateTaskTypeForm(
  form: TaskTypeFormValues,
  _taskType: TaskType | null,
  scope: TaskTypeScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el tipo de tarea.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre del tipo de tarea.";
  }

  if (!form.descripcion.trim()) {
    return "Completa la descripcion.";
  }

  return "";
}

export function resolveEmpresaId(
  form: TaskTypeFormValues,
  scope: TaskTypeScope,
) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
