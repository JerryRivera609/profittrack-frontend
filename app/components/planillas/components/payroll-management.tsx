"use client";

import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { TextField } from "../../ui/text-field";
import { ToastMessage } from "../../ui/toast-message";
import { usePayrolls } from "../hooks/use-payrolls";
import { type PayrollDetailFormValues } from "../types/payroll";
import {
  formatCurrency,
  getMonthLabel,
  getPayrollDetailFinalAmount,
  getPayrollStats,
} from "../utils/payroll-format";
import { PayrollDetailModal } from "./payroll-detail-modal";
import { PayrollList } from "./payroll-list";

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  label: getMonthLabel(index + 1),
  value: `${index + 1}`,
}));

export function PayrollManagement() {
  const { session } = usePlatformAuth();
  const {
    addDetailRow,
    closePayrollDetail,
    detailPayroll,
    employeeOptions,
    error,
    form,
    isLoading,
    isLoadingDetails,
    isLoadingEmployees,
    isSaving,
    loadPayrolls,
    notice,
    openPayrollDetail,
    removeDetailRow,
    scope,
    setForm,
    submitPayroll,
    updateDetail,
    visiblePayrolls,
  } = usePayrolls(session);

  const stats = useMemo(() => getPayrollStats(visiblePayrolls), [visiblePayrolls]);
  const totalPreview = useMemo(
    () =>
      form.detalles.reduce(
        (total, detail) => total + getPayrollDetailFinalAmount(detail),
        0,
      ),
    [form.detalles],
  );

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <Button
            disabled={isLoading}
            icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
            onClick={() => void loadPayrolls()}
            variant="secondary"
          >
            Actualizar
          </Button>
        }
        description="Genera planillas mensuales por empresa y revisa el detalle de cada cierre."
        eyebrow="RR.HH financiero"
        stats={stats}
        title="Planillas"
      >
        <div className="space-y-5">
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Generacion</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Nueva planilla
                  </h3>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                  <p className="text-xs font-medium uppercase text-slate-400">Total estimado</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(totalPreview)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {scope.isAdmin ? (
                  <TextField
                    label="Empresa ID"
                    min="1"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        empresaId: event.target.value,
                      }))
                    }
                    required
                    type="number"
                    value={form.empresaId}
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-xs font-medium uppercase text-slate-400">Empresa</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {session.companyName ?? "Empresa asignada"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ID {scope.sessionEmpresaId ?? "sin asignar"}
                    </p>
                  </div>
                )}

                <TextField
                  label="Anio"
                  min="2024"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      anio: event.target.value,
                    }))
                  }
                  required
                  type="number"
                  value={form.anio}
                />
                <SmartSelectField
                  disabled={false}
                  label="Mes"
                  onChange={(selectedValue) =>
                    setForm((current) => ({
                      ...current,
                      mes: selectedValue,
                    }))
                  }
                  options={monthOptions}
                  placeholder="Selecciona el mes"
                  required
                  value={form.mes}
                />
              </div>

              <div className="mt-6 space-y-4">
                {form.detalles.map((detail, index) => (
                  <PayrollDetailRow
                    detail={detail}
                    employeeOptions={employeeOptions}
                    index={index}
                    isLoadingEmployees={isLoadingEmployees}
                    key={`${index}-${detail.empleadoId}`}
                    selectedEmployeeIds={form.detalles.map((item) => item.empleadoId)}
                    onChange={updateDetail}
                    onRemove={removeDetailRow}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button icon={<Plus className="size-4" />} onClick={addDetailRow} variant="secondary">
                  Agregar colaborador
                </Button>
                <Button disabled={isSaving} onClick={() => void submitPayroll()}>
                  {isSaving ? "Generando..." : "Generar planilla"}
                </Button>
              </div>
            </section>

            <PayrollList
              isLoading={isLoading}
              onView={(payrollId) => void openPayrollDetail(payrollId)}
              payrolls={visiblePayrolls}
            />
          </div>
        </div>
      </ModulePage>

      <PayrollDetailModal
        isLoading={isLoadingDetails}
        onClose={closePayrollDetail}
        payroll={detailPayroll}
      />
    </>
  );
}

function PayrollDetailRow({
  detail,
  employeeOptions,
  index,
  isLoadingEmployees,
  selectedEmployeeIds,
  onChange,
  onRemove,
}: {
  detail: PayrollDetailFormValues;
  employeeOptions: Array<{ description?: string; label: string; value: string }>;
  index: number;
  isLoadingEmployees: boolean;
  selectedEmployeeIds: string[];
  onChange: (
    index: number,
    key: "bonos" | "descuentos" | "empleadoId" | "sueldoBase",
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}) {
  const finalAmount = getPayrollDetailFinalAmount(detail);
  const availableEmployeeOptions = employeeOptions.filter((option) => {
    if (option.value === detail.empleadoId) {
      return true;
    }

    return !selectedEmployeeIds.includes(option.value);
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Detalle #{index + 1}
          </p>
          <p className="text-xs text-slate-500">
            Sueldo final estimado: {formatCurrency(finalAmount)}
          </p>
        </div>
        <Button
          icon={<Trash2 className="size-4" />}
          onClick={() => onRemove(index)}
          variant="ghost"
        >
          Quitar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmartSelectField
          disabled={isLoadingEmployees || availableEmployeeOptions.length === 0}
          helperText="Selecciona el colaborador de la planilla."
          label="Empleado"
          onChange={(selectedValue) => onChange(index, "empleadoId", selectedValue)}
          options={availableEmployeeOptions}
          placeholder={
            isLoadingEmployees ? "Cargando empleados..." : "Selecciona un empleado"
          }
          required
          value={detail.empleadoId}
        />
        <TextField
          label="Sueldo base"
          min="0"
          onChange={(event) => onChange(index, "sueldoBase", event.target.value)}
          required
          step="0.01"
          type="number"
          value={detail.sueldoBase}
        />
        <TextField
          label="Bonos"
          min="0"
          onChange={(event) => onChange(index, "bonos", event.target.value)}
          step="0.01"
          type="number"
          value={detail.bonos}
        />
        <TextField
          label="Descuentos"
          min="0"
          onChange={(event) => onChange(index, "descuentos", event.target.value)}
          step="0.01"
          type="number"
          value={detail.descuentos}
        />
      </div>
    </div>
  );
}
