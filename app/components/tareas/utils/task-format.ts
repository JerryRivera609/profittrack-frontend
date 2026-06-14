import type { Task, TaskStats } from "../types/task";

export function isTaskApproved(task: Task) {
  const approvalStatus = task.estadoAprobacion?.toString().trim().toUpperCase();

  return approvalStatus === "APROBADO" || task.horasReales > 0;
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
      label: "Pendientes revision",
      value: tasks
        .filter((task) => task.estadoAprobacion === "PENDIENTE")
        .length.toString(),
    },
  ];
}

export function formatTaskStatus(value?: string | null) {
  switch (value) {
    case "PENDIENTE":
      return "Pendiente";
    case "EN_CURSO":
      return "En curso";
    case "FINALIZADO":
      return "Finalizado";
    default:
      return value || "-";
  }
}
