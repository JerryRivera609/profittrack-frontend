import type {
  ServiceType,
  ServiceTypeFormValues,
  ServiceTypeScope,
} from "../types/service-type";

export function validateServiceTypeForm(
  form: ServiceTypeFormValues,
  _serviceType: ServiceType | null,
  scope: ServiceTypeScope,
) {
  if (!resolveEmpresaId(form, scope)) {
    return "Ingresa una empresa valida para el tipo de servicio.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre del tipo de servicio.";
  }

  if (!form.descripcion.trim()) {
    return "Completa la descripcion.";
  }

  return "";
}

export function resolveEmpresaId(
  form: ServiceTypeFormValues,
  scope: ServiceTypeScope,
) {
  return scope.isAdmin
    ? form.empresaId.trim()
    : scope.sessionEmpresaId?.toString() ?? "";
}
