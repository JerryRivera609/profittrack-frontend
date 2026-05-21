import type { Session } from "../../../types/domain";
import type {
  CreateProjectPayload,
  ProjectLifecycleAction,
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
  fechaInicioPlanificada: "",
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
    fechaInicioPlanificada: normalizeDateInput(project.fechaInicioPlanificada),
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
  return {
    clienteId: Number.parseInt(form.clienteId, 10),
    codigo: form.codigo.trim(),
    descripcion: form.descripcion.trim(),
    estado: normalizeProjectStatus(form.estado),
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

export function buildProjectLifecyclePayload(
  project: Project,
  action: ProjectLifecycleAction,
): UpdateProjectPayload {
  const today = new Date().toISOString().slice(0, 10);

  return {
    clienteId: project.clienteId,
    codigo: project.codigo,
    descripcion: project.descripcion,
    estado: action === "start" ? "EN_PROCESO" : "FINALIZADO",
    fechaFinPlanificada: normalizeDateInput(project.fechaFinPlanificada),
    fechaFinReal:
      action === "finish"
        ? today
        : normalizeDateInput(project.fechaFinReal) || undefined,
    fechaInicioPlanificada: normalizeDateInput(project.fechaInicioPlanificada),
    fechaInicioReal:
      action === "start"
        ? today
        : normalizeDateInput(project.fechaInicioReal) || undefined,
    horasPlanificadas: project.horasPlanificadas,
    liderEmpleadoId: project.liderEmpleadoId,
    margenPlanificado: project.margenPlanificado,
    nombre: project.nombre,
    presupuestoPlanificado: project.presupuestoPlanificado,
    precioVenta: project.precioVenta,
    tipoServicioId: project.tipoServicioId,
  };
}

function normalizeDateInput(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

function normalizeProjectStatus(value: string) {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "PLANIFICADO":
      return "PLANIFICADO";
    case "EN_PROCESO":
    case "EN PROCESO":
      return "EN_PROCESO";
    case "PAUSADO":
      return "PAUSADO";
    case "FINALIZADO":
    case "FINALIZADA":
    case "FINALIZADO/A":
      return "FINALIZADO";
    case "CANCELADO":
      return "CANCELADO";
    default:
      return normalized;
  }
}
