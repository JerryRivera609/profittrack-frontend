import type { Session } from "../../../types/domain";
import type {
  CreateProjectPayload,
  Project,
  ProjectFormValues,
  ProjectScope,
  UpdateProjectPayload,
} from "../types/project";
import { resolveEmpresaId } from "../schema/project-schema";

const emptyForm: ProjectFormValues = {
  clienteId: "",
  codigo: "",
  descripcion: "",
  empresaId: "",
  estado: "",
  fechaFinPlanificada: "",
  fechaFinReal: "",
  fechaInicioPlanificada: "",
  fechaInicioReal: "",
  horasPlanificadas: "",
  liderEmpleadoId: "",
  margenPlanificado: "",
  nombre: "",
  precioVenta: "",
  presupuestoPlanificado: "",
  tipoServicioId: "",
};

export function createProjectScope(session: Session): ProjectScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createProjectFormValues(
  project: Project | null,
  session: Session,
): ProjectFormValues {
  if (!project) {
    return {
      ...emptyForm,
      empresaId: session.empresaId?.toString() ?? "",
    };
  }

  return {
    clienteId: project.clienteId.toString(),
    codigo: project.codigo,
    descripcion: project.descripcion,
    empresaId: project.empresaId.toString(),
    estado: project.estado ?? "",
    fechaFinPlanificada: normalizeDateInput(project.fechaFinPlanificada),
    fechaFinReal: normalizeDateInput(project.fechaFinReal),
    fechaInicioPlanificada: normalizeDateInput(project.fechaInicioPlanificada),
    fechaInicioReal: normalizeDateInput(project.fechaInicioReal),
    horasPlanificadas: project.horasPlanificadas.toString(),
    liderEmpleadoId: project.liderEmpleadoId.toString(),
    margenPlanificado: project.margenPlanificado.toString(),
    nombre: project.nombre,
    precioVenta: project.precioVenta.toString(),
    presupuestoPlanificado: project.presupuestoPlanificado.toString(),
    tipoServicioId: project.tipoServicioId.toString(),
  };
}

export function updateProjectFormValue(
  form: ProjectFormValues,
  key: keyof ProjectFormValues,
  value: string,
) {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateProjectPayload(
  form: ProjectFormValues,
  scope: ProjectScope,
): CreateProjectPayload {
  return {
    clienteId: Number.parseInt(form.clienteId, 10),
    codigo: form.codigo.trim(),
    descripcion: form.descripcion.trim(),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
    liderEmpleadoId: Number.parseInt(form.liderEmpleadoId, 10),
    margenPlanificado: Number.parseFloat(form.margenPlanificado),
    nombre: form.nombre.trim(),
    presupuestoPlanificado: Number.parseFloat(form.presupuestoPlanificado),
    precioVenta: Number.parseFloat(form.precioVenta),
    tipoServicioId: Number.parseInt(form.tipoServicioId, 10),
  };
}

export function buildUpdateProjectPayload(
  form: ProjectFormValues,
): UpdateProjectPayload {
  const payload: UpdateProjectPayload = {
    clienteId: Number.parseInt(form.clienteId, 10),
    codigo: form.codigo.trim(),
    descripcion: form.descripcion.trim(),
    estado: form.estado.trim(),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    horasPlanificadas: Number.parseFloat(form.horasPlanificadas),
    liderEmpleadoId: Number.parseInt(form.liderEmpleadoId, 10),
    margenPlanificado: Number.parseFloat(form.margenPlanificado),
    nombre: form.nombre.trim(),
    presupuestoPlanificado: Number.parseFloat(form.presupuestoPlanificado),
    precioVenta: Number.parseFloat(form.precioVenta),
    tipoServicioId: Number.parseInt(form.tipoServicioId, 10),
  };

  if (form.fechaInicioReal) {
    payload.fechaInicioReal = form.fechaInicioReal;
  }

  if (form.fechaFinReal) {
    payload.fechaFinReal = form.fechaFinReal;
  }

  return payload;
}

function normalizeDateInput(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}
