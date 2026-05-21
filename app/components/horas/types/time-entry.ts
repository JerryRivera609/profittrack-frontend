import type { Session } from "../../../types/domain";

export type TimeEntry = {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  proyectoId: number;
  proyectoNombre: string;
  tareaId: number;
  tareaNombre: string;
  fechaTrabajo: string;
  horaIngreso: string;
  horaSalida: string;
  minutosDescanso: number;
  horasTrabajadas: number;
  descripcion: string;
  aprobado: boolean;
  activo: boolean;
};

export type CreateTimeEntryPayload = {
  proyectoId: number;
  tareaId: number;
  fechaTrabajo: string;
  horaIngreso: string;
  horaSalida: string;
  minutosDescanso: number;
  horasTrabajadas: number;
  descripcion: string;
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
  tareaId: string;
  fechaTrabajo: string;
  horaIngreso: string;
  horaSalida: string;
  minutosDescanso: string;
  horasTrabajadas: string;
  descripcion: string;
};

export type TimeEntryFilters = {
  fechaFin: string;
  fechaInicio: string;
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
