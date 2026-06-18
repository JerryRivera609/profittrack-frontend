import type { TimeEntry } from "../types/time-entry";
import {
  formatHours,
  getTimeEntryApprovalStatus,
  getTimeEntryHours,
} from "./time-entry-form";

export function formatTimeEntryDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const normalizedValue = value.includes("T") ? value : `${value}T00:00:00`;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTimeEntryDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTimeEntryStatus(entry: TimeEntry) {
  switch (getTimeEntryApprovalStatus(entry)) {
    case "APROBADO":
      return "Aprobado";
    case "DESAPROBADO":
      return "Desaprobado";
    default:
      return "Pendiente";
  }
}

export function formatTimeEntryStatusTone(entry: TimeEntry) {
  switch (getTimeEntryApprovalStatus(entry)) {
    case "APROBADO":
      return "text-emerald-700";
    case "DESAPROBADO":
      return "text-rose-700";
    default:
      return "text-amber-700";
  }
}

export function isTimeEntryApproved(entry: TimeEntry) {
  return getTimeEntryApprovalStatus(entry) === "APROBADO";
}

export function isTimeEntryPending(entry: TimeEntry) {
  return getTimeEntryApprovalStatus(entry) === "PENDIENTE";
}

export function getTimeEntryTaskName(entry: TimeEntry) {
  return entry.tareaNombre ?? entry.nombre ?? `Tarea #${entry.tareaId ?? entry.id}`;
}

export function getTimeEntryDecisionDate(entry: TimeEntry) {
  return entry.aprobadoEn ?? entry.desaprobadoEn ?? entry.rechazadoEn ?? null;
}

export function getTopProjectLabel(entries: TimeEntry[]) {
  if (entries.length === 0) {
    return "Sin datos";
  }

  const byProject = new Map<string, number>();

  entries
    .filter((entry) => isTimeEntryApproved(entry))
    .forEach((entry) => {
      byProject.set(
        entry.proyectoNombre,
        (byProject.get(entry.proyectoNombre) ?? 0) + getTimeEntryHours(entry),
      );
    });

  const topProject = Array.from(byProject.entries()).sort((a, b) => b[1] - a[1])[0];

  return topProject ? `${topProject[0]} - ${formatHours(topProject[1])}` : "Sin datos";
}
