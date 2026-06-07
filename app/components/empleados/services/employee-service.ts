import { apiRequest } from "../../../lib/api";
import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from "../types/employee";

export const employeeService = {
  create: (payload: CreateEmployeePayload, token?: string) =>
    apiRequest<Employee>("/api/empleados", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Employee[]>("/api/empleados", {
      credentials: "include",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/empleados/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateEmployeePayload, token?: string) =>
    apiRequest<Employee>(`/api/empleados/${id}`, {
      body: payload,
      credentials: "include",
      method: "PATCH",
      token,
    }),
};
