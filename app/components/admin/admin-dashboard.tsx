"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dueniosApi, empresasApi } from "../../lib/api";
import type {
  Duenio,
  DuenioPayload,
  DuenioUpdatePayload,
  Empresa,
  EmpresaPayload,
} from "../../types/domain";
import { Button } from "../ui/button";
import { StatusMessage } from "../ui/status-message";
import { ToastMessage } from "../ui/toast-message";
import { AdminSummary } from "./admin-summary";
import { CompanyForm } from "./company-form";
import { CompanyTable } from "./company-table";
import { OwnerForm } from "./owner-form";
import { OwnerTable } from "./owner-table";

type AdminDashboardProps = {
  apiToken?: string;
};

export function AdminDashboard({ apiToken }: AdminDashboardProps) {
  const [duenios, setDuenios] = useState<Duenio[]>([]);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [editingOwner, setEditingOwner] = useState<Duenio | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [savingResource, setSavingResource] = useState<
    "empresa" | "duenio" | null
  >(null);

  const sortedEmpresas = useMemo(
    () => [...empresas].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [empresas],
  );

  const sortedDuenios = useMemo(
    () =>
      [...duenios].sort((a, b) =>
        `${a.nombres} ${a.apellidos}`.localeCompare(
          `${b.nombres} ${b.apellidos}`,
        ),
      ),
    [duenios],
  );

  const loadResources = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const [empresasResponse, dueniosResponse] = await Promise.all([
        empresasApi.list(apiToken),
        dueniosApi.list(apiToken),
      ]);

      setEmpresas(empresasResponse ?? []);
      setDuenios(dueniosResponse ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadResources();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadResources]);

  async function handleCompanySubmit(payload: EmpresaPayload) {
    setError("");
    setNotice("");
    setSavingResource("empresa");

    try {
      if (editingCompany) {
        await empresasApi.update(editingCompany.id, payload, apiToken);
        setNotice("Empresa actualizada.");
      } else {
        await empresasApi.create(payload, apiToken);
        setNotice("Empresa creada.");
      }

      setEditingCompany(null);
      await loadResources();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSavingResource(null);
    }
  }

  async function handleOwnerSubmit(
    payload: DuenioPayload | DuenioUpdatePayload,
  ) {
    setError("");
    setNotice("");
    setSavingResource("duenio");

    try {
      if (editingOwner) {
        await dueniosApi.update(editingOwner.id, payload, apiToken);
        setNotice("Owner actualizado.");
      } else {
        await dueniosApi.create(payload as DuenioPayload, apiToken);
        setNotice("Owner creado y asignado.");
      }

      setEditingOwner(null);
      await loadResources();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSavingResource(null);
    }
  }

  async function handleCompanyDelete(empresa: Empresa) {
    if (!window.confirm(`Eliminar empresa "${empresa.nombre}"?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await empresasApi.remove(empresa.id, apiToken);
      setNotice("Empresa eliminada.");
      await loadResources();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  async function handleOwnerDelete(duenio: Duenio) {
    if (!window.confirm(`Eliminar owner "${duenio.nombres}"?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await dueniosApi.remove(duenio.id, apiToken);
      setNotice("Owner eliminado.");
      await loadResources();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <div className="space-y-5">
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">Panel admin</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Registro operacional
          </h2>
        </div>
        <Button
          disabled={isLoading}
          icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
          onClick={() => void loadResources()}
          variant="secondary"
        >
          Actualizar
        </Button>
      </div>

      <AdminSummary duenios={duenios} empresas={empresas} />
      <StatusMessage message={notice} />
      <StatusMessage message={error} tone="error" />

      <div className="grid gap-5 xl:grid-cols-2">
        <CompanyForm
          key={editingCompany?.id ?? "new-company"}
          editingCompany={editingCompany}
          isSubmitting={savingResource === "empresa"}
          onCancelEdit={() => setEditingCompany(null)}
          onSubmit={handleCompanySubmit}
        />
        <OwnerForm
          key={editingOwner?.id ?? "new-owner"}
          editingOwner={editingOwner}
          empresas={sortedEmpresas}
          isSubmitting={savingResource === "duenio"}
          onCancelEdit={() => setEditingOwner(null)}
          onSubmit={handleOwnerSubmit}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <CompanyTable
          empresas={sortedEmpresas}
          isLoading={isLoading}
          onDelete={handleCompanyDelete}
          onEdit={setEditingCompany}
        />
        <OwnerTable
          duenios={sortedDuenios}
          empresas={sortedEmpresas}
          isLoading={isLoading}
          onDelete={handleOwnerDelete}
          onEdit={setEditingOwner}
        />
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
