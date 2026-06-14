import type { Session } from "../../../types/domain";

export type Task = {
  id: number;
  proyectoId: number;
  etapaProyectoId?: number | null;
  etapaProyectoNombre?: string | null;
  tipoTareaId?: number | null;
  tipoTareaNombre: string;
  empleadoAsignadoId?: number | null;
  empleadoNombre: string;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
  horasReales: number;
  estadoAprobacion?: string | null;
  estado: string;
  activo: boolean;
};

export type CreateTaskPayload = {
  proyectoId: number;
  etapaProyectoId?: number;
  tipoTareaId?: number;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
};

export type UpdateTaskPayload = {
  etapaProyectoId?: number;
  tipoTareaId?: number;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
  estado: string;
};

export type TaskFormValues = {
  proyectoId: string;
  etapaProyectoId: string;
  tipoTareaId: string;
  nombre: string;
  descripcion: string;
  horasPlanificadas: string;
  estado: string;
};

export type TaskModalMode = "create" | "edit";

export type TaskModalState = {
  mode: TaskModalMode;
  open: boolean;
  task: Task | null;
};

export type TaskCatalogOption = {
  description?: string;
  label: string;
  value: string;
};

export type TaskStats = {
  label: string;
  value: string;
};

export type TaskScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
