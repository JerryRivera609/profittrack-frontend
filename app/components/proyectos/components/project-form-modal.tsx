"use client";

import {
  CalendarDays,
  DollarSign,
  FileCode2,
  FileText,
  FolderKanban,
  Pencil,
  Percent,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type {
  ProjectCatalogOption,
  ProjectFormValues,
  ProjectModalState,
  ProjectScope,
} from "../types/project";
import { cn } from "../../../lib/class-names";
import { Button } from "../../ui/button";
import { CalendarField } from "../../ui/calendar-field";
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
  const [isManualMargin, setIsManualMargin] = useState(false);

  const computedMarginAmount = useMemo(() => {
    const plannedCost = Number.parseFloat(form.presupuestoPlanificado || "0");
    const salePrice = Number.parseFloat(form.precioVenta || "0");

    if (!Number.isFinite(plannedCost) || !Number.isFinite(salePrice)) {
      return 0;
    }

    return salePrice - plannedCost;
  }, [form.precioVenta, form.presupuestoPlanificado]);

  const computedMarginPercentage = useMemo(() => {
    const salePrice = Number.parseFloat(form.precioVenta || "0");

    if (!Number.isFinite(salePrice) || salePrice <= 0) {
      return 0;
    }

    return (computedMarginAmount / salePrice) * 100;
  }, [computedMarginAmount, form.precioVenta]);

  useEffect(() => {
    if (modalState.open) {
      setIsManualMargin(false);
    }
  }, [modalState.open, modalState.project?.id]);

  useEffect(() => {
    if (isManualMargin) {
      return;
    }

    const nextMargin = formatDecimalValue(computedMarginAmount);

    if (form.margenPlanificado !== nextMargin) {
      onChange("margenPlanificado", nextMargin);
    }
  }, [
    computedMarginAmount,
    form.margenPlanificado,
    isManualMargin,
    onChange,
  ]);

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
            <CalendarField
              icon={<CalendarDays className="size-4" />}
              helperText="Fecha prevista para iniciar el proyecto."
              label="Inicio planificado"
              onChange={(selectedValue) =>
                onChange("fechaInicioPlanificada", selectedValue)
              }
              placeholder="Selecciona el inicio planificado"
              required
              value={form.fechaInicioPlanificada}
            />
            <CalendarField
              icon={<CalendarDays className="size-4" />}
              helperText="Fecha prevista de cierre."
              label="Fin planificado"
              onChange={(selectedValue) =>
                onChange("fechaFinPlanificada", selectedValue)
              }
              placeholder="Selecciona el fin planificado"
              required
              value={form.fechaFinPlanificada}
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
              icon={<DollarSign className="size-4" />}
              label="Precio de venta"
              min="0"
              onChange={(event) => onChange("precioVenta", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.precioVenta}
            />
            <label className="block text-sm font-medium text-slate-700">
              <span className="flex items-center justify-between gap-3">
                <span>Margen planificado</span>
                <button
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition",
                    isManualMargin
                      ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                  )}
                  onClick={() => setIsManualMargin((current) => !current)}
                  type="button"
                >
                  <Pencil className="size-3.5" />
                  {isManualMargin ? "Manual" : "Auto"}
                </button>
              </span>
              <span className="mt-1.5 flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                <Percent className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  onChange={(event) => onChange("margenPlanificado", event.target.value)}
                  required
                  step="0.01"
                  type="number"
                  value={form.margenPlanificado}
                />
              </span>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                {isManualMargin
                  ? "Modo manual activo. Puedes ajustar el margen a mano."
                  : `Calculado automatico: utilidad S/ ${formatDecimalValue(computedMarginAmount)} · margen ${formatDecimalValue(computedMarginPercentage)}%`}
              </span>
            </label>
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

function formatDecimalValue(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}
