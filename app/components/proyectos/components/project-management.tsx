"use client";

import { FolderKanban, Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { useProjects } from "../hooks/use-projects";
import { getProjectStats } from "../utils/project-format";
import { updateProjectFormValue } from "../utils/project-form";
import { ProjectFormModal } from "./project-form-modal";
import { ProjectList } from "./project-list";

export function ProjectManagement() {
  const { session } = usePlatformAuth();
  const {
    closeDeleteModal,
    closeFormModal,
    closeLifecycleModal,
    confirmLifecycleAction,
    confirmDelete,
    deleteTarget,
    error,
    form,
    clientOptions,
    isDeleting,
    isLoadingCatalogs,
    isLoading,
    isSaving,
    leaderOptions,
    lifecycleTarget,
    loadProjects,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    openLifecycleModal,
    projects,
    serviceTypeOptions,
    scope,
    setForm,
    submitProject,
  } = useProjects(session);

  const stats = useMemo(() => getProjectStats(projects), [projects]);

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Nuevo proyecto
            </Button>
            <Button
              disabled={isLoading}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadProjects()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra proyectos de todas las empresas con un flujo estandar de altas, ediciones y bajas."
            : `Administra los proyectos de ${session.companyName ?? "tu empresa"} con un flujo estandar de altas, ediciones y bajas.`
        }
        eyebrow="Project Management"
        stats={stats}
        title="Proyectos"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar proyectos hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <ProjectList
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            onLifecycleAction={openLifecycleModal}
            projects={projects}
          />
        </div>
      </ModulePage>

      <ProjectFormModal
        clientOptions={clientOptions}
        form={form}
        isLoadingCatalogs={isLoadingCatalogs}
        isSaving={isSaving}
        leaderOptions={leaderOptions}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => updateProjectFormValue(current, key, value))
        }
        onClose={closeFormModal}
        onSubmit={submitProject}
        serviceTypeOptions={serviceTypeOptions}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Eliminar proyecto"
        description={
          deleteTarget
            ? `Se eliminara ${deleteTarget.nombre} del portafolio de proyectos.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar proyecto"}
      />

      <ConfirmModal
        confirmLabel={
          lifecycleTarget?.action === "start"
            ? "Iniciar proyecto"
            : "Finalizar proyecto"
        }
        description={
          lifecycleTarget
            ? lifecycleTarget.action === "start"
              ? `Se registrara el inicio real de ${lifecycleTarget.project.nombre} con la fecha de hoy.`
              : `Se registrara el cierre real de ${lifecycleTarget.project.nombre} con la fecha de hoy.`
            : ""
        }
        isLoading={isSaving}
        onClose={closeLifecycleModal}
        onConfirm={() => void confirmLifecycleAction()}
        open={Boolean(lifecycleTarget)}
        title={
          lifecycleTarget
            ? lifecycleTarget.action === "start"
              ? `Iniciar ${lifecycleTarget.project.nombre}`
              : `Finalizar ${lifecycleTarget.project.nombre}`
            : "Confirmar accion"
        }
      />
    </>
  );
}
