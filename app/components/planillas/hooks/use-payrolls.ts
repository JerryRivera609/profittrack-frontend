"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { employeeService } from "../../empleados/services/employee-service";
import { validatePayrollForm } from "../schema/payroll-schema";
import { payrollService } from "../services/payroll-service";
import type {
  Payroll,
  PayrollCatalogOption,
  PayrollFormValues,
} from "../types/payroll";
import {
  addPayrollDetail,
  buildCreatePayrollPayload,
  buildEmployeeOptions,
  buildVisiblePayrolls,
  createPayrollFormValues,
  createPayrollScope,
  removePayrollDetail,
  updatePayrollDetailValue,
} from "../utils/payroll-form";

export function usePayrolls(session: Session) {
  const scope = useMemo(() => createPayrollScope(session), [session]);
  const [detailPayroll, setDetailPayroll] = useState<Payroll | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<PayrollCatalogOption[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<PayrollFormValues>(() =>
    createPayrollFormValues(session),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  const visiblePayrolls = useMemo(
    () => buildVisiblePayrolls(payrolls, scope),
    [payrolls, scope],
  );

  const loadEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);

    try {
      const response = await employeeService.list(session.apiToken);
      setEmployeeOptions(buildEmployeeOptions(response ?? [], scope));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [scope, session.apiToken]);

  const loadPayrolls = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await payrollService.list(session.apiToken);
      setPayrolls(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Promise.all([loadEmployees(), loadPayrolls()]);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEmployees, loadPayrolls]);

  function resetForm() {
    setForm(createPayrollFormValues(session));
  }

  function updateDetail(index: number, key: "bonos" | "descuentos" | "empleadoId" | "sueldoBase", value: string) {
    setForm((current) => ({
      ...current,
      detalles: updatePayrollDetailValue(current.detalles, index, key, value),
    }));
  }

  function addDetailRow() {
    setForm((current) => ({
      ...current,
      detalles: addPayrollDetail(current.detalles),
    }));
  }

  function removeDetailRow(index: number) {
    setForm((current) => ({
      ...current,
      detalles:
        current.detalles.length > 1
          ? removePayrollDetail(current.detalles, index)
          : current.detalles,
    }));
  }

  async function submitPayroll() {
    const validationError = validatePayrollForm(form, scope);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      await payrollService.create(
        buildCreatePayrollPayload(form, scope),
        session.apiToken,
      );
      setNotice("Planilla generada.");
      resetForm();
      await loadPayrolls();
      return true;
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function openPayrollDetail(payrollId: number) {
    setIsLoadingDetails(true);
    setError("");

    try {
      const response = await payrollService.get(payrollId, session.apiToken);
      setDetailPayroll(response);
    } catch (detailError) {
      setError(getErrorMessage(detailError));
    } finally {
      setIsLoadingDetails(false);
    }
  }

  function closePayrollDetail() {
    setDetailPayroll(null);
  }

  return {
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
    resetForm,
    scope,
    setForm,
    submitPayroll,
    updateDetail,
    visiblePayrolls,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
