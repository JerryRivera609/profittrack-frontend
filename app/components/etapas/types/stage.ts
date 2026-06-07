import type { Project, ProjectStage } from "../../proyectos/types/project";

export type Stage = ProjectStage;

export type StageProject = Project;

export type StageFormValues = {
  nombre: string;
  descripcion: string;
  orden: string;
  horasPlanificadas: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  fechaInicioReal: string;
  fechaFinReal: string;
  estado: string;
};

export type CreateStagePayload = {
  proyectoId: number;
  nombre: string;
  descripcion: string;
  orden: number;
  horasPlanificadas: number;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
};

export type UpdateStagePayload = {
  nombre: string;
  descripcion: string;
  orden: number;
  horasPlanificadas: number;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  estado: string;
};

export type StageModalMode = "create" | "edit";

export type StageModalState = {
  mode: StageModalMode;
  open: boolean;
  stage: Stage | null;
};

export type StageCatalogOption = {
  description?: string;
  label: string;
  value: string;
};

export type StageStats = {
  label: string;
  value: string;
};
