import type { Role, RoleScope, RoleStats } from "../types/role";

export function getVisibleRoles(roles: Role[], scope: RoleScope) {
  const scopedRoles =
    scope.isAdmin || !scope.sessionEmpresaId
      ? roles
      : roles.filter((role) => role.empresaId === scope.sessionEmpresaId);

  return [...scopedRoles].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function getRoleStats(activeRoles: Role[], inactiveRoles: Role[]): RoleStats[] {
  const roles = [...activeRoles, ...inactiveRoles];

  return [
    {
      label: "Roles activos",
      value: activeRoles.length.toString(),
    },
    {
      label: "Roles inactivos",
      value: inactiveRoles.length.toString(),
    },
    {
      label: "Empresas",
      value: new Set(roles.map((role) => role.empresaId)).size.toString(),
    },
  ];
}
