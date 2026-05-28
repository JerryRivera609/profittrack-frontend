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
  etapas: [],
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
    const defaultStartDate = new Date();

    return {
      ...emptyForm,
      codigo: createDefaultProjectCode(defaultStartDate),
      empresaId: session.empresaId?.toString() ?? "",
      fechaFinPlanificada: formatDateInput(addDays(defaultStartDate, 30)),
      fechaInicioPlanificada: formatDateInput(defaultStartDate),
      horasPlanificadas: "0",
      margenPlanificado: "0",
      presupuestoPlanificado: "0",
      precioVenta: "0",
    };
  }

  return {
    clienteId: project.clienteId.toString(),
    codigo: project.codigo,
    descripcion: project.descripcion,
    empresaId: project.empresaId.toString(),
    etapas: [],
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

export function updateProjectFormValue<Key extends keyof ProjectFormValues>(
  form: ProjectFormValues,
  key: Key,
  value: ProjectFormValues[Key],
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
    descripcion: normalizeProjectDescription(form),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    etapas: form.etapas.map((stage, index) =>
      buildCreateProjectStagePayload(stage, index, form),
    ),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    horasPlanificadas: parseDecimalInput(form.horasPlanificadas),
    liderEmpleadoId: Number.parseInt(form.liderEmpleadoId, 10),
    margenPlanificado: parseDecimalInput(form.margenPlanificado),
    nombre: form.nombre.trim(),
    presupuestoPlanificado: parseDecimalInput(form.presupuestoPlanificado),
    precioVenta: parseDecimalInput(form.precioVenta),
    tipoServicioId: Number.parseInt(form.tipoServicioId, 10),
  };
}

export function buildUpdateProjectPayload(
  form: ProjectFormValues,
): UpdateProjectPayload {
  return {
    clienteId: Number.parseInt(form.clienteId, 10),
    codigo: form.codigo.trim(),
    descripcion: normalizeProjectDescription(form),
    estado: normalizeProjectStatus(form.estado),
    fechaFinPlanificada: form.fechaFinPlanificada,
    fechaInicioPlanificada: form.fechaInicioPlanificada,
    horasPlanificadas: parseDecimalInput(form.horasPlanificadas),
    liderEmpleadoId: Number.parseInt(form.liderEmpleadoId, 10),
    margenPlanificado: parseDecimalInput(form.margenPlanificado),
    nombre: form.nombre.trim(),
    presupuestoPlanificado: parseDecimalInput(form.presupuestoPlanificado),
    precioVenta: parseDecimalInput(form.precioVenta),
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

function buildCreateProjectStagePayload(
  stage: ProjectFormValues["etapas"][number],
  index: number,
  form: ProjectFormValues,
) {
  const stageName = stage.nombre.trim() || `Etapa ${index + 1}`;

  return {
    proyectoId: 0,
    nombre: stageName,
    descripcion:
      stage.descripcion.trim() ||
      `${stageName} de ${form.nombre.trim() || form.codigo.trim() || "proyecto"}`,
    orden: index + 1,
    horasPlanificadas: parseDecimalInput(stage.horasPlanificadas),
    fechaInicioPlanificada:
      stage.fechaInicioPlanificada || form.fechaInicioPlanificada,
    fechaFinPlanificada: stage.fechaFinPlanificada || form.fechaFinPlanificada,
  };
}

function normalizeProjectDescription(form: ProjectFormValues) {
  return (
    form.descripcion.trim() ||
    form.nombre.trim() ||
    form.codigo.trim() ||
    "Proyecto sin descripcion"
  );
}

function parseDecimalInput(value: string) {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function createDefaultProjectCode(date: Date) {
  const stamp = [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("");
  const time = [
    `${date.getHours()}`.padStart(2, "0"),
    `${date.getMinutes()}`.padStart(2, "0"),
    `${date.getSeconds()}`.padStart(2, "0"),
  ].join("");

  return `PR-${stamp}-${time}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
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
