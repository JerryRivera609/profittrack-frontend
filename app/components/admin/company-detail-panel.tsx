"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../lib/api";
import type { Empresa } from "../../types/domain";
import { Button } from "../ui/button";
import { Panel } from "../ui/panel";
import { StatusMessage } from "../ui/status-message";
import { Users, FolderKanban, Plus, X, ShieldAlert } from "lucide-react";

type CompanyDetailPanelProps = {
  empresa: Empresa;
  apiToken?: string;
  onClose: () => void;
};

type EmpleadoResponse = {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  nombreRol?: string;
  activo: boolean;
};

type ProyectoResponse = {
  id: number;
  codigo: string;
  nombre: string;
  estado: string;
};

type RolResponse = {
  id: number;
  nombre: string;
};

export function CompanyDetailPanel({
  empresa,
  apiToken,
  onClose,
}: CompanyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"empleados" | "proyectos">("empleados");
  const [empleados, setEmpleados] = useState<EmpleadoResponse[]>([]);
  const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [rolId, setRolId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDetails = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [empleadosData, proyectosData, rolesData] = await Promise.all([
        adminApi.listarEmpleados(empresa.id, apiToken),
        adminApi.listarProyectos(empresa.id, apiToken),
        adminApi.listarRoles(empresa.id, apiToken),
      ]);
      setEmpleados(empleadosData ?? []);
      setProyectos(proyectosData ?? []);
      setRoles(rolesData ?? []);
    } catch (err: any) {
      setError(err?.message || "No se pudo cargar los detalles de la empresa.");
    } finally {
      setIsLoading(false);
    }
  }, [empresa.id, apiToken]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const payload = {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        contrasenia: contrasenia,
        rolId: rolId ? Number(rolId) : undefined,
        fechaIngreso: new Date().toISOString().split("T")[0],
      };

      await adminApi.crearEmpleado(empresa.id, payload, apiToken);
      setNotice("Empleado agregado exitosamente a la empresa.");
      
      // Limpiar Form
      setNombres("");
      setApellidos("");
      setCorreo("");
      setContrasenia("");
      setRolId("");
      setShowAddForm(false);

      // Recargar
      await loadDetails();
    } catch (err: any) {
      setError(err?.message || "Error al crear el empleado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel className="border-slate-300 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
            Empresa Seleccionada
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{empresa.nombre}</h3>
          <p className="text-xs text-slate-500">RUC: {empresa.ruc} | {empresa.direccion}</p>
        </div>
        <Button
          aria-label="Cerrar Panel"
          icon={<X className="size-4" />}
          onClick={onClose}
          variant="secondary"
        />
      </div>

      <StatusMessage message={notice} />
      <StatusMessage message={error} tone="error" />

      {/* Tabs */}
      <div className="mt-4 flex border-b border-slate-200">
        <button
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "empleados"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("empleados")}
        >
          <Users className="size-4" />
          Miembros / Personal ({empleados.length})
        </button>
        <button
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "proyectos"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("proyectos")}
        >
          <FolderKanban className="size-4" />
          Proyectos Activos ({proyectos.length})
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-slate-500">
          Cargando datos de la empresa...
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {activeTab === "empleados" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-700">Miembros Registrados</h4>
                <Button
                  icon={<Plus className="size-4" />}
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="primary"
                >
                  {showAddForm ? "Cancelar" : "Nuevo Miembro"}
                </Button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddEmployee} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">Crear Cuenta de Empleado</h5>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Nombres</label>
                      <input
                        required
                        type="text"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                        placeholder="Ej. Juan Carlos"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Apellidos</label>
                      <input
                        required
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                        placeholder="Ej. Pérez"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Correo Electrónico</label>
                      <input
                        required
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                        placeholder="ejemplo@empresa.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Contraseña Inicial</label>
                      <input
                        required
                        type="password"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Cargo / Rol Interno</label>
                    <select
                      value={rolId}
                      onChange={(e) => setRolId(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                    >
                      <option value="">Selecciona un rol (Opcional)...</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary">
                      {isSubmitting ? "Registrando..." : "Confirmar Registro"}
                    </Button>
                  </div>
                </form>
              )}

              {!empleados.length ? (
                <div className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-slate-500">
                  Esta empresa aún no cuenta con empleados registrados en su portal.
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <table className="min-w-full text-left text-sm divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                      <tr>
                        <th className="px-4 py-2">Nombre Completo</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Cargo / Rol</th>
                        <th className="px-4 py-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empleados.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-medium text-slate-800">
                            {emp.nombres} {emp.apellidos}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">{emp.correo}</td>
                          <td className="px-4 py-2.5 text-slate-600">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
                              {emp.nombreRol || "Desarrollador / Sin Rol"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block size-2 rounded-full ${emp.activo ? "bg-emerald-500" : "bg-slate-300"}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "proyectos" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Proyectos Activos de la Empresa</h4>
              
              {!proyectos.length ? (
                <div className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-slate-500">
                  No hay proyectos activos registrados para esta empresa todavía.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {proyectos.map((proy) => (
                    <div key={proy.id} className="rounded-lg border border-slate-200 bg-white p-3 hover:border-teal-300 shadow-sm transition">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {proy.codigo}
                        </span>
                        <span className="text-xs text-teal-600 font-medium">{proy.estado}</span>
                      </div>
                      <h5 className="mt-2 text-sm font-bold text-slate-900">{proy.nombre}</h5>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
