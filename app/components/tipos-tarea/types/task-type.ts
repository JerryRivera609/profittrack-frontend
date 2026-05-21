import type { Session } from "../../../types/domain";

export type TaskType = {
  id: number;
  empresaId: number;
  nombreEmpresa: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type CreateTaskTypePayload = {
  empresaId: number;
  nombre: string;
  descripcion: string;
};

export type UpdateTaskTypePayload = {
  nombre: string;
  descripcion: string;
};

export type TaskTypeFormValues = {
  descripcion: string;
  empresaId: string;
  nombre: string;
};

export type TaskTypeModalMode = "create" | "edit";

export type TaskTypeModalState = {
  open: boolean;
  mode: TaskTypeModalMode;
  taskType: TaskType | null;
};

export type TaskTypeStats = {
  label: string;
  value: string;
};

export type TaskTypeScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
