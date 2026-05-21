import { apiRequest } from "../../../lib/api";
import type {
  CreateTaskTypePayload,
  TaskType,
  UpdateTaskTypePayload,
} from "../types/task-type";

export const taskTypeService = {
  create: (payload: CreateTaskTypePayload, token?: string) =>
    apiRequest<TaskType>("/api/tipos-tarea", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<TaskType[]>("/api/tipos-tarea", {
      credentials: "omit",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/tipos-tarea/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateTaskTypePayload, token?: string) =>
    apiRequest<TaskType>(`/api/tipos-tarea/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
