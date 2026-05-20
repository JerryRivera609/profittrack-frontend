import type { Task, TaskStats } from "../types/task";

export function formatTaskDate(value?: string | null) {
  return value?.slice(0, 10) ?? "-";
}

export function getTaskStats(tasks: Task[]): TaskStats[] {
  return [
    {
      label: "Tareas visibles",
      value: tasks.length.toString(),
    },
    {
      label: "Activas",
      value: tasks.filter((task) => task.activo).length.toString(),
    },
    {
      label: "En curso",
      value: tasks.filter((task) => task.estado?.toLowerCase().includes("curso")).length.toString(),
    },
  ];
}
