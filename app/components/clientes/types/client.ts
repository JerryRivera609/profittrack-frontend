import type { Session } from "../../../types/domain";

export type Client = {
  id: number;
  empresaId: number;
  razonSocial: string;
  ruc: string;
  nombreContacto: string;
  correoContacto: string;
  telefonoContacto: string;
  direccion: string;
  activo: boolean;
};

export type CreateClientPayload = {
  empresaId: number;
  razonSocial: string;
  ruc: string;
  nombreContacto: string;
  correoContacto: string;
  telefonoContacto: string;
  direccion: string;
};

export type UpdateClientPayload = {
  razonSocial: string;
  ruc: string;
  nombreContacto: string;
  correoContacto: string;
  telefonoContacto: string;
  direccion: string;
};

export type ClientFormValues = {
  correoContacto: string;
  direccion: string;
  empresaId: string;
  nombreContacto: string;
  razonSocial: string;
  ruc: string;
  telefonoContacto: string;
};

export type ClientModalMode = "create" | "edit";

export type ClientModalState = {
  client: Client | null;
  mode: ClientModalMode;
  open: boolean;
};

export type ClientStats = {
  label: string;
  value: string;
};

export type ClientScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
