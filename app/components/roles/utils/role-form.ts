import type { Session } from "../../../types/domain";
import { resolveEmpresaId } from "../schema/role-schema";
import type {
  CreateRolePayload,
  Role,
  RoleFormValues,
  RoleScope,
  UpdateRolePayload,
} from "../types/role";

const emptyForm: RoleFormValues = {
  descripcion: "",
  empresaId: "",
  nombre: "",
};

export function createRoleScope(session: Session): RoleScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createRoleFormValues(
  role: Role | null,
  session: Session,
): RoleFormValues {
  if (!role) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
    };
  }

  return {
    descripcion: role.descripcion,
    empresaId: role.empresaId.toString(),
    nombre: role.nombre,
  };
}

export function updateRoleFormValue(
  form: RoleFormValues,
  key: keyof RoleFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateRolePayload(
  form: RoleFormValues,
  scope: RoleScope,
): CreateRolePayload {
  return {
    descripcion: form.descripcion.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    nombre: form.nombre.trim(),
  };
}

export function buildUpdateRolePayload(form: RoleFormValues): UpdateRolePayload {
  return {
    descripcion: form.descripcion.trim(),
    nombre: form.nombre.trim(),
  };
}
