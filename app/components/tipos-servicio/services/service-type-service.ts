import { apiRequest } from "../../../lib/api";
import type {
  CreateServiceTypePayload,
  ServiceType,
  UpdateServiceTypePayload,
} from "../types/service-type";

export const serviceTypeService = {
  create: (payload: CreateServiceTypePayload, token?: string) =>
    apiRequest<ServiceType>("/api/tipos-servicio", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<ServiceType[]>("/api/tipos-servicio", {
      credentials: "include",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/tipos-servicio/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateServiceTypePayload, token?: string) =>
    apiRequest<ServiceType>(`/api/tipos-servicio/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
