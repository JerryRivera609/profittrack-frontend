import type { Session } from "../../../types/domain";

export type Employee = {
  id: number;
  empresaId: number;
  nombreEmpresa: string;
  rolId: number;
  nombreRol: string;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  fechaIngreso?: string | null;
  fechaSalida?: string | null;
  activo: boolean;
};

export type CreateEmployeePayload = {
  empresaId: number;
  rolId: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  contrasenia: string;
  fechaIngreso: string;
};

export type UpdateEmployeePayload = {
  rolId: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  contrasenia?: string;
  fechaIngreso: string;
  fechaSalida?: string;
};

export type EmployeeFormValues = {
  apellidos: string;
  contrasenia: string;
  correo: string;
  empresaId: string;
  fechaIngreso: string;
  fechaSalida: string;
  nombres: string;
  numeroDocumento: string;
  rolId: string;
  telefono: string;
};

export type EmployeeModalMode = "create" | "edit";

export type EmployeeModalState = {
  employee: Employee | null;
  mode: EmployeeModalMode;
  open: boolean;
};

export type EmployeeStats = {
  label: string;
  value: string;
};

export type EmployeeScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
