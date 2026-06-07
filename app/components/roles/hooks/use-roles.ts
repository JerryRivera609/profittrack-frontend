"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { validateRoleForm } from "../schema/role-schema";
import { roleService } from "../services/role-service";
import type {
  Role,
  RoleFormValues,
  RoleModalState,
  RoleStatusView,
} from "../types/role";
import {
  buildCreateRolePayload,
  buildUpdateRolePayload,
  createRoleFormValues,
  createRoleScope,
} from "../utils/role-form";
import { getVisibleRoles } from "../utils/role-format";

const closedModalState: RoleModalState = {
  mode: "create",
  open: false,
  role: null,
};

export function useRoles(session: Session) {
  const scope = useMemo(() => createRoleScope(session), [session]);
  const [activeRoles, setActiveRoles] = useState<Role[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RoleFormValues>(() =>
    createRoleFormValues(null, session),
  );
  const [inactiveRoles, setInactiveRoles] = useState<Role[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<RoleModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [reactivateTarget, setReactivateTarget] = useState<Role | null>(null);
  const [statusView, setStatusView] = useState<RoleStatusView>("active");

  const visibleActiveRoles = useMemo(
    () => getVisibleRoles(activeRoles, scope),
    [activeRoles, scope],
  );
  const visibleInactiveRoles = useMemo(
    () => getVisibleRoles(inactiveRoles, scope),
    [inactiveRoles, scope],
  );

  const visibleRoles =
    statusView === "active" ? visibleActiveRoles : visibleInactiveRoles;

  const loadRoles = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const [rolesResponse, inactiveResponse] = await Promise.all([
        roleService.list(session.apiToken),
        roleService.listInactive(session.apiToken),
      ]);
      setActiveRoles(rolesResponse ?? []);
      setInactiveRoles(inactiveResponse ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRoles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRoles]);

  function openCreateModal() {
    setError("");
    setForm(createRoleFormValues(null, session));
    setModalState({
      mode: "create",
      open: true,
      role: null,
    });
  }

  function openEditModal(role: Role) {
    setError("");
    setNotice("");
    setForm(createRoleFormValues(role, session));
    setModalState({
      mode: "edit",
      open: true,
      role,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createRoleFormValues(null, session));
  }

  function openDeleteModal(role: Role) {
    setDeleteTarget(role);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  function openReactivateModal(role: Role) {
    setReactivateTarget(role);
    setError("");
    setNotice("");
  }

  function closeReactivateModal() {
    if (isReactivating) {
      return;
    }

    setReactivateTarget(null);
  }

  async function submitRole() {
    const validationError = validateRoleForm(form, modalState.role, scope);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.role) {
        await roleService.update(
          modalState.role.id,
          buildUpdateRolePayload(form),
          session.apiToken,
        );
        setNotice("Rol actualizado.");
      } else {
        await roleService.create(
          buildCreateRolePayload(form, scope),
          session.apiToken,
        );
        setNotice("Rol creado.");
        setStatusView("active");
      }

      closeFormModal();
      await loadRoles();
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
      await roleService.remove(deleteTarget.id, session.apiToken);
      setNotice("Rol desactivado.");
      setDeleteTarget(null);
      await loadRoles();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  async function confirmReactivate() {
    if (!reactivateTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsReactivating(true);

    try {
      await roleService.reactivate(reactivateTarget.id, session.apiToken);
      setNotice("Rol reactivado.");
      setReactivateTarget(null);
      setStatusView("active");
      await loadRoles();
    } catch (reactivateError) {
      setError(getErrorMessage(reactivateError));
    } finally {
      setIsReactivating(false);
    }
  }

  return {
    activeRoles: visibleActiveRoles,
    closeDeleteModal,
    closeFormModal,
    closeReactivateModal,
    confirmDelete,
    confirmReactivate,
    deleteTarget,
    error,
    form,
    inactiveRoles: visibleInactiveRoles,
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
    scope,
    setForm,
    setStatusView,
    statusView,
    submitRole,
    roles: visibleRoles,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
