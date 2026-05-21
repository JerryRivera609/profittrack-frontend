import type { Session } from "../../../types/domain";
import type {
  CreateTimeEntryPayload,
  TimeEntry,
  TimeEntryFilters,
  TimeEntryFormValues,
  TimeEntryScope,
  TimeEntrySummary,
} from "../types/time-entry";

const now = new Date();
const defaultDate = formatInputDate(now);
const defaultDateTime = formatDateTimeLocal(now);

const emptyForm: TimeEntryFormValues = {
  descripcion: "",
  fechaTrabajo: defaultDate,
  horaIngreso: defaultDateTime,
  horaSalida: defaultDateTime,
  horasTrabajadas: "0.00",
  minutosDescanso: "0",
  proyectoId: "",
  tareaId: "",
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

export function createTimeEntryFormValues(
  projectId = "",
  taskId = "",
): TimeEntryFormValues {
  return {
    ...emptyForm,
    proyectoId: projectId,
    tareaId: taskId,
  };
}

export function createTimeEntryFilters(projectId = ""): TimeEntryFilters {
  return {
    fechaFin: "",
    fechaInicio: "",
    proyectoId: projectId,
  };
}

export function updateTimeEntryFormValue(
  form: TimeEntryFormValues,
  key: keyof TimeEntryFormValues,
  value: string,
): TimeEntryFormValues {
  const nextForm = {
    ...form,
    [key]: value,
  };

  if (key === "horaIngreso" || key === "horaSalida" || key === "minutosDescanso") {
    return {
      ...nextForm,
      horasTrabajadas: computeWorkedHours(
        nextForm.horaIngreso,
        nextForm.horaSalida,
        nextForm.minutosDescanso,
      ),
    };
  }

  return nextForm;
}

export function buildCreateTimeEntryPayload(
  form: TimeEntryFormValues,
): CreateTimeEntryPayload {
  return {
    descripcion: form.descripcion.trim(),
    fechaTrabajo: form.fechaTrabajo,
    horaIngreso: toIsoDateTime(form.horaIngreso),
    horaSalida: toIsoDateTime(form.horaSalida),
    horasTrabajadas: Number.parseFloat(form.horasTrabajadas),
    minutosDescanso: Number.parseInt(form.minutosDescanso || "0", 10),
    proyectoId: Number.parseInt(form.proyectoId, 10),
    tareaId: Number.parseInt(form.tareaId, 10),
  };
}

export function applyStartNow(
  form: TimeEntryFormValues,
): TimeEntryFormValues {
  const current = new Date();
  const nextDate = formatInputDate(current);
  const nextDateTime = formatDateTimeLocal(current);

  return {
    ...form,
    fechaTrabajo: nextDate,
    horaIngreso: nextDateTime,
    horaSalida: nextDateTime,
    horasTrabajadas: "0.00",
  };
}

export function applyFinishNow(
  form: TimeEntryFormValues,
): TimeEntryFormValues {
  const end = formatDateTimeLocal(new Date());

  return {
    ...form,
    horaSalida: end,
    horasTrabajadas: computeWorkedHours(
      form.horaIngreso,
      end,
      form.minutosDescanso,
    ),
  };
}

export function buildStatsFromSummary(summary: TimeEntrySummary | null) {
  if (!summary) {
    return [
      { label: "Horas registradas", value: "0.00" },
      { label: "Horas aprobadas", value: "0.00" },
      { label: "Horas pendientes", value: "0.00" },
    ];
  }

  return [
    {
      label: "Horas registradas",
      value: formatHours(summary.totalHorasRegistradas),
    },
    {
      label: "Horas aprobadas",
      value: formatHours(summary.totalHorasAprobadas),
    },
    {
      label: "Horas pendientes",
      value: formatHours(summary.totalHorasPendientes),
    },
  ];
}

export function buildSummaryFromEntries(entries: TimeEntry[]): TimeEntrySummary {
  const hoursByProject = new Map<number, { horas: number; nombre: string }>();
  const hoursByEmployee = new Map<number, { horas: number; nombre: string }>();

  let totalHorasRegistradas = 0;
  let totalHorasAprobadas = 0;
  let totalHorasPendientes = 0;

  entries.forEach((entry) => {
    totalHorasRegistradas += entry.horasTrabajadas;

    if (entry.aprobado) {
      totalHorasAprobadas += entry.horasTrabajadas;
    } else {
      totalHorasPendientes += entry.horasTrabajadas;
    }

    const projectBucket = hoursByProject.get(entry.proyectoId) ?? {
      horas: 0,
      nombre: entry.proyectoNombre,
    };
    projectBucket.horas += entry.horasTrabajadas;
    hoursByProject.set(entry.proyectoId, projectBucket);

    const employeeBucket = hoursByEmployee.get(entry.empleadoId) ?? {
      horas: 0,
      nombre: entry.empleadoNombre,
    };
    employeeBucket.horas += entry.horasTrabajadas;
    hoursByEmployee.set(entry.empleadoId, employeeBucket);
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
    totalHorasRechazadas: 0,
    totalHorasRegistradas,
  };
}

export function formatHours(value: number) {
  return `${value.toFixed(2)} h`;
}

export function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromApiDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDateTimeLocal(date);
}

export function computeWorkedHours(
  startValue: string,
  endValue: string,
  breakMinutesValue: string,
) {
  const start = Date.parse(startValue);
  const end = Date.parse(endValue);
  const breakMinutes = Number.parseInt(breakMinutesValue || "0", 10);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return "0.00";
  }

  const effectiveMs = end - start - Math.max(breakMinutes, 0) * 60_000;

  if (effectiveMs <= 0) {
    return "0.00";
  }

  return (effectiveMs / 3_600_000).toFixed(2);
}

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}
