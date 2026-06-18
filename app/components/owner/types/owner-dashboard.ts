import type {
  Project,
  ProjectEmployeeAssignment,
  ProjectStage,
} from "../../proyectos/types/project";

export type OwnerTrafficLight = "AMARILLO" | "ROJO" | "VERDE";

export type OwnerProjectStatistics = {
  proyectoId: number;
  proyectoNombre: string;
  estado: string;
  semaforo: OwnerTrafficLight;
  horasPlanificadas: number;
  horasInvertidas: number;
  horasPendientes: number;
  horasDesaprobadas: number;
  avanceHorasPorcentaje: number;
  horasExcedidas: number;
  costoLaboral: number;
  costoOperativo: number;
  costoTotalProyecto: number;
  costoPlanificado: number;
  saldoPresupuesto: number;
  porcentajePresupuestoConsumido: number;
  costoPromedioHoraProyecto: number;
};

export type OwnerProfitability = {
  proyectoId: number;
  proyectoNombre: string;
  estado: string;
  costoLaboral: number;
  costoOpex: number;
  costoReal: number;
  costoPlanificado: number;
  ingresoReal: number;
  ingresoPlanificado: number;
  margenReal: number;
  margenPlanificado: number;
  porcentajeMargen: number;
  horasReales: number;
  horasInvertidas?: number;
  horasPlanificadas: number;
  avanceHorasPorcentaje?: number;
  horasExcedidas?: number;
  porcentajePresupuestoConsumido?: number;
  saldoPresupuesto?: number;
  costoPromedioHora?: number;
  cpi?: number;
  spi?: number;
  esRentable: boolean;
};

export type OwnerHoursByEmployee = {
  empleadoId: number;
  empleadoNombre: string;
  horas: number;
};

export type OwnerHoursSummary = {
  totalHorasRegistradas: number;
  totalHorasAprobadas: number;
  totalHorasPendientes: number;
  totalHorasRechazadas: number;
  horasPorEmpleado: OwnerHoursByEmployee[];
};

export type OwnerEmployeeCost = {
  empleadoId: number;
  empleadoNombre: string;
  totalHoras: number;
  costoHoraPromedio: number;
  ultimoCostoHoraAplicado: number;
  totalCosto: number;
  porcentajeCostoLaboral: number;
  registros: number;
};

export type OwnerAppliedCost = {
  id: number;
  proyectoId: number;
  proyectoNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  costoHora: number;
  fechaInicio: string;
  fechaFin?: string | null;
  vigente: boolean;
  activo: boolean;
};

export type OwnerIncome = {
  id: number;
  empresaId: number;
  proyectoId?: number | null;
  proyectoNombre?: string | null;
  tipo: string;
  monto: number;
  fechaIngreso: string;
  descripcion: string;
  activo: boolean;
};

export type OwnerExpense = {
  id: number;
  empresaId: number;
  proyectoId?: number | null;
  proyectoNombre?: string | null;
  categoriaId?: number | null;
  categoriaNombre?: string | null;
  monto: number;
  fechaEgreso: string;
  descripcion: string;
  activo: boolean;
};

export type OwnerMetricSnapshot = {
  id: number;
  proyectoId: number;
  fechaSnapshot: string;
  costoPlanificado: number;
  costoReal: number;
  costoLaboral?: number | null;
  costoOpex?: number | null;
  ingresoPlanificado: number;
  ingresoReal: number;
  margenPlanificado: number;
  margenReal: number;
  horasPlanificadas: number;
  horasReales: number;
};

export type OwnerProjectDashboard = {
  proyecto: Project & { etapas?: ProjectStage[] };
  rentabilidad: OwnerProfitability;
  estadisticas: OwnerProjectStatistics;
  resumenHoras: OwnerHoursSummary;
  costosPorEmpleado: OwnerEmployeeCost[];
  equipo: ProjectEmployeeAssignment[];
  costosAplicados: OwnerAppliedCost[];
  ingresos: OwnerIncome[];
  egresos: OwnerExpense[];
  snapshots: OwnerMetricSnapshot[];
  semaforo: OwnerTrafficLight;
  alertas: string[];
};

export type OwnerCompanyProjectFinance = {
  proyectoId: number;
  proyectoNombre: string;
  estado: string;
  semaforo: OwnerTrafficLight;
  ingresoPlanificado: number;
  ingresoReal: number;
  costoPlanificado: number;
  costoLaboral: number;
  costoOpex: number;
  costoReal: number;
  margenPlanificado: number;
  margenReal: number;
  porcentajeMargen: number;
  horasPlanificadas: number;
  horasReales: number;
  cpi: number;
  spi: number;
  esRentable: boolean;
};

export type OwnerCompanyFinanceDashboard = {
  empresaId: number;
  empresaNombre: string;
  fechaConsulta: string;
  totalIngresoPlanificado: number;
  totalIngresoReal: number;
  totalCostoPlanificado: number;
  totalCostoLaboral: number;
  totalEgresoReal: number;
  totalCostoReal: number;
  margenPlanificado: number;
  margenReal: number;
  porcentajeMargen: number;
  horasPlanificadas: number;
  horasReales: number;
  cpi: number;
  spi: number;
  totalProyectos: number;
  proyectosRentables: number;
  proyectosEnRiesgo: number;
  semaforo: OwnerTrafficLight;
  alertas: string[];
  proyectos: OwnerCompanyProjectFinance[];
  ingresos: OwnerIncome[];
  egresos: OwnerExpense[];
};

export type OwnerFinanceSummary = {
  costoLaboral: number;
  costoOpex: number;
  costoPlanificado: number;
  costoReal: number;
  ingresoPlanificado: number;
  ingresoReal: number;
  margenPlanificado: number;
  margenReal: number;
  proyectosActivos: number;
  proyectosEnRiesgo: number;
};
