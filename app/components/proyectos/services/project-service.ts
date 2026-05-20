import { apiRequest } from "../../../lib/api";
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "../types/project";

export const projectService = {
  create: (payload: CreateProjectPayload, token?: string) =>
    apiRequest<Project>("/api/proyectos", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Project[]>("/api/proyectos", {
      credentials: "omit",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/proyectos/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateProjectPayload, token?: string) =>
    apiRequest<Project>(`/api/proyectos/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
