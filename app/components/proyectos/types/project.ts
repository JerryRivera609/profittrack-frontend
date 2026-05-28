import type { Session } from "../../../types/domain";

export type Project = {
  id: number;
  empresaId: number;
  clienteId: number;
  clienteNombre: string;
  tipoServicioId: number;
  tipoServicioNombre: string;
  liderEmpleadoId: number;
  liderNombre: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicioPlanificada?: string | null;
  fechaFinPlanificada?: string | null;
  fechaInicioReal?: string | null;
  fechaFinReal?: string | null;
  horasPlanificadas: number;
  horasReales: number;
  presupuestoPlanificado: number;
  costoReal: number;
  margenPlanificado: number;
  margenReal: number;
  precioVenta: number;
  estado: string;
  activo: boolean;
  etapas?: ProjectStage[];
};

export type ProjectStage = {
  id: number;
  empresaId: number;
  proyectoId: number;
  proyectoNombre: string;
  nombre: string;
  descripcion: string;
  orden: number;
  horasPlanificadas: number;
  horasTareasPlanificadas: number;
  horasReales: number;
  fechaInicioPlanificada?: string | null;
  fechaFinPlanificada?: string | null;
  fechaInicioReal?: string | null;
  fechaFinReal?: string | null;
  estado: string;
  activo: boolean;
};

export type CreateProjectPayload = {
  empresaId: number;
  clienteId: number;
  tipoServicioId: number;
  liderEmpleadoId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasPlanificadas: number;
  presupuestoPlanificado: number;
  margenPlanificado: number;
  precioVenta: number;
  etapas: CreateProjectStagePayload[];
};

export type CreateProjectStagePayload = {
  proyectoId: number;
  nombre: string;
  descripcion: string;
  orden: number;
  horasPlanificadas: number;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
};

export type UpdateProjectPayload = {
  clienteId: number;
  tipoServicioId: number;
  liderEmpleadoId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  horasPlanificadas: number;
  presupuestoPlanificado: number;
  margenPlanificado: number;
  precioVenta: number;
  estado: string;
};

export type ProjectFormValues = {
  clienteId: string;
  codigo: string;
  descripcion: string;
  empresaId: string;
  etapas: ProjectStageFormValues[];
  estado: string;
  fechaFinPlanificada: string;
  fechaInicioPlanificada: string;
  horasPlanificadas: string;
  liderEmpleadoId: string;
  margenPlanificado: string;
  nombre: string;
  precioVenta: string;
  presupuestoPlanificado: string;
  tipoServicioId: string;
};

export type ProjectStageFormValues = {
  nombre: string;
  descripcion: string;
  horasPlanificadas: string;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
};

export type ProjectModalMode = "create" | "edit";

export type ProjectModalState = {
  mode: ProjectModalMode;
  open: boolean;
  project: Project | null;
};

export type ProjectLifecycleAction = "start" | "finish";

export type ProjectStats = {
  label: string;
  value: string;
};

export type ProjectCatalogOption = {
  description?: string;
  label: string;
  value: string;
};

export type ProjectEmployeeAssignment = {
  id: number;
  proyectoId: number;
  proyectoNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  rolAsignado: string;
  fechaAsignacion: string;
  costoHoraCongelado: number;
  activo: boolean;
};

export type CreateProjectEmployeeAssignmentPayload = {
  proyectoId: number;
  empleadoId: number;
  rolAsignado: string;
};

export type ProjectEmployeeAssignmentFormValues = {
  empleadoId: string;
  rolAsignado: string;
};

export type ProjectScope = {
  isAdmin: boolean;
  session: Session;
  sessionEmpresaId?: number;
};
