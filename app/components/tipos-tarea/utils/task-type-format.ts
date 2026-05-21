import type {
  TaskType,
  TaskTypeScope,
  TaskTypeStats,
} from "../types/task-type";

export function getVisibleTaskTypes(
  taskTypes: TaskType[],
  scope: TaskTypeScope,
) {
  const scopedTaskTypes =
    scope.isAdmin || !scope.sessionEmpresaId
      ? taskTypes
      : taskTypes.filter(
          (taskType) => taskType.empresaId === scope.sessionEmpresaId,
        );

  return [...scopedTaskTypes].sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  );
}

export function getTaskTypeStats(taskTypes: TaskType[]): TaskTypeStats[] {
  return [
    {
      label: "Tipos visibles",
      value: taskTypes.length.toString(),
    },
    {
      label: "Activos",
      value: taskTypes.filter((taskType) => taskType.activo).length.toString(),
    },
    {
      label: "Empresas",
      value: new Set(taskTypes.map((taskType) => taskType.empresaId)).size.toString(),
    },
  ];
}
