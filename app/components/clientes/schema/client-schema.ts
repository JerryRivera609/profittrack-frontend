import type { Client, ClientFormValues, ClientScope } from "../types/client";

export function validateClientForm(
  form: ClientFormValues,
  _client: Client | null,
  scope: ClientScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el cliente.";
  }

  if (!form.razonSocial.trim()) {
    return "Completa la razon social.";
  }

  if (!form.ruc.trim()) {
    return "Completa el RUC.";
  }

  if (!form.nombreContacto.trim()) {
    return "Completa el nombre de contacto.";
  }

  if (!form.correoContacto.trim()) {
    return "Completa el correo de contacto.";
  }

  if (!form.telefonoContacto.trim()) {
    return "Completa el telefono de contacto.";
  }

  if (!form.direccion.trim()) {
    return "Completa la direccion.";
  }

  return "";
}

export function resolveEmpresaId(form: ClientFormValues, scope: ClientScope) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
