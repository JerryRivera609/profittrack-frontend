import { apiRequest } from "../../../lib/api";
import type { CreatePayrollPayload, Payroll } from "../types/payroll";

export const payrollService = {
  create: (payload: CreatePayrollPayload, token?: string) =>
    apiRequest<Payroll>("/api/planillas", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  get: (id: number, token?: string) =>
    apiRequest<Payroll>(`/api/planillas/${id}`, {
      credentials: "include",
      token,
    }),
  list: (token?: string) =>
    apiRequest<Payroll[]>("/api/planillas", {
      credentials: "include",
      token,
    }),
};
