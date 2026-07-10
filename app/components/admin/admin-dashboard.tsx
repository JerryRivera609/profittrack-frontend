"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi, empresasApi } from "../../lib/api";
import type { Empresa, EmpresaPayload } from "../../types/domain";
import { Button } from "../ui/button";
import { StatusMessage } from "../ui/status-message";
import { ToastMessage } from "../ui/toast-message";
import { CompanyForm } from "./company-form";
import { CompanyTable } from "./company-table";

type AdminDashboardProps = {
  apiToken?: string;
};

export function AdminDashboard({ apiToken }: AdminDashboardProps) {
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [savingResource, setSavingResource] = useState<"empresa" | null>(null);

  const sortedEmpresas = useMemo(
    () => [...empresas].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [empresas],
  );

  const loadResources = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const empresasResponse = await adminApi.listarEmpresas(apiToken);
      setEmpresas(empresasResponse ?? []);
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
        await adminApi.actualizarEmpresa(editingCompany.id, payload, apiToken);
        setNotice("Empresa actualizada.");
      } else {
        await adminApi.crearEmpresa(payload, apiToken);
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

  async function handleCompanyToggleStatus(empresa: Empresa) {
    setError("");
    setNotice("");

    try {
      const nuevoEstado = !empresa.activo;
      await adminApi.cambiarEstadoEmpresa(empresa.id, nuevoEstado, apiToken);
      setNotice(`Empresa "${empresa.nombre}" ${nuevoEstado ? "activada" : "desactivada"} correctamente.`);
      await loadResources();
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  }

  async function handleCompanyDelete(empresa: Empresa) {
    if (!window.confirm(`Eliminar empresa "${empresa.nombre}"?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await adminApi.eliminarEmpresa(empresa.id, apiToken);
      setNotice("Empresa eliminada.");
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
          <h2 className="text-2xl font-semibold tracking-tight font-sans">
            Gestión de Empresas
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

      <StatusMessage message={notice} />
      <StatusMessage message={error} tone="error" />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <CompanyForm
            key={editingCompany?.id ?? "new-company"}
            editingCompany={editingCompany}
            isSubmitting={savingResource === "empresa"}
            onCancelEdit={() => setEditingCompany(null)}
            onSubmit={handleCompanySubmit}
          />
        </div>
        <div className="xl:col-span-2">
          <CompanyTable
            empresas={sortedEmpresas}
            isLoading={isLoading}
            onDelete={handleCompanyDelete}
            onEdit={setEditingCompany}
            onToggleStatus={handleCompanyToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
