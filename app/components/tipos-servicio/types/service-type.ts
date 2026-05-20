import type { Session } from "../../../types/domain";

export type ServiceType = {
  id: number;
  empresaId: number;
  nombreEmpresa: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type CreateServiceTypePayload = {
  empresaId: number;
  nombre: string;
  descripcion: string;
};

export type UpdateServiceTypePayload = {
  nombre: string;
  descripcion: string;
};

export type ServiceTypeFormValues = {
  descripcion: string;
  empresaId: string;
  nombre: string;
};

export type ServiceTypeModalMode = "create" | "edit";

export type ServiceTypeModalState = {
  open: boolean;
  mode: ServiceTypeModalMode;
  serviceType: ServiceType | null;
};

export type ServiceTypeStats = {
  label: string;
  value: string;
};

export type ServiceTypeScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
