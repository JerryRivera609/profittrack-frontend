import type { Session } from "../../../types/domain";

export type Role = {
  id: number;
  empresaId: number;
  nombreEmpresa: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type CreateRolePayload = {
  empresaId: number;
  nombre: string;
  descripcion: string;
};

export type UpdateRolePayload = {
  nombre: string;
  descripcion: string;
};

export type RoleFormValues = {
  descripcion: string;
  empresaId: string;
  nombre: string;
};

export type RoleModalMode = "create" | "edit";

export type RoleModalState = {
  open: boolean;
  mode: RoleModalMode;
  role: Role | null;
};

export type RoleStatusView = "active" | "inactive";

export type RoleStats = {
  label: string;
  value: string;
};

export type RoleScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
