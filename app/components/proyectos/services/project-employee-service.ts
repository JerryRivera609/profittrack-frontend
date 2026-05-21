import { apiRequest } from "../../../lib/api";
import type {
  CreateProjectEmployeeAssignmentPayload,
  ProjectEmployeeAssignment,
} from "../types/project";

export const projectEmployeeService = {
  assign: (payload: CreateProjectEmployeeAssignmentPayload, token?: string) =>
    apiRequest<ProjectEmployeeAssignment>("/api/proyecto-empleados", {
      body: payload,
      credentials: "include",
      method: "POST",
      token,
    }),
  listByProject: (projectId: number, token?: string) =>
    apiRequest<ProjectEmployeeAssignment[]>(
      `/api/proyecto-empleados/proyecto/${projectId}`,
      {
        credentials: "omit",
        token,
      },
    ),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/proyecto-empleados/${id}`, {
      credentials: "include",
      method: "DELETE",
      token,
    }),
};
