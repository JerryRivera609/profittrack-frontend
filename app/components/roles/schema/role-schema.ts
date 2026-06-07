import type { Role, RoleFormValues, RoleScope } from "../types/role";

export function validateRoleForm(
  form: RoleFormValues,
  _role: Role | null,
  scope: RoleScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el rol.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre del rol.";
  }

  if (!form.descripcion.trim()) {
    return "Completa la descripcion.";
  }

  return "";
}

export function resolveEmpresaId(form: RoleFormValues, scope: RoleScope) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
