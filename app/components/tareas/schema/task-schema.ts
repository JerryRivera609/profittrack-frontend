import type { Task, TaskFormValues } from "../types/task";

export function validateTaskForm(
  form: TaskFormValues,
  task: Task | null,
) {
  if (!form.proyectoId.trim()) {
    return "Selecciona un proyecto.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre de la tarea.";
  }

  if (!form.descripcion.trim()) {
    return "Completa la descripcion.";
  }

  if (!form.horasPlanificadas.trim()) {
    return "Completa las horas planificadas.";
  }

  if (task && !form.estado.trim()) {
    return "Completa el estado.";
  }

  return "";
}
