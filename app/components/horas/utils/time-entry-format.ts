import type { TimeEntry } from "../types/time-entry";
import { formatHours } from "./time-entry-form";

export function formatTimeEntryDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatTimeEntryDateTime(value: string) {
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
  }).format(date);
}

export function formatTimeEntryStatus(entry: TimeEntry) {
  if (entry.aprobado) {
    return "Aprobado";
  }

  return entry.activo ? "Pendiente" : "Inactivo";
}

export function formatTimeEntryStatusTone(entry: TimeEntry) {
  if (entry.aprobado) {
    return "text-emerald-700";
  }

  return entry.activo ? "text-amber-700" : "text-slate-500";
}

export function getTopProjectLabel(entries: TimeEntry[]) {
  if (entries.length === 0) {
    return "Sin datos";
  }

  const byProject = new Map<string, number>();

  entries.forEach((entry) => {
    byProject.set(
      entry.proyectoNombre,
      (byProject.get(entry.proyectoNombre) ?? 0) + entry.horasTrabajadas,
    );
  });

  const topProject = Array.from(byProject.entries()).sort((a, b) => b[1] - a[1])[0];

  return topProject ? `${topProject[0]} · ${formatHours(topProject[1])}` : "Sin datos";
}
