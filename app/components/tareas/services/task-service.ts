import { apiRequest } from "../../../lib/api";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types/task";

export const taskService = {
  create: (payload: CreateTaskPayload, token?: string) =>
    apiRequest<Task>("/api/tareas", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  listByProject: (projectId: number, token?: string) =>
    apiRequest<Task[]>(`/api/tareas/proyecto/${projectId}`, {
      credentials: "omit",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/tareas/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateTaskPayload, token?: string) =>
    apiRequest<Task>(`/api/tareas/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
