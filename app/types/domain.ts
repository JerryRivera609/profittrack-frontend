export type UserRole = "ADMIN" | "OWNER" | "LIDER" | "EMPLEADO";

export type Session = {
  role: UserRole;
  email: string;
  displayName: string;
  accessToken: string;
  apiToken?: string;
  companyName?: string;
  expiresAt: number;
  refreshToken: string;
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
