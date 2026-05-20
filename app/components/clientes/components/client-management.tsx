"use client";

import { Building2, Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { useClients } from "../hooks/use-clients";
import { getClientStats } from "../utils/client-format";
import { updateClientFormValue } from "../utils/client-form";
import { ClientFormModal } from "./client-form-modal";
import { ClientList } from "./client-list";

export function ClientManagement() {
  const { session } = usePlatformAuth();
  const {
    clients,
    closeDeleteModal,
    closeFormModal,
    confirmDelete,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isSaving,
    loadClients,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    scope,
    setForm,
    submitClient,
  } = useClients(session);

  const stats = useMemo(() => getClientStats(clients), [clients]);

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Nuevo cliente
            </Button>
            <Button
              disabled={isLoading}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadClients()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra la cartera de clientes de todas las empresas con un flujo estandar de altas, ediciones y bajas."
            : `Administra la cartera comercial de ${session.companyName ?? "tu empresa"} con un flujo estandar de altas, ediciones y bajas.`
        }
        eyebrow="CRM operativo"
        stats={stats}
        title="Clientes"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar clientes hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <ClientList
            clients={clients}
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
          />
        </div>
      </ModulePage>

      <ClientFormModal
        form={form}
        isSaving={isSaving}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => updateClientFormValue(current, key, value))
        }
        onClose={closeFormModal}
        onSubmit={submitClient}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Eliminar cliente"
        description={
          deleteTarget
            ? `Se eliminara a ${deleteTarget.razonSocial} de la cartera registrada.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar ${deleteTarget.razonSocial}` : "Eliminar cliente"}
      />
    </>
  );
}
