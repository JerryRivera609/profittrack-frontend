"use client";

import {
  Activity,
  AlertTriangle,
  BriefcaseBusiness,
  LineChart,
  ReceiptText,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { Panel } from "../../ui/panel";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useOwnerCompanyFinance } from "../hooks/use-owner-company-finance";
import type {
  OwnerCompanyProjectFinance,
  OwnerTrafficLight,
} from "../types/owner-dashboard";
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  getTrafficClasses,
  getTrafficLabel,
} from "../utils/owner-dashboard-format";
import { DataTable, SectionTitle } from "./owner-data-table";

const trafficPriority: Record<OwnerTrafficLight, number> = {
  AMARILLO: 1,
  ROJO: 0,
  VERDE: 2,
};

export function OwnerCompanyFinance() {
  const { session } = usePlatformAuth();
  const {
    canUseOwnerDashboard,
    dashboard,
    error,
    expenses,
    incomes,
    isLoading,
    loadFinance,
    projects,
  } = useOwnerCompanyFinance(session);

  const portfolio = useMemo(
    () =>
      [...projects].sort((left, right) => {
        const byTraffic =
          trafficPriority[left.semaforo] - trafficPriority[right.semaforo];

        if (byTraffic !== 0) {
          return byTraffic;
        }

        return right.costoReal - left.costoReal;
      }),
    [projects],
  );
  const recentIncomes = useMemo(
    () =>
      incomes
        .filter((income) => income.activo)
        .sort((left, right) =>
          right.fechaIngreso.localeCompare(left.fechaIngreso),
        )
        .slice(0, 8),
    [incomes],
  );
  const recentExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => expense.activo)
        .sort((left, right) =>
          right.fechaEgreso.localeCompare(left.fechaEgreso),
        )
        .slice(0, 8),
    [expenses],
  );

  if (!canUseOwnerDashboard) {
    return (
      <ModulePage
        description="Vista financiera para owners y administradores."
        eyebrow="Owner"
        title="Estado financiero"
      >
        <StatusMessage
          message="Esta vista solo esta disponible para owner o admin."
          tone="warning"
        />
      </ModulePage>
    );
  }

  return (
    <>
      <ToastMessage message={error} tone="error" />

      <ModulePage
      actions={
        <Button
          disabled={isLoading}
          icon={
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          }
          onClick={() => void loadFinance()}
          variant="secondary"
        >
          Actualizar
        </Button>
      }
      description="Ingresos, egresos, costos laborales, margen y riesgo financiero de la empresa."
      eyebrow="Finanzas owner"
      stats={[
        {
          label: "Ingreso real",
          value: formatMoney(dashboard?.totalIngresoReal),
        },
        {
          label: "Margen real",
          value: formatMoney(dashboard?.margenReal),
        },
        {
          label: "Proyectos en riesgo",
          value: formatNumber(dashboard?.proyectosEnRiesgo),
        },
      ]}
      title="Estado financiero"
    >
      <div className="space-y-5">
        <StatusMessage message={error} tone="error" />

        <Panel>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <SectionTitle
              eyebrow={dashboard?.empresaNombre ?? session.companyName ?? "Empresa"}
              title="Resumen financiero"
            />
            <span
              className={`inline-flex w-fit items-center rounded-lg border px-3 py-1 text-xs font-semibold ${getTrafficClasses(
                dashboard?.semaforo,
              )}`}
            >
              {getTrafficLabel(dashboard?.semaforo)}
            </span>
          </div>
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricLine
              icon={<ReceiptText className="size-4" />}
              label="Ingreso planificado"
              value={formatMoney(dashboard?.totalIngresoPlanificado)}
            />
            <MetricLine
              icon={<Activity className="size-4" />}
              label="Costo planificado"
              value={formatMoney(dashboard?.totalCostoPlanificado)}
            />
            <MetricLine
              icon={<LineChart className="size-4" />}
              label="Margen"
              value={formatPercent(dashboard?.porcentajeMargen)}
            />
            <MetricLine
              icon={<BriefcaseBusiness className="size-4" />}
              label="Proyectos activos"
              value={formatNumber(dashboard?.totalProyectos)}
            />
            <MetricLine
              icon={<UsersRound className="size-4" />}
              label="Costo laboral"
              value={formatMoney(dashboard?.totalCostoLaboral)}
            />
            <MetricLine
              icon={<ReceiptText className="size-4" />}
              label="Costo operativo"
              value={formatMoney(dashboard?.totalEgresoReal)}
            />
            <MetricLine
              icon={<LineChart className="size-4" />}
              label="CPI"
              value={formatNumber(dashboard?.cpi)}
            />
            <MetricLine
              icon={<AlertTriangle className="size-4" />}
              label="Riesgo"
              value={formatNumber(dashboard?.proyectosEnRiesgo)}
            />
          </div>
        </Panel>

        {(dashboard?.alertas ?? []).length > 0 ? (
          <Panel>
            <SectionTitle eyebrow="Alertas" title="Riesgos financieros" />
            <div className="space-y-2">
              {dashboard?.alertas.map((alert) => (
                <div
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  key={alert}
                >
                  {alert}
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        <Panel>
          <SectionTitle eyebrow="Cartera" title="Rentabilidad por proyecto" />
          <DataTable
            emptyMessage="No hay proyectos financieros para mostrar."
            headers={[
              "Proyecto",
              "Semaforo",
              "Estado",
              "Rentabilidad",
              "Ingreso",
              "Costo",
              "Margen",
              "CPI",
              "SPI",
            ]}
            rows={portfolio.map((project) => [
              project.proyectoNombre,
              getTrafficLabel(project.semaforo),
              project.estado,
              getProjectState(project),
              formatMoney(project.ingresoReal),
              formatMoney(project.costoReal),
              formatMoney(project.margenReal),
              formatNumber(project.cpi),
              formatNumber(project.spi),
            ])}
          />
        </Panel>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel>
            <SectionTitle eyebrow="Ingresos" title="Ultimos ingresos" />
            <DataTable
              emptyMessage="No hay ingresos registrados."
              headers={["Fecha", "Tipo", "Proyecto", "Monto"]}
              rows={recentIncomes.map((income) => [
                formatDate(income.fechaIngreso),
                income.tipo,
                income.proyectoNombre ?? "Empresa",
                formatMoney(income.monto),
              ])}
            />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Egresos" title="Ultimos egresos" />
            <DataTable
              emptyMessage="No hay egresos registrados."
              headers={["Fecha", "Categoria", "Proyecto", "Monto"]}
              rows={recentExpenses.map((expense) => [
                formatDate(expense.fechaEgreso),
                expense.categoriaNombre ?? "Sin categoria",
                expense.proyectoNombre ?? "Empresa",
                formatMoney(expense.monto),
              ])}
            />
          </Panel>
        </div>
      </div>
      </ModulePage>
    </>
  );
}

function getProjectState(project: OwnerCompanyProjectFinance) {
  return project.esRentable ? "Rentable" : "En perdida";
}

function MetricLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 border-t border-slate-100 pt-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-1 truncate text-xl font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
