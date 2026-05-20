import type { Session } from "../../../types/domain";

export type PayrollDetail = {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  sueldoBase: number;
  bonos: number;
  descuentos: number;
  sueldoFinal: number;
};

export type Payroll = {
  id: number;
  empresaId: number;
  anio: number;
  mes: number;
  montoTotal: number;
  activo: boolean;
  detalles: PayrollDetail[];
};

export type CreatePayrollDetailPayload = {
  empleadoId: number;
  sueldoBase: number;
  bonos: number;
  descuentos: number;
};

export type CreatePayrollPayload = {
  empresaId: number;
  anio: number;
  mes: number;
  detalles: CreatePayrollDetailPayload[];
};

export type PayrollDetailFormValues = {
  bonos: string;
  descuentos: string;
  empleadoId: string;
  sueldoBase: string;
};

export type PayrollFormValues = {
  anio: string;
  detalles: PayrollDetailFormValues[];
  empresaId: string;
  mes: string;
};

export type PayrollModalState = {
  open: boolean;
};

export type PayrollStats = {
  label: string;
  value: string;
};

export type PayrollCatalogOption = {
  description?: string;
  label: string;
  value: string;
};

export type PayrollScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
