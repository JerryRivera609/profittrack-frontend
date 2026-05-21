"use client";

import { BriefcaseBusiness, Trash2, UserRoundPlus, UsersRound } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { TextField } from "../../ui/text-field";
import type {
  Project,
  ProjectCatalogOption,
  ProjectEmployeeAssignment,
  ProjectEmployeeAssignmentFormValues,
} from "../types/project";
import { formatAssignmentDate } from "../utils/project-employee-format";

type ProjectEmployeesModalProps = {
  assignments: ProjectEmployeeAssignment[];
  employeeOptions: ProjectCatalogOption[];
  error: string;
  form: ProjectEmployeeAssignmentFormValues;
  isAssigning: boolean;
  isLoading: boolean;
  isRemoving: boolean;
  notice: string;
  onChange: <Key extends keyof ProjectEmployeeAssignmentFormValues>(
    key: Key,
    value: ProjectEmployeeAssignmentFormValues[Key],
  ) => void;
  onClose: () => void;
  onRemove: (assignment: ProjectEmployeeAssignment) => void;
  onSubmit: () => void;
  project: Project | null;
};

export function ProjectEmployeesModal({
  assignments,
  employeeOptions,
  error,
  form,
  isAssigning,
  isLoading,
  isRemoving,
  notice,
  onChange,
  onClose,
  onRemove,
  onSubmit,
  project,
}: ProjectEmployeesModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <Modal onClose={onClose} open={Boolean(project)} size="xl">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <div>
            <p className="text-sm font-medium text-slate-500">Equipo del proyecto</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {project ? project.nombre : "Asignar empleados"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Asigna colaboradores y define el rol que cumpliran dentro del proyecto.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
              <SmartSelectField
                disabled={isAssigning || employeeOptions.length === 0}
                helperText="Selecciona el colaborador que se sumara al proyecto."
                icon={<UsersRound className="size-4" />}
                label="Empleado"
                onChange={(selectedValue) => onChange("empleadoId", selectedValue)}
                options={employeeOptions}
                placeholder="Selecciona un empleado"
                required
                value={form.empleadoId}
              />
              <TextField
                icon={<BriefcaseBusiness className="size-4" />}
                label="Rol asignado"
                onChange={(event) => onChange("rolAsignado", event.target.value)}
                placeholder="Ej. Backend, QA, Lider tecnico"
                required
                value={form.rolAsignado}
              />
              <Button
                className="md:min-w-36"
                disabled={isAssigning || !project}
                icon={<UserRoundPlus className="size-4" />}
                type="submit"
              >
                {isAssigning ? "Asignando..." : "Asignar"}
              </Button>
            </div>

            <StatusMessage message={notice} />
            <StatusMessage message={error} tone="error" />

            {isLoading ? (
              <EmptyState
                description="Estamos cargando los colaboradores asignados a este proyecto."
                icon={<UsersRound className="size-6" />}
                title="Cargando equipo..."
              />
            ) : assignments.length === 0 ? (
              <EmptyState
                description="Cuando asignes el primer empleado, aparecera aqui con su rol, costo congelado y fecha."
                icon={<UsersRound className="size-6" />}
                title="No hay empleados asignados"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 font-medium">Empleado</th>
                      <th className="py-3 pr-4 font-medium">Rol</th>
                      <th className="py-3 pr-4 font-medium">Asignacion</th>
                      <th className="py-3 pr-4 font-medium">Costo hora</th>
                      <th className="py-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr className="border-b border-slate-100 align-top" key={assignment.id}>
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-slate-900">
                            {assignment.empleadoNombre}
                          </p>
                          <p className="text-xs text-slate-400">ID {assignment.empleadoId}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {assignment.rolAsignado}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {formatAssignmentDate(assignment.fechaAsignacion)}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {assignment.costoHoraCongelado}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            disabled={isRemoving}
                            icon={<Trash2 className="size-4" />}
                            onClick={() => onRemove(assignment)}
                            type="button"
                            variant="danger"
                          >
                            Quitar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} type="button" variant="secondary">
            Cerrar
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
