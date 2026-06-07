import type { Session } from "../../../types/domain";
import type { Project, ProjectPermission } from "../types/project";

const leaderProjectPermissions: ProjectPermission[] = [
  "APROBAR_HORAS",
  "GENERAR_SNAPSHOT",
  "GESTIONAR_ETAPAS",
  "GESTIONAR_TAREAS",
  "VER_METRICAS",
  "VER_PROYECTO",
];

export function hasGlobalProjectAccess(session: Session) {
  return session.role === "ADMIN" || session.role === "OWNER" || session.role === "LIDER";
}

export function hasProjectPermission(
  session: Session,
  project: Project | null | undefined,
  permission: ProjectPermission,
) {
  if (hasGlobalProjectAccess(session)) {
    return true;
  }

  if (!project) {
    return false;
  }

  if (project.misPermisos) {
    return project.misPermisos.includes(permission);
  }

  return Boolean(
    project.soyLiderDelProyecto && leaderProjectPermissions.includes(permission),
  );
}

export function canManageProjectStages(
  session: Session,
  project: Project | null | undefined,
) {
  return hasProjectPermission(session, project, "GESTIONAR_ETAPAS");
}

export function canManageProjectTasks(
  session: Session,
  project: Project | null | undefined,
) {
  return hasProjectPermission(session, project, "GESTIONAR_TAREAS");
}

export function canApproveProjectHours(
  session: Session,
  project: Project | null | undefined,
) {
  return hasProjectPermission(session, project, "APROBAR_HORAS");
}
