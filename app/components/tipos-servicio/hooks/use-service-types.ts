"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { validateServiceTypeForm } from "../schema/service-type-schema";
import { serviceTypeService } from "../services/service-type-service";
import type {
  ServiceType,
  ServiceTypeFormValues,
  ServiceTypeModalState,
} from "../types/service-type";
import {
  buildCreateServiceTypePayload,
  buildUpdateServiceTypePayload,
  createServiceTypeFormValues,
  createServiceTypeScope,
} from "../utils/service-type-form";
import { getVisibleServiceTypes } from "../utils/service-type-format";

const closedModalState: ServiceTypeModalState = {
  mode: "create",
  open: false,
  serviceType: null,
};

export function useServiceTypes(session: Session) {
  const scope = useMemo(() => createServiceTypeScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<ServiceType | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ServiceTypeFormValues>(() =>
    createServiceTypeFormValues(null, session),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<ServiceTypeModalState>(
    closedModalState,
  );
  const [notice, setNotice] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const visibleServiceTypes = useMemo(
    () => getVisibleServiceTypes(serviceTypes, scope),
    [serviceTypes, scope],
  );

  const loadServiceTypes = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await serviceTypeService.list(session.apiToken);
      setServiceTypes(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadServiceTypes();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadServiceTypes]);

  function openCreateModal() {
    setError("");
    setForm(createServiceTypeFormValues(null, session));
    setModalState({
      mode: "create",
      open: true,
      serviceType: null,
    });
  }

  function openEditModal(serviceType: ServiceType) {
    setError("");
    setNotice("");
    setForm(createServiceTypeFormValues(serviceType, session));
    setModalState({
      mode: "edit",
      open: true,
      serviceType,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createServiceTypeFormValues(null, session));
  }

  function openDeleteModal(serviceType: ServiceType) {
    setDeleteTarget(serviceType);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function submitServiceType() {
    const validationError = validateServiceTypeForm(
      form,
      modalState.serviceType,
      scope,
    );

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.serviceType) {
        await serviceTypeService.update(
          modalState.serviceType.id,
          buildUpdateServiceTypePayload(form),
          session.apiToken,
        );
        setNotice("Tipo de servicio actualizado.");
      } else {
        await serviceTypeService.create(
          buildCreateServiceTypePayload(form, scope),
          session.apiToken,
        );
        setNotice("Tipo de servicio creado.");
      }

      closeFormModal();
      await loadServiceTypes();
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
      await serviceTypeService.remove(deleteTarget.id, session.apiToken);
      setNotice("Tipo de servicio eliminado.");
      setDeleteTarget(null);
      await loadServiceTypes();
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
    loadServiceTypes,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    scope,
    serviceTypes: visibleServiceTypes,
    setForm,
    submitServiceType,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
