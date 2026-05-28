import { apiRequest } from "../../../lib/api";
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client";

export const clientService = {
  create: (payload: CreateClientPayload, token?: string) =>
    apiRequest<Client>("/api/clientes", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Client[]>("/api/clientes", {
      credentials: "include",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/clientes/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateClientPayload, token?: string) =>
    apiRequest<Client>(`/api/clientes/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
