import { apiRequest } from "../../../lib/api";
import type {
  CreateTimeEntryPayload,
  TimeEntry,
  TimeEntrySummary,
} from "../types/time-entry";

type SummaryFilters = {
  empleadoId?: number;
  fechaFin?: string;
  fechaInicio?: string;
  proyectoId?: number;
};

function buildSummaryPath(filters: SummaryFilters) {
  const searchParams = new URLSearchParams();

  if (filters.proyectoId) {
    searchParams.set("proyectoId", filters.proyectoId.toString());
  }
  if (filters.empleadoId) {
    searchParams.set("empleadoId", filters.empleadoId.toString());
  }
  if (filters.fechaInicio) {
    searchParams.set("fechaInicio", filters.fechaInicio);
  }
  if (filters.fechaFin) {
    searchParams.set("fechaFin", filters.fechaFin);
  }

  const query = searchParams.toString();
  return query
    ? `/api/registro-horas/resumen?${query}`
    : "/api/registro-horas/resumen";
}

export const timeEntryService = {
  approve: (id: number, token?: string) =>
    apiRequest<TimeEntry>(`/api/registro-horas/${id}/aprobar`, {
      credentials: "include",
      method: "PATCH",
      token,
    }),
  create: (payload: CreateTimeEntryPayload, token?: string) =>
    apiRequest<TimeEntry>("/api/registro-horas", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  listByProject: (projectId: number, token?: string) =>
    apiRequest<TimeEntry[]>(`/api/registro-horas/proyecto/${projectId}`, {
      credentials: "omit",
      token,
    }),
  listMine: (token?: string) =>
    apiRequest<TimeEntry[]>("/api/registro-horas/mis-horas", {
      credentials: "omit",
      token,
    }),
  reject: (id: number, token?: string) =>
    apiRequest<TimeEntry>(`/api/registro-horas/${id}/rechazar`, {
      credentials: "include",
      method: "PATCH",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/registro-horas/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  summary: (filters: SummaryFilters, token?: string) =>
    apiRequest<TimeEntrySummary>(buildSummaryPath(filters), {
      credentials: "omit",
      token,
    }),
};
