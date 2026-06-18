import type {
  OwnerEmployeeCost,
  OwnerExpense,
  OwnerFinanceSummary,
  OwnerIncome,
  OwnerProjectDashboard,
  OwnerTrafficLight,
} from "../types/owner-dashboard";

export function formatMoney(value?: number | null) {
  return new Intl.NumberFormat("es-PE", {
    currency: "PEN",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(safeNumber(value));
}

export function formatNumber(value?: number | null, suffix = "") {
  const formatted = new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2,
  }).format(safeNumber(value));

  return suffix ? `${formatted} ${suffix}` : formatted;
}

export function formatPercent(value?: number | null) {
  return `${formatNumber(value)}%`;
}

export function formatDate(value?: string | null) {
  return value?.slice(0, 10) ?? "-";
}

export function getTrafficLabel(value?: OwnerTrafficLight | null) {
  switch (value) {
    case "VERDE":
      return "Verde";
    case "AMARILLO":
      return "Amarillo";
    case "ROJO":
      return "Rojo";
    default:
      return "Sin dato";
  }
}

export function getTrafficClasses(value?: OwnerTrafficLight | null) {
  switch (value) {
    case "VERDE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "AMARILLO":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "ROJO":
      return "border-rose-200 bg-rose-50 text-rose-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function computeFinanceSummary(
  dashboards: OwnerProjectDashboard[],
  incomes: OwnerIncome[],
  expenses: OwnerExpense[],
): OwnerFinanceSummary {
  const activeIncomes = incomes.filter((income) => income.activo);
  const activeExpenses = expenses.filter((expense) => expense.activo);
  const fallbackIncomeReal = sum(activeIncomes, (income) => income.monto);
  const fallbackOpex = sum(activeExpenses, (expense) => expense.monto);
  const fromDashboards = dashboards.reduce(
    (summary, dashboard) => {
      const rentability = dashboard.rentabilidad;

      summary.costoLaboral += safeNumber(rentability?.costoLaboral);
      summary.costoOpex += safeNumber(rentability?.costoOpex);
      summary.costoPlanificado += safeNumber(rentability?.costoPlanificado);
      summary.costoReal += safeNumber(rentability?.costoReal);
      summary.ingresoPlanificado += safeNumber(rentability?.ingresoPlanificado);
      summary.ingresoReal += safeNumber(rentability?.ingresoReal);
      summary.margenPlanificado += safeNumber(rentability?.margenPlanificado);
      summary.margenReal += safeNumber(rentability?.margenReal);

      if (dashboard.semaforo === "ROJO" || dashboard.semaforo === "AMARILLO") {
        summary.proyectosEnRiesgo += 1;
      }

      return summary;
    },
    {
      costoLaboral: 0,
      costoOpex: 0,
      costoPlanificado: 0,
      costoReal: 0,
      ingresoPlanificado: 0,
      ingresoReal: 0,
      margenPlanificado: 0,
      margenReal: 0,
      proyectosActivos: dashboards.length,
      proyectosEnRiesgo: 0,
    },
  );

  return {
    ...fromDashboards,
    costoOpex: fromDashboards.costoOpex || fallbackOpex,
    costoReal: fromDashboards.costoReal || fromDashboards.costoLaboral + fallbackOpex,
    ingresoReal: fromDashboards.ingresoReal || fallbackIncomeReal,
    margenReal:
      fromDashboards.margenReal ||
      (fromDashboards.ingresoReal || fallbackIncomeReal) -
        (fromDashboards.costoReal || fromDashboards.costoLaboral + fallbackOpex),
  };
}

export function mergeEmployeeCosts(dashboards: OwnerProjectDashboard[]) {
  const costsByEmployee = new Map<number, OwnerEmployeeCost>();

  dashboards.forEach((dashboard) => {
    dashboard.costosPorEmpleado?.forEach((cost) => {
      const current = costsByEmployee.get(cost.empleadoId) ?? {
        costoHoraPromedio: 0,
        empleadoId: cost.empleadoId,
        empleadoNombre: cost.empleadoNombre,
        porcentajeCostoLaboral: 0,
        registros: 0,
        totalCosto: 0,
        totalHoras: 0,
        ultimoCostoHoraAplicado: 0,
      };

      current.registros += safeNumber(cost.registros);
      current.totalCosto += safeNumber(cost.totalCosto);
      current.totalHoras += safeNumber(cost.totalHoras);
      current.ultimoCostoHoraAplicado =
        safeNumber(cost.ultimoCostoHoraAplicado) ||
        current.ultimoCostoHoraAplicado;
      current.costoHoraPromedio = current.totalHoras
        ? current.totalCosto / current.totalHoras
        : 0;
      costsByEmployee.set(cost.empleadoId, current);
    });
  });

  return Array.from(costsByEmployee.values()).sort(
    (left, right) => right.totalCosto - left.totalCosto,
  );
}

export function safeNumber(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sum<Item>(items: Item[], getValue: (item: Item) => number) {
  return items.reduce((total, item) => total + safeNumber(getValue(item)), 0);
}
