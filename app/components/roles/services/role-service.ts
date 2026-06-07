import { apiRequest } from "../../../lib/api";
import type {
  CreateRolePayload,
  Role,
  UpdateRolePayload,
} from "../types/role";

export const roleService = {
  create: (payload: CreateRolePayload, token?: string) =>
    apiRequest<Role>("/api/roles", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  get: (id: number, token?: string) =>
    apiRequest<Role>(`/api/roles/${id}`, {
      credentials: "include",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Role[]>("/api/roles", {
      credentials: "include",
      token,
    }),
  listInactive: (token?: string) =>
    apiRequest<Role[]>("/api/roles/inactivos", {
      credentials: "include",
      token,
    }),
  reactivate: (id: number, token?: string) =>
    apiRequest<Role>(`/api/roles/${id}/reactivar`, {
      credentials: "include",
      method: "PATCH",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/roles/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateRolePayload, token?: string) =>
    apiRequest<Role>(`/api/roles/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
