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
      method: "POST",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Employee[]>("/api/empleados", { token }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/empleados/${id}`, {
      method: "DELETE",
      token,
    }),
  update: (id: number, payload: UpdateEmployeePayload, token?: string) =>
    apiRequest<Employee>(`/api/empleados/${id}`, {
      body: payload,
      method: "PATCH",
      token,
    }),
};
