import { apiRequest } from "../../../lib/api";
import type {
  CreateTimeEntryPayload,
  RealizedTaskResponse,
  TimeEntry,
  TimeEntrySummary,
} from "../types/time-entry";

type SummaryFilters = {
  empleadoId?: number;
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
    apiRequest<RealizedTaskResponse>("/api/tareas/realizadas", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  listByProject: (projectId: number, token?: string) =>
    apiRequest<TimeEntry[]>(`/api/registro-horas/proyecto/${projectId}`, {
      credentials: "include",
      token,
    }),
  listMine: (token?: string) =>
    apiRequest<TimeEntry[]>("/api/registro-horas/mis-horas", {
      credentials: "include",
      token,
    }),
  reject: (id: number, token?: string) =>
    apiRequest<TimeEntry>(`/api/registro-horas/${id}/desaprobar`, {
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
      credentials: "include",
      token,
    }),
};
