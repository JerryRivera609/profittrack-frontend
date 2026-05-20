export type UserRole = "ADMIN" | "OWNER" | "LIDER" | "EMPLEADO";

export type Session = {
  role: UserRole;
  backendRole?: string;
  email: string;
  displayName: string;
  accessToken: string;
  apiToken?: string;
  companyName?: string;
  empresaId?: number;
  expiresAt: number;
  refreshToken: string;
  sessionDurationMs: number;
};

export type Empresa = {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  activo: boolean;
};

export type EmpresaPayload = {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
};

export type Duenio = {
  id: number;
  empresaId: number;
  nombres: string;
  apellidos: string;
  correo: string;
  activo?: boolean;
};

export type DuenioPayload = {
  empresaId: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasenia: string;
};

export type DuenioUpdatePayload = Omit<DuenioPayload, "contrasenia"> & {
  contrasenia?: string;
};
