import type { Session } from "../../../types/domain";
import type {
  Client,
  ClientFormValues,
  ClientScope,
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client";
import { resolveEmpresaId } from "../schema/client-schema";

const emptyForm: ClientFormValues = {
  correoContacto: "",
  direccion: "",
  empresaId: "",
  nombreContacto: "",
  razonSocial: "",
  ruc: "",
  telefonoContacto: "",
};

export function createClientScope(session: Session): ClientScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createClientFormValues(
  client: Client | null,
  session: Session,
): ClientFormValues {
  if (!client) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
    };
  }

  return {
    correoContacto: client.correoContacto,
    direccion: client.direccion,
    empresaId: client.empresaId.toString(),
    nombreContacto: client.nombreContacto,
    razonSocial: client.razonSocial,
    ruc: client.ruc,
    telefonoContacto: client.telefonoContacto,
  };
}

export function updateClientFormValue(
  form: ClientFormValues,
  key: keyof ClientFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateClientPayload(
  form: ClientFormValues,
  scope: ClientScope,
): CreateClientPayload {
  return {
    correoContacto: form.correoContacto.trim(),
    direccion: form.direccion.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    nombreContacto: form.nombreContacto.trim(),
    razonSocial: form.razonSocial.trim(),
    ruc: form.ruc.trim(),
    telefonoContacto: form.telefonoContacto.trim(),
  };
}

export function buildUpdateClientPayload(
  form: ClientFormValues,
): UpdateClientPayload {
  return {
    correoContacto: form.correoContacto.trim(),
    direccion: form.direccion.trim(),
    nombreContacto: form.nombreContacto.trim(),
    razonSocial: form.razonSocial.trim(),
    ruc: form.ruc.trim(),
    telefonoContacto: form.telefonoContacto.trim(),
  };
}
