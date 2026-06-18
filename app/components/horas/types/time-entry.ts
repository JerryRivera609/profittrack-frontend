import type { Session } from "../../../types/domain";

export type ApprovalStatus = "PENDIENTE" | "APROBADO" | "DESAPROBADO";

export type TimeEntry = {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  proyectoId: number;
  proyectoNombre: string;
  tareaId?: number | null;
  tareaNombre?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  horasTrabajadas?: number;
  horasDedicadas?: number;
  estadoAprobacion?: ApprovalStatus | string | null;
  aprobado?: boolean;
  activo?: boolean;
  creadoEn?: string | null;
  actualizadoEn?: string | null;
  aprobadoEn?: string | null;
  rechazadoEn?: string | null;
  desaprobadoEn?: string | null;
};

export type CreateTimeEntryPayload = {
  proyectoId: number;
  etapaProyectoId?: number;
  tipoTareaId?: number;
  nombre: string;
  descripcion: string;
  horasDedicadas: number;
};

export type RealizedTaskResponse = {
  tareaId: number;
  registroHorasId: number;
  proyectoId: number;
  empleadoId: number;
  empleadoNombre: string;
  nombre: string;
  descripcion?: string | null;
  horasDedicadas: number;
  estadoAprobacion: ApprovalStatus | string;
  creadoEn?: string | null;
};

export type TimeEntrySummaryItemByProject = {
  proyectoId: number;
  proyectoNombre: string;
  horas: number;
};

export type TimeEntrySummaryItemByEmployee = {
  empleadoId: number;
  empleadoNombre: string;
  horas: number;
};

export type TimeEntrySummary = {
  totalHorasRegistradas: number;
  totalHorasAprobadas: number;
  totalHorasPendientes: number;
  totalHorasRechazadas: number;
  horasPorProyecto: TimeEntrySummaryItemByProject[];
  horasPorEmpleado: TimeEntrySummaryItemByEmployee[];
};

export type TimeEntryCatalogOption = {
  description?: string;
  label: string;
  value: string;
};

export type TimeEntryFormValues = {
  proyectoId: string;
  etapaProyectoId: string;
  tipoTareaId: string;
  nombre: string;
  descripcion: string;
  horasDedicadas: string;
};

export type TimeEntryFilters = {
  proyectoId: string;
};

export type TimeEntryModalState = {
  open: boolean;
};

export type TimeEntryStats = {
  label: string;
  value: string;
};

export type TimeEntryScope = {
  canApprove: boolean;
  canCreate: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
