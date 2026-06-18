import type { Session } from "../../../types/domain";
import type {
  ApprovalStatus,
  CreateTimeEntryPayload,
  TimeEntry,
  TimeEntryFilters,
  TimeEntryFormValues,
  TimeEntryScope,
  TimeEntrySummary,
} from "../types/time-entry";

const emptyForm: TimeEntryFormValues = {
  descripcion: "",
  etapaProyectoId: "",
  horasDedicadas: "",
  nombre: "",
  proyectoId: "",
  tipoTareaId: "",
};

export function createTimeEntryScope(session: Session): TimeEntryScope {
  return {
    canApprove: session.role !== "EMPLEADO",
    canCreate: true,
    isAdmin: session.role === "ADMIN",
    isDeveloper: session.role === "EMPLEADO",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createTimeEntryFormValues(projectId = ""): TimeEntryFormValues {
  return {
    ...emptyForm,
    proyectoId: projectId,
  };
}

export function createTimeEntryFilters(projectId = ""): TimeEntryFilters {
  return {
    proyectoId: projectId,
  };
}

export function updateTimeEntryFormValue(
  form: TimeEntryFormValues,
  key: keyof TimeEntryFormValues,
  value: string,
): TimeEntryFormValues {
  return {
    ...form,
    [key]: value,
  };
}

export function buildCreateTimeEntryPayload(
  form: TimeEntryFormValues,
): CreateTimeEntryPayload {
  const etapaProyectoId = parseOptionalId(form.etapaProyectoId);
  const tipoTareaId = parseOptionalId(form.tipoTareaId);

  return {
    ...(etapaProyectoId ? { etapaProyectoId } : {}),
    ...(tipoTareaId ? { tipoTareaId } : {}),
    descripcion: form.descripcion.trim(),
    horasDedicadas: Number.parseFloat(form.horasDedicadas),
    nombre: form.nombre.trim(),
    proyectoId: Number.parseInt(form.proyectoId, 10),
  };
}

export function buildSummaryFromEntries(entries: TimeEntry[]): TimeEntrySummary {
  const hoursByProject = new Map<number, { horas: number; nombre: string }>();
  const hoursByEmployee = new Map<number, { horas: number; nombre: string }>();

  let totalHorasRegistradas = 0;
  let totalHorasAprobadas = 0;
  let totalHorasPendientes = 0;
  let totalHorasRechazadas = 0;

  entries.forEach((entry) => {
    const hours = getTimeEntryHours(entry);
    const status = getTimeEntryApprovalStatus(entry);

    totalHorasRegistradas += hours;

    if (status === "APROBADO") {
      totalHorasAprobadas += hours;

      const projectBucket = hoursByProject.get(entry.proyectoId) ?? {
        horas: 0,
        nombre: entry.proyectoNombre,
      };
      projectBucket.horas += hours;
      hoursByProject.set(entry.proyectoId, projectBucket);

      const employeeBucket = hoursByEmployee.get(entry.empleadoId) ?? {
        horas: 0,
        nombre: entry.empleadoNombre,
      };
      employeeBucket.horas += hours;
      hoursByEmployee.set(entry.empleadoId, employeeBucket);
      return;
    }

    if (status === "DESAPROBADO") {
      totalHorasRechazadas += hours;
      return;
    }

    totalHorasPendientes += hours;
  });

  return {
    horasPorEmpleado: Array.from(hoursByEmployee.entries()).map(
      ([empleadoId, bucket]) => ({
        empleadoId,
        empleadoNombre: bucket.nombre,
        horas: bucket.horas,
      }),
    ),
    horasPorProyecto: Array.from(hoursByProject.entries()).map(
      ([proyectoId, bucket]) => ({
        proyectoId,
        proyectoNombre: bucket.nombre,
        horas: bucket.horas,
      }),
    ),
    totalHorasAprobadas,
    totalHorasPendientes,
    totalHorasRechazadas,
    totalHorasRegistradas,
  };
}

export function getTimeEntryApprovalStatus(entry: TimeEntry): ApprovalStatus {
  const explicitStatus = entry.estadoAprobacion?.toString().trim().toUpperCase();

  if (explicitStatus === "APROBADO" || explicitStatus === "DESAPROBADO") {
    return explicitStatus;
  }

  if (explicitStatus === "PENDIENTE") {
    return "PENDIENTE";
  }

  if (entry.aprobado) {
    return "APROBADO";
  }

  return "PENDIENTE";
}

export function getTimeEntryHours(entry: TimeEntry) {
  const hours = entry.horasTrabajadas ?? entry.horasDedicadas ?? 0;

  return Number.isFinite(hours) ? hours : 0;
}

export function formatHours(value: number) {
  return `${value.toFixed(2)} h`;
}

function parseOptionalId(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}
