"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  RefreshCw,
  Save,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { Panel } from "../../ui/panel";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useOwnerProjectDashboard } from "../hooks/use-owner-project-dashboard";
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  getTrafficClasses,
  getTrafficLabel,
} from "../utils/owner-dashboard-format";
import { DataTable, SectionTitle } from "./owner-data-table";

export function OwnerProjectDashboard() {
  const { session } = usePlatformAuth();
  const {
    canUseOwnerDashboard,
    createSnapshot,
    dashboard,
    error,
    isLoadingDashboard,
    isLoadingProjects,
    isSavingSnapshot,
    loadDashboard,
    notice,
    projectOptions,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
  } = useOwnerProjectDashboard(session);

  const statistics = dashboard?.estadisticas;
  const rentability = dashboard?.rentabilidad;
  const trafficLight = statistics?.semaforo ?? dashboard?.semaforo;
  const stages = dashboard?.proyecto.etapas ?? [];
  const latestSnapshots = useMemo(
    () =>
      [...(dashboard?.snapshots ?? [])]
        .sort((left, right) =>
          right.fechaSnapshot.localeCompare(left.fechaSnapshot),
        )
        .slice(0, 5),
    [dashboard?.snapshots],
  );

  if (!canUseOwnerDashboard) {
    return (
      <ModulePage
        description="Vista ejecutiva para owners y administradores."
        eyebrow="Owner"
        title="Estado del proyecto"
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
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
      actions={
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isLoadingDashboard || !selectedProjectId}
            icon={
              <RefreshCw
                className={
                  isLoadingDashboard ? "size-4 animate-spin" : "size-4"
                }
              />
            }
            onClick={() => void loadDashboard()}
            variant="secondary"
          >
            Actualizar
          </Button>
          <Button
            disabled={isSavingSnapshot || isLoadingDashboard || !selectedProjectId}
            icon={
              <Save
                className={isSavingSnapshot ? "size-4 animate-pulse" : "size-4"}
              />
            }
            onClick={() => void createSnapshot()}
          >
            Guardar snapshot
          </Button>
        </div>
      }
      description="Vista ejecutiva de salud, costos, horas, margen y alertas del proyecto seleccionado."
      eyebrow="Dashboard owner"
      stats={[
        {
          label: "Costo total",
          value: formatMoney(statistics?.costoTotalProyecto),
        },
        {
          label: "Costo laboral",
          value: formatMoney(statistics?.costoLaboral),
        },
        {
          label: "Horas pendientes",
          value: formatNumber(statistics?.horasPendientes, "h"),
        },
      ]}
      title="Estado del proyecto"
    >
      <div className="space-y-5">
        <Panel>
          <SmartSelectField
            disabled={isLoadingProjects || projectOptions.length === 0}
            icon={<FolderKanban className="size-4" />}
            label="Proyecto"
            onChange={setSelectedProjectId}
            options={projectOptions}
            placeholder={
              isLoadingProjects ? "Cargando proyectos..." : "Selecciona un proyecto"
            }
            required
            value={selectedProjectId}
          />
        </Panel>

        {!isLoadingProjects && projectOptions.length === 0 ? (
          <StatusMessage
            message="No hay proyectos activos disponibles para esta sesion."
            tone="warning"
          />
        ) : null}
        <StatusMessage message={notice} />
        <StatusMessage message={error} tone="error" />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <Panel>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {selectedProject?.codigo ?? "Proyecto"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  {dashboard?.proyecto.nombre ??
                    selectedProject?.nombre ??
                    "Sin proyecto seleccionado"}
                </h3>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-lg border px-3 py-1 text-xs font-semibold ${getTrafficClasses(
                  trafficLight,
                )}`}
              >
                {getTrafficLabel(trafficLight)}
              </span>
            </div>

            <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricLine
                icon={<CheckCircle2 className="size-4" />}
                label="Estado"
                value={statistics?.estado ?? dashboard?.proyecto.estado ?? "-"}
              />
              <MetricLine
                icon={<Clock3 className="size-4" />}
                label="Horas invertidas"
                value={`${formatNumber(statistics?.horasInvertidas, "h")} / ${formatNumber(
                  statistics?.horasPlanificadas,
                  "h",
                )}`}
              />
              <MetricLine
                icon={<BarChart3 className="size-4" />}
                label="Avance de horas"
                value={formatPercent(statistics?.avanceHorasPorcentaje)}
              >
                {statistics?.avanceHorasPorcentaje !== undefined && (
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: `${Math.min(100, Math.max(0, statistics.avanceHorasPorcentaje))}%` }}
                    />
                  </div>
                )}
              </MetricLine>
              <MetricLine
                icon={<Clock3 className="size-4" />}
                label="Horas pendientes"
                value={formatNumber(statistics?.horasPendientes, "h")}
              />
              <MetricLine
                icon={<AlertTriangle className="size-4" />}
                label="Horas excedidas"
                value={formatNumber(statistics?.horasExcedidas, "h")}
              />
              <MetricLine
                icon={<UsersRound className="size-4" />}
                label="Equipo"
                value={formatNumber(dashboard?.equipo.length)}
              />
              <MetricLine
                icon={<BarChart3 className="size-4" />}
                label="Costo total"
                value={formatMoney(statistics?.costoTotalProyecto)}
              />
              <MetricLine
                icon={<CheckCircle2 className="size-4" />}
                label="Costo laboral"
                value={formatMoney(statistics?.costoLaboral)}
              />
              <MetricLine
                icon={<Clock3 className="size-4" />}
                label="Costo operativo"
                value={formatMoney(statistics?.costoOperativo)}
              />
              <MetricLine
                icon={<AlertTriangle className="size-4" />}
                label="Presupuesto restante"
                value={formatMoney(statistics?.saldoPresupuesto)}
              />
              <MetricLine
                icon={<BarChart3 className="size-4" />}
                label="Presupuesto consumido"
                value={formatPercent(statistics?.porcentajePresupuestoConsumido)}
              >
                {statistics?.porcentajePresupuestoConsumido !== undefined && (
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${
                        statistics.porcentajePresupuestoConsumido > 90 ? 'bg-rose-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, statistics.porcentajePresupuestoConsumido))}%` }}
                    />
                  </div>
                )}
              </MetricLine>
              <MetricLine
                icon={<Clock3 className="size-4" />}
                label="Costo promedio hora"
                value={formatMoney(statistics?.costoPromedioHoraProyecto)}
              />
              <MetricLine
                icon={<BarChart3 className="size-4" />}
                label="Ingreso real"
                value={formatMoney(rentability?.ingresoReal)}
              />
              <MetricLine
                icon={<CheckCircle2 className="size-4" />}
                label="Margen real"
                value={formatMoney(rentability?.margenReal)}
              />
              <MetricLine
                icon={<BarChart3 className="size-4" />}
                label="Margen"
                value={formatPercent(rentability?.porcentajeMargen)}
              />
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Alertas</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  Riesgos detectados
                </h3>
              </div>
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div className="mt-4 space-y-2">
              {(dashboard?.alertas ?? []).length > 0 ? (
                dashboard?.alertas.map((alert) => (
                  <div
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                    key={alert}
                  >
                    {alert}
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Sin alertas activas.
                </p>
              )}
            </div>
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel>
            <SectionTitle
              eyebrow="Costo laboral"
              title="Costo por empleado"
            />
            <DataTable
              emptyMessage="No hay costos laborales aprobados."
              headers={[
                "Empleado",
                "Horas",
                "Costo/h prom.",
                "Ultimo costo/h",
                "Costo",
                "% laboral",
                "Registros",
              ]}
              rows={(dashboard?.costosPorEmpleado ?? []).map((cost) => [
                cost.empleadoNombre,
                formatNumber(cost.totalHoras, "h"),
                formatMoney(cost.costoHoraPromedio),
                formatMoney(cost.ultimoCostoHoraAplicado),
                formatMoney(cost.totalCosto),
                formatPercent(cost.porcentajeCostoLaboral),
                formatNumber(cost.registros),
              ])}
            />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Horas HH" title="Horas por empleado" />
            <DataTable
              emptyMessage="No hay horas registradas."
              headers={["Empleado", "Horas"]}
              rows={(dashboard?.resumenHoras.horasPorEmpleado ?? []).map(
                (entry) => [entry.empleadoNombre, formatNumber(entry.horas, "h")],
              )}
            />
          </Panel>
        </div>

        <Panel>
          <SectionTitle eyebrow="Planificacion" title="Etapas del proyecto" />
          <DataTable
            emptyMessage="No hay etapas registradas para este proyecto."
            headers={["Etapa", "Estado", "Plan", "Real"]}
            rows={stages.map((stage) => [
              stage.nombre,
              stage.estado,
              formatNumber(stage.horasPlanificadas, "h"),
              formatNumber(stage.horasReales, "h"),
            ])}
          />
        </Panel>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel>
            <SectionTitle eyebrow="Facturacion" title="Ingresos reales" />
            <DataTable
              emptyMessage="No hay ingresos registrados."
              headers={["Fecha", "Tipo", "Proyecto", "Monto"]}
              rows={(dashboard?.ingresos ?? []).map((income) => [
                formatDate(income.fechaIngreso),
                income.tipo,
                income.proyectoNombre ?? dashboard?.proyecto.nombre ?? "-",
                formatMoney(income.monto),
              ])}
            />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Operacion" title="Egresos reales" />
            <DataTable
              emptyMessage="No hay egresos registrados."
              headers={["Fecha", "Categoria", "Proyecto", "Monto"]}
              rows={(dashboard?.egresos ?? []).map((expense) => [
                formatDate(expense.fechaEgreso),
                expense.categoriaNombre ?? "Sin categoria",
                expense.proyectoNombre ?? dashboard?.proyecto.nombre ?? "-",
                formatMoney(expense.monto),
              ])}
            />
          </Panel>
        </div>

        <Panel>
          <SectionTitle eyebrow="Historico" title="Ultimos snapshots" />
          <DataTable
            emptyMessage="No hay snapshots guardados."
            headers={["Fecha", "Costo real", "Ingreso real", "Margen", "Horas"]}
            rows={latestSnapshots.map((snapshot) => [
              formatDate(snapshot.fechaSnapshot),
              formatMoney(snapshot.costoReal),
              formatMoney(snapshot.ingresoReal),
              formatMoney(snapshot.margenReal),
              formatNumber(snapshot.horasReales, "h"),
            ])}
          />
        </Panel>
      </div>
      </ModulePage>
    </>
  );
}

function MetricLine({
  icon,
  label,
  value,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  children?: ReactNode;
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
      {children}
    </div>
  );
}
