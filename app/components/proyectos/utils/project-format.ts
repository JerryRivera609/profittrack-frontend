import type { Project, ProjectScope, ProjectStats } from "../types/project";

export function formatProjectDate(value?: string | null) {
  return value?.slice(0, 10) ?? "-";
}

export function getVisibleProjects(projects: Project[], scope: ProjectScope) {
  const scopedProjects =
    scope.isAdmin || !scope.sessionEmpresaId
      ? projects
      : projects.filter((project) => project.empresaId === scope.sessionEmpresaId);

  return [...scopedProjects].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function getProjectStats(projects: Project[]): ProjectStats[] {
  return [
    {
      label: "Proyectos visibles",
      value: projects.length.toString(),
    },
    {
      label: "Activos",
      value: projects.filter((project) => project.activo).length.toString(),
    },
    {
      label: "En curso",
      value: projects.filter((project) =>
        project.estado?.toLowerCase().includes("curso"),
      ).length.toString(),
    },
  ];
}
