import type { Session } from "../../../types/domain";
import type {
  CreateServiceTypePayload,
  ServiceType,
  ServiceTypeFormValues,
  ServiceTypeScope,
  UpdateServiceTypePayload,
} from "../types/service-type";
import { resolveEmpresaId } from "../schema/service-type-schema";

const emptyForm: ServiceTypeFormValues = {
  descripcion: "",
  empresaId: "",
  nombre: "",
};

export function createServiceTypeScope(session: Session): ServiceTypeScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createServiceTypeFormValues(
  serviceType: ServiceType | null,
  session: Session,
): ServiceTypeFormValues {
  if (!serviceType) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
    };
  }

  return {
    descripcion: serviceType.descripcion,
    empresaId: serviceType.empresaId.toString(),
    nombre: serviceType.nombre,
  };
}

export function updateServiceTypeFormValue(
  form: ServiceTypeFormValues,
  key: keyof ServiceTypeFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateServiceTypePayload(
  form: ServiceTypeFormValues,
  scope: ServiceTypeScope,
): CreateServiceTypePayload {
  return {
    descripcion: form.descripcion.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    nombre: form.nombre.trim(),
  };
}

export function buildUpdateServiceTypePayload(
  form: ServiceTypeFormValues,
): UpdateServiceTypePayload {
  return {
    descripcion: form.descripcion.trim(),
    nombre: form.nombre.trim(),
  };
}
