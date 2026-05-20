"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { validateClientForm } from "../schema/client-schema";
import { clientService } from "../services/client-service";
import type { Client, ClientFormValues, ClientModalState } from "../types/client";
import {
  buildCreateClientPayload,
  buildUpdateClientPayload,
  createClientFormValues,
  createClientScope,
} from "../utils/client-form";
import { getVisibleClients } from "../utils/client-format";

const closedModalState: ClientModalState = {
  client: null,
  mode: "create",
  open: false,
};

export function useClients(session: Session) {
  const scope = useMemo(() => createClientScope(session), [session]);
  const [clients, setClients] = useState<Client[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ClientFormValues>(() =>
    createClientFormValues(null, session),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<ClientModalState>(closedModalState);
  const [notice, setNotice] = useState("");

  const visibleClients = useMemo(
    () => getVisibleClients(clients, scope),
    [clients, scope],
  );

  const loadClients = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await clientService.list(session.apiToken);
      setClients(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClients();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadClients]);

  function openCreateModal() {
    setError("");
    setForm(createClientFormValues(null, session));
    setModalState({
      client: null,
      mode: "create",
      open: true,
    });
  }

  function openEditModal(client: Client) {
    setError("");
    setNotice("");
    setForm(createClientFormValues(client, session));
    setModalState({
      client,
      mode: "edit",
      open: true,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createClientFormValues(null, session));
  }

  function openDeleteModal(client: Client) {
    setDeleteTarget(client);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function submitClient() {
    const validationError = validateClientForm(form, modalState.client, scope);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.client) {
        await clientService.update(
          modalState.client.id,
          buildUpdateClientPayload(form),
          session.apiToken,
        );
        setNotice("Cliente actualizado.");
      } else {
        await clientService.create(
          buildCreateClientPayload(form, scope),
          session.apiToken,
        );
        setNotice("Cliente creado.");
      }

      closeFormModal();
      await loadClients();
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
      await clientService.remove(deleteTarget.id, session.apiToken);
      setNotice("Cliente eliminado.");
      setDeleteTarget(null);
      await loadClients();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    clients: visibleClients,
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
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
