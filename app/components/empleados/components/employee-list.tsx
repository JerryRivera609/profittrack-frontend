"use client";

import { Pencil, Trash2, UsersRound } from "lucide-react";
import type { Employee } from "../types/employee";
import { formatEmployeeDate, getEmployeeFullName } from "../utils/employee-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type EmployeeListProps = {
  companyLabel: string;
  employees: Employee[];
  isLoading: boolean;
  onDelete: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
};

export function EmployeeList({
  companyLabel,
  employees,
  isLoading,
  onDelete,
  onEdit,
}: EmployeeListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Listado</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Equipo registrado
          </h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <p className="text-xs font-medium uppercase text-slate-400">Empresa</p>
          <p className="text-sm font-semibold text-slate-900">{companyLabel}</p>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando los empleados registrados para esta vista."
            icon={<UsersRound className="size-6" />}
            title="Cargando empleados..."
          />
        ) : employees.length === 0 ? (
          <EmptyState
            description="Cuando registres el primer colaborador, aparecera aqui con sus datos y acciones."
            icon={<UsersRound className="size-6" />}
            title="No hay empleados registrados"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Empleado</th>
                  <th className="py-3 pr-4 font-medium">Rol</th>
                  <th className="py-3 pr-4 font-medium">Contacto</th>
                  <th className="py-3 pr-4 font-medium">Fechas</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr className="border-b border-slate-100 align-top" key={employee.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">
                        {getEmployeeFullName(employee)}
                      </p>
                      <p className="text-slate-500">Doc. {employee.numeroDocumento}</p>
                      <p className="text-xs text-slate-400">
                        {employee.nombreEmpresa} · ID {employee.id}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-800">{employee.nombreRol}</p>
                      <p className="text-slate-500">Rol ID {employee.rolId}</p>
                      <p className={employee.activo ? "text-emerald-700" : "text-rose-700"}>
                        {employee.activo ? "Activo" : "Inactivo"}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{employee.correo}</p>
                      <p>{employee.telefono}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Ingreso: {formatEmployeeDate(employee.fechaIngreso)}</p>
                      <p>Salida: {formatEmployeeDate(employee.fechaSalida)}</p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(employee)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(employee)}
                          variant="danger"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Panel>
  );
}
