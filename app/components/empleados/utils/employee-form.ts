import type { Session } from "../../../types/domain";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeFormValues,
  EmployeeScope,
  UpdateEmployeePayload,
} from "../types/employee";
import { resolveEmpresaId } from "../schema/employee-schema";

const emptyForm: EmployeeFormValues = {
  apellidos: "",
  contrasenia: "",
  correo: "",
  empresaId: "",
  fechaIngreso: "",
  fechaSalida: "",
  nombres: "",
  numeroDocumento: "",
  rolId: "",
  telefono: "",
};

export function createEmployeeScope(session: Session): EmployeeScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createEmployeeFormValues(
  employee: Employee | null,
  session: Session,
): EmployeeFormValues {
  if (!employee) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
      fechaIngreso: new Date().toISOString().slice(0, 10),
    };
  }

  return {
    apellidos: employee.apellidos,
    contrasenia: "",
    correo: employee.correo,
    empresaId: employee.empresaId.toString(),
    fechaIngreso: employee.fechaIngreso.slice(0, 10),
    fechaSalida: employee.fechaSalida?.slice(0, 10) ?? "",
    nombres: employee.nombres,
    numeroDocumento: employee.numeroDocumento,
    rolId: employee.rolId.toString(),
    telefono: employee.telefono,
  };
}

export function updateEmployeeFormValue(
  form: EmployeeFormValues,
  key: keyof EmployeeFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateEmployeePayload(
  form: EmployeeFormValues,
  scope: EmployeeScope,
): CreateEmployeePayload {
  return {
    apellidos: form.apellidos.trim(),
    contrasenia: form.contrasenia.trim(),
    correo: form.correo.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    fechaIngreso: form.fechaIngreso,
    nombres: form.nombres.trim(),
    numeroDocumento: form.numeroDocumento.trim(),
    rolId: Number.parseInt(form.rolId, 10),
    telefono: form.telefono.trim(),
  };
}

export function buildUpdateEmployeePayload(
  form: EmployeeFormValues,
): UpdateEmployeePayload {
  const payload: UpdateEmployeePayload = {
    apellidos: form.apellidos.trim(),
    correo: form.correo.trim(),
    fechaIngreso: form.fechaIngreso,
    nombres: form.nombres.trim(),
    numeroDocumento: form.numeroDocumento.trim(),
    rolId: Number.parseInt(form.rolId, 10),
    telefono: form.telefono.trim(),
  };

  if (form.contrasenia.trim()) {
    payload.contrasenia = form.contrasenia.trim();
  }

  if (form.fechaSalida) {
    payload.fechaSalida = form.fechaSalida;
  }

  return payload;
}
