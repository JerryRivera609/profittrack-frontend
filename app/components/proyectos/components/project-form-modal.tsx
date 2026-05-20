"use client";

import {
  CalendarDays,
  DollarSign,
  FileCode2,
  FileText,
  FolderKanban,
  Percent,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import type {
  ProjectCatalogOption,
  ProjectFormValues,
  ProjectModalState,
  ProjectScope,
} from "../types/project";
import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { SmartSelectField } from "../../ui/smart-select-field";
import { TextField } from "../../ui/text-field";

type ProjectFormModalProps = {
  clientOptions: ProjectCatalogOption[];
  form: ProjectFormValues;
  isLoadingCatalogs: boolean;
  isSaving: boolean;
  leaderOptions: ProjectCatalogOption[];
  modalState: ProjectModalState;
  onChange: <Key extends keyof ProjectFormValues>(
    key: Key,
    value: ProjectFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  serviceTypeOptions: ProjectCatalogOption[];
  scope: ProjectScope;
};

export function ProjectFormModal({
  clientOptions,
  form,
  isLoadingCatalogs,
  isSaving,
  leaderOptions,
  modalState,
  onChange,
  onClose,
  onSubmit,
  serviceTypeOptions,
  scope,
}: ProjectFormModalProps) {
  const isEdit = modalState.mode === "edit";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <Modal onClose={onClose} open={modalState.open} size="xl">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {isEdit ? "Actualizacion de proyecto" : "Alta de proyecto"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar proyecto" : "Registrar proyecto"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Completa los datos comerciales, operativos y financieros del proyecto.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scope.isAdmin ? (
              <TextField
                icon={<ShieldCheck className="size-4" />}
                label="Empresa ID"
                min="1"
                onChange={(event) => onChange("empresaId", event.target.value)}
                required
                type="number"
                value={form.empresaId}
              />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-medium uppercase text-slate-400">Empresa</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {scope.session.companyName ?? "Empresa asignada"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ID {scope.sessionEmpresaId ?? "sin asignar"}
                </p>
              </div>
            )}

            <SmartSelectField
              disabled={isLoadingCatalogs || clientOptions.length === 0}
              helperText="Selecciona el cliente sin exponer el ID."
              icon={<UsersRound className="size-4" />}
              label="Cliente"
              onChange={(selectedValue) => onChange("clienteId", selectedValue)}
              options={clientOptions}
              placeholder={
                isLoadingCatalogs ? "Cargando clientes..." : "Selecciona un cliente"
              }
              required
              value={form.clienteId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || serviceTypeOptions.length === 0}
              helperText="Selecciona el tipo de servicio asociado."
              icon={<FolderKanban className="size-4" />}
              label="Tipo de servicio"
              onChange={(selectedValue) => onChange("tipoServicioId", selectedValue)}
              options={serviceTypeOptions}
              placeholder={
                isLoadingCatalogs
                  ? "Cargando tipos..."
                  : "Selecciona un tipo de servicio"
              }
              required
              value={form.tipoServicioId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || leaderOptions.length === 0}
              helperText="Selecciona el lider del proyecto."
              icon={<UserRound className="size-4" />}
              label="Lider"
              onChange={(selectedValue) => onChange("liderEmpleadoId", selectedValue)}
              options={leaderOptions}
              placeholder={
                isLoadingCatalogs ? "Cargando lideres..." : "Selecciona un lider"
              }
              required
              value={form.liderEmpleadoId}
            />
            <TextField
              icon={<FileCode2 className="size-4" />}
              label="Codigo"
              onChange={(event) => onChange("codigo", event.target.value)}
              required
              value={form.codigo}
            />
            <TextField
              icon={<FolderKanban className="size-4" />}
              label="Nombre"
              onChange={(event) => onChange("nombre", event.target.value)}
              required
              value={form.nombre}
            />
            <TextField
              className="xl:col-span-3"
              icon={<FileText className="size-4" />}
              label="Descripcion"
              onChange={(event) => onChange("descripcion", event.target.value)}
              required
              value={form.descripcion}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Inicio planificado"
              onChange={(event) => onChange("fechaInicioPlanificada", event.target.value)}
              required
              type="date"
              value={form.fechaInicioPlanificada}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Fin planificado"
              onChange={(event) => onChange("fechaFinPlanificada", event.target.value)}
              required
              type="date"
              value={form.fechaFinPlanificada}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Inicio real"
              onChange={(event) => onChange("fechaInicioReal", event.target.value)}
              type="date"
              value={form.fechaInicioReal}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Fin real"
              onChange={(event) => onChange("fechaFinReal", event.target.value)}
              type="date"
              value={form.fechaFinReal}
            />
            <TextField
              icon={<FolderKanban className="size-4" />}
              label="Horas planificadas"
              min="0"
              onChange={(event) => onChange("horasPlanificadas", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.horasPlanificadas}
            />
            <TextField
              icon={<DollarSign className="size-4" />}
              label="Presupuesto planificado"
              min="0"
              onChange={(event) => onChange("presupuestoPlanificado", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.presupuestoPlanificado}
            />
            <TextField
              icon={<Percent className="size-4" />}
              label="Margen planificado"
              onChange={(event) => onChange("margenPlanificado", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.margenPlanificado}
            />
            <TextField
              icon={<DollarSign className="size-4" />}
              label="Precio de venta"
              min="0"
              onChange={(event) => onChange("precioVenta", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.precioVenta}
            />
            {isEdit ? (
              <TextField
                icon={<FolderKanban className="size-4" />}
                label="Estado"
                onChange={(event) => onChange("estado", event.target.value)}
                required
                value={form.estado}
              />
            ) : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button disabled={isSaving || (!scope.isAdmin && !scope.sessionEmpresaId)} type="submit">
            {isSaving
              ? "Guardando..."
              : isEdit
                ? "Actualizar proyecto"
                : "Crear proyecto"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
