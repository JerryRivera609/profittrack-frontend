import type { Session } from "../../../types/domain";

export type Task = {
  id: number;
  proyectoId: number;
  tipoTareaId?: number | null;
  tipoTareaNombre: string;
  empleadoAsignadoId?: number | null;
  empleadoNombre: string;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
  horasReales: number;
  fechaInicioPlanificada?: string | null;
  fechaFinPlanificada?: string | null;
  fechaInicioReal?: string | null;
  fechaFinReal?: string | null;
  estado: string;
  activo: boolean;
};

export type CreateTaskPayload = {
  proyectoId: number;
  tipoTareaId: number;
  empleadoAsignadoId: number;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
};

export type UpdateTaskPayload = {
  tipoTareaId: number;
  empleadoAsignadoId: number;
  nombre: string;
  descripcion: string;
  horasPlanificadas: number;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  estado: string;
};

export type TaskLifecycleAction = "start" | "finish";

export type TaskFormValues = {
  proyectoId: string;
  tipoTareaId: string;
  empleadoAsignadoId: string;
  nombre: string;
  descripcion: string;
  horasPlanificadas: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
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
