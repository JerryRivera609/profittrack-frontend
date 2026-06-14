import { apiRequest } from "../../../lib/api";
import type {
  OwnerCompanyFinanceDashboard,
  OwnerExpense,
  OwnerIncome,
  OwnerMetricSnapshot,
  OwnerProjectDashboard,
} from "../types/owner-dashboard";

export const ownerDashboardService = {
  createSnapshot: (projectId: number, token?: string) =>
    apiRequest<OwnerMetricSnapshot>(`/api/metricas/proyecto/${projectId}/snapshot`, {
      credentials: "include",
      method: "POST",
      token,
    }),
  dashboard: (projectId: number, token?: string) =>
    apiRequest<OwnerProjectDashboard>(
      `/api/proyectos/${projectId}/dashboard-owner`,
      {
        credentials: "include",
        token,
      },
    ),
  companyFinance: (token?: string) =>
    apiRequest<OwnerCompanyFinanceDashboard>(
      "/api/empresas/dashboard-financiero-owner",
      {
        credentials: "include",
        token,
      },
    ),
  listExpenses: (token?: string) =>
    apiRequest<OwnerExpense[]>("/api/egresos", {
      credentials: "include",
      token,
    }),
  listIncomes: (token?: string) =>
    apiRequest<OwnerIncome[]>("/api/ingresos", {
      credentials: "include",
      token,
    }),
};
