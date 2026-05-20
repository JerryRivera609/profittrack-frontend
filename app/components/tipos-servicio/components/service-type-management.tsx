"use client";

import { Plus, RefreshCw, Settings } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { useServiceTypes } from "../hooks/use-service-types";
import { getServiceTypeStats } from "../utils/service-type-format";
import { updateServiceTypeFormValue } from "../utils/service-type-form";
import { ServiceTypeFormModal } from "./service-type-form-modal";
import { ServiceTypeList } from "./service-type-list";

export function ServiceTypeManagement() {
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
    isSaving,
    loadServiceTypes,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    scope,
    serviceTypes,
    setForm,
    submitServiceType,
  } = useServiceTypes(session);

  const stats = useMemo(() => getServiceTypeStats(serviceTypes), [serviceTypes]);

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Nuevo tipo
            </Button>
            <Button
              disabled={isLoading}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadServiceTypes()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra el catalogo de tipos de servicio de todas las empresas con un flujo estandar de altas, ediciones y bajas."
            : `Administra los tipos de servicio de ${session.companyName ?? "tu empresa"} con un flujo estandar de altas, ediciones y bajas.`
        }
        eyebrow="Sistema"
        stats={stats}
        title="Tipos de servicio"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar tipos de servicio hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <ServiceTypeList
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            serviceTypes={serviceTypes}
          />
        </div>
      </ModulePage>

      <ServiceTypeFormModal
        form={form}
        isSaving={isSaving}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => updateServiceTypeFormValue(current, key, value))
        }
        onClose={closeFormModal}
        onSubmit={submitServiceType}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Eliminar tipo"
        description={
          deleteTarget
            ? `Se eliminara ${deleteTarget.nombre} del catalogo de tipos de servicio.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar tipo"}
      />
    </>
  );
}
