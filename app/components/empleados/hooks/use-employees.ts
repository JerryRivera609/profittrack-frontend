"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { employeeService } from "../services/employee-service";
import { validateEmployeeForm } from "../schema/employee-schema";
import type { Employee, EmployeeFormValues, EmployeeModalState } from "../types/employee";
import {
  buildCreateEmployeePayload,
  buildUpdateEmployeePayload,
  createEmployeeFormValues,
  createEmployeeScope,
} from "../utils/employee-form";
import { getVisibleEmployees } from "../utils/employee-format";

const closedModalState: EmployeeModalState = {
  employee: null,
  mode: "create",
  open: false,
};

export function useEmployees(session: Session) {
  const scope = useMemo(() => createEmployeeScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<EmployeeFormValues>(() =>
    createEmployeeFormValues(null, session),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<EmployeeModalState>(closedModalState);
  const [notice, setNotice] = useState("");

  const visibleEmployees = useMemo(
    () => getVisibleEmployees(employees, scope),
    [employees, scope],
  );

  const loadEmployees = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await employeeService.list(session.apiToken);
      setEmployees(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEmployees();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEmployees]);

  function openCreateModal() {
    setError("");
    setForm(createEmployeeFormValues(null, session));
    setModalState({
      employee: null,
      mode: "create",
      open: true,
    });
  }

  function openEditModal(employee: Employee) {
    setError("");
    setNotice("");
    setForm(createEmployeeFormValues(employee, session));
    setModalState({
      employee,
      mode: "edit",
      open: true,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createEmployeeFormValues(null, session));
  }

  function openDeleteModal(employee: Employee) {
    setDeleteTarget(employee);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function submitEmployee() {
    const validationError = validateEmployeeForm(form, modalState.employee, scope);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.employee) {
        await employeeService.update(
          modalState.employee.id,
          buildUpdateEmployeePayload(form),
          session.apiToken,
        );
        setNotice("Empleado actualizado.");
      } else {
        await employeeService.create(
          buildCreateEmployeePayload(form, scope),
          session.apiToken,
        );
        setNotice("Empleado creado.");
      }

      closeFormModal();
      await loadEmployees();
      return true;
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsDeleting(true);

    try {
      await employeeService.remove(deleteTarget.id, session.apiToken);
      setNotice("Empleado eliminado.");
      setDeleteTarget(null);
      await loadEmployees();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    closeDeleteModal,
    closeFormModal,
    confirmDelete,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isSaving,
    loadEmployees,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    scope,
    setForm,
    submitEmployee,
    visibleEmployees,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
