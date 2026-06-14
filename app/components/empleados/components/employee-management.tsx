"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import type { SmartSelectOption } from "../../ui/smart-select-field";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useEmployees } from "../hooks/use-employees";
import { getEmployeeStats, getEmployeeFullName } from "../utils/employee-format";
import { updateEmployeeFormValue } from "../utils/employee-form";
import { EmployeeFormModal } from "./employee-form-modal";
import { EmployeeList } from "./employee-list";

export function EmployeeManagement() {
  const { session } = usePlatformAuth();
  const {
    closeDeleteModal,
    closeFormModal,
    confirmDelete,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isLoadingRoles,
    isSaving,
    loadEmployees,
    loadRoles,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    roles,
    scope,
    setForm,
    submitEmployee,
    visibleEmployees,
  } = useEmployees(session);

  const stats = useMemo(() => getEmployeeStats(visibleEmployees), [visibleEmployees]);
  const roleOptions = useMemo<SmartSelectOption[]>(() => {
    const options = roles.map((role) => ({
      description: `${role.nombreEmpresa} - ID rol ${role.id}`,
      label: role.nombre,
      value: role.id.toString(),
    }));

    if (
      form.rolId &&
      modalState.employee &&
      !options.some((option) => option.value === form.rolId)
    ) {
      return [
        {
          description: "Rol actual del empleado",
          label: modalState.employee.nombreRol,
          value: form.rolId,
        },
        ...options,
      ];
    }

    return options;
  }, [form.rolId, modalState.employee, roles]);

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Nuevo empleado
            </Button>
            <Button
              disabled={isLoading || isLoadingRoles}
              icon={
                <RefreshCw
                  className={isLoading || isLoadingRoles ? "size-4 animate-spin" : "size-4"}
                />
              }
              onClick={() => void Promise.all([loadEmployees(), loadRoles()])}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra empleados de todas las empresas con un flujo estandar de altas, ediciones y bajas."
            : `Administra el personal de ${session.companyName ?? "tu empresa"} con un flujo estandar de altas, ediciones y bajas.`
        }
        eyebrow="HH.HH"
        stats={stats}
        title="Empleados"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar empleados hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <EmployeeList
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            employees={visibleEmployees}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
          />
        </div>
      </ModulePage>

      <EmployeeFormModal
        form={form}
        isLoadingRoles={isLoadingRoles}
        isSaving={isSaving}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => {
            const nextForm = updateEmployeeFormValue(current, key, value);

            if (key === "empresaId" && current.empresaId !== value) {
              return {
                ...nextForm,
                rolId: "",
              };
            }

            return nextForm;
          })
        }
        onClose={closeFormModal}
        onSubmit={submitEmployee}
        roleOptions={roleOptions}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Eliminar empleado"
        description={
          deleteTarget
            ? `Se eliminara a ${getEmployeeFullName(deleteTarget)} del registro de personal.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar a ${getEmployeeFullName(deleteTarget)}` : "Eliminar empleado"}
      />
    </>
  );
}
