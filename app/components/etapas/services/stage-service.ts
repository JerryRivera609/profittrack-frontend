import { apiRequest } from "../../../lib/api";
import type { CreateStagePayload, Stage, UpdateStagePayload } from "../types/stage";

export const stageService = {
  create: (projectId: number, payload: CreateStagePayload, token?: string) =>
    apiRequest<Stage>(`/api/proyectos/${projectId}/etapas`, {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  get: (id: number, token?: string) =>
    apiRequest<Stage>(`/api/etapas-proyecto/${id}`, {
      credentials: "include",
      token,
    }),
  listByProject: (projectId: number, token?: string) =>
    apiRequest<Stage[]>(`/api/proyectos/${projectId}/etapas`, {
      credentials: "include",
      token,
    }),
  listInactiveByProject: (projectId: number, token?: string) =>
    apiRequest<Stage[]>(`/api/proyectos/${projectId}/etapas/inactivas`, {
      credentials: "include",
      token,
    }),
  reactivate: (id: number, token?: string) =>
    apiRequest<Stage>(`/api/etapas-proyecto/${id}/reactivar`, {
      credentials: "include",
      method: "PATCH",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/etapas-proyecto/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateStagePayload, token?: string) =>
    apiRequest<Stage>(`/api/etapas-proyecto/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
