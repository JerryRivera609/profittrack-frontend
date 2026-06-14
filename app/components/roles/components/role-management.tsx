"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useRoles } from "../hooks/use-roles";
import { getRoleStats } from "../utils/role-format";
import { updateRoleFormValue } from "../utils/role-form";
import { RoleFormModal } from "./role-form-modal";
import { RoleList } from "./role-list";

export function RoleManagement() {
  const { session } = usePlatformAuth();
  const {
    activeRoles,
    closeDeleteModal,
    closeFormModal,
    closeReactivateModal,
    confirmDelete,
    confirmReactivate,
    deleteTarget,
    error,
    form,
    inactiveRoles,
    isDeleting,
    isLoading,
    isReactivating,
    isSaving,
    loadRoles,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    openReactivateModal,
    reactivateTarget,
    roles,
    scope,
    setForm,
    setStatusView,
    statusView,
    submitRole,
  } = useRoles(session);

  const stats = useMemo(
    () => getRoleStats(activeRoles, inactiveRoles),
    [activeRoles, inactiveRoles],
  );

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
              Nuevo rol
            </Button>
            <Button
              disabled={isLoading}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadRoles()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra los roles de empleados de todas las empresas con altas, ediciones, desactivacion y reactivacion."
            : `Administra los roles de empleados de ${session.companyName ?? "tu empresa"} con altas, ediciones, desactivacion y reactivacion.`
        }
        eyebrow="Sistema"
        stats={stats}
        title="Roles de empleados"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar roles hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <RoleList
            activeCount={activeRoles.length}
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            inactiveCount={inactiveRoles.length}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            onReactivate={openReactivateModal}
            onStatusViewChange={setStatusView}
            roles={roles}
            statusView={statusView}
          />
        </div>
      </ModulePage>

      <RoleFormModal
        form={form}
        isSaving={isSaving}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => updateRoleFormValue(current, key, value))
        }
        onClose={closeFormModal}
        onSubmit={submitRole}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Desactivar rol"
        description={
          deleteTarget
            ? `Se desactivara ${deleteTarget.nombre} para que ya no este disponible como rol de empleado.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Desactivar ${deleteTarget.nombre}` : "Desactivar rol"}
      />

      <ConfirmModal
        confirmLabel="Reactivar rol"
        description={
          reactivateTarget
            ? `Se reactivara ${reactivateTarget.nombre} para volver a usarlo como rol de empleado.`
            : ""
        }
        isLoading={isReactivating}
        onClose={closeReactivateModal}
        onConfirm={() => void confirmReactivate()}
        open={Boolean(reactivateTarget)}
        title={reactivateTarget ? `Reactivar ${reactivateTarget.nombre}` : "Reactivar rol"}
      />
    </>
  );
}
