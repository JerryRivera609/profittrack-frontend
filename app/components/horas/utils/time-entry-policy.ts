import type { PendingTaskWorkItem } from "../types/time-entry";

export function doesTaskBelongToEmployee(
  task: Pick<PendingTaskWorkItem, "empleadoAsignadoId">,
  empleadoId?: number,
) {
  if (typeof empleadoId !== "number") {
    return true;
  }

  return task.empleadoAsignadoId === empleadoId;
}

export function filterTasksForEmployee<T extends Pick<PendingTaskWorkItem, "empleadoAsignadoId">>(
  tasks: T[],
  empleadoId?: number,
) {
  return tasks.filter((task) => doesTaskBelongToEmployee(task, empleadoId));
}
