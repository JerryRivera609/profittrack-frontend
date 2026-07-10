"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../lib/api";
import type { Empresa } from "../../types/domain";
import { usePlatformAuth } from "../platform/platform-auth-context";
import { CompanyDetailPanel } from "./company-detail-panel";
import { Panel } from "../ui/panel";
import { UsersRound, Building2 } from "lucide-react";

export function SaaSUsersPage() {
  const { session } = usePlatformAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.listarEmpresas(session.apiToken);
      setEmpresas(response ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const selectedCompany = empresas.find(e => e.id === Number(selectedCompanyId));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">SaaS Global</p>
        <h2 className="text-2xl font-semibold tracking-tight">Administración de Usuarios y Personal</h2>
      </div>

      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="size-5 text-slate-400" />
              Selecciona una empresa para gestionar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Elige la organización del tenant para ver sus miembros o registrar nuevo personal.</p>
          </div>
          
          <select
            disabled={isLoading}
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full sm:max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="">Seleccionar empresa...</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre} {emp.activo ? "" : "(Inactiva)"}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {selectedCompany ? (
        <CompanyDetailPanel
          empresa={selectedCompany}
          apiToken={session.apiToken}
          onClose={() => setSelectedCompanyId("")}
        />
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center text-slate-500">
          <UsersRound className="size-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-700">Ninguna empresa seleccionada</h4>
          <p className="text-xs text-slate-500 mt-1">Usa el selector superior para cargar el listado de personal y poder administrar sus accesos.</p>
        </div>
      )}
    </div>
  );
}
