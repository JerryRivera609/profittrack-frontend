"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock3,
  DollarSign,
  FileCode2,
  FileText,
  FolderKanban,
  ListChecks,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type {
  ProjectCatalogOption,
  ProjectFormValues,
  ProjectModalState,
  ProjectScope,
  ProjectStageFormValues,
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
import { StatusMessage } from "../../ui/status-message";
import { TextField } from "../../ui/text-field";

type ProjectFormModalProps = {
  clientOptions: ProjectCatalogOption[];
  error?: string;
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

type StageTemplate = {
  label: string;
  stages: Array<{
    descripcion: string;
    nombre: string;
    weight: number;
  }>;
};

export function ProjectFormModal({
  clientOptions,
  error,
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

  const plannedHours = useMemo(
    () => parseDecimalValue(form.horasPlanificadas),
    [form.horasPlanificadas],
  );
  const stagedHours = useMemo(
    () =>
      form.etapas.reduce(
        (total, stage) => total + parseDecimalValue(stage.horasPlanificadas),
        0,
      ),
    [form.etapas],
  );
  const stageHoursDifference = stagedHours - plannedHours;
  const hasStageHoursMismatch =
    form.etapas.length > 0 && Math.abs(stageHoursDifference) > 0.01;

  useEffect(() => {
    if (modalState.open) {
      const timeoutId = window.setTimeout(() => setIsManualMargin(false), 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
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

  function handleStagesChange(stages: ProjectStageFormValues[]) {
    onChange("etapas", stages);
  }

  function addStage() {
    handleStagesChange([...form.etapas, createBlankStage(form, form.etapas.length)]);
  }

  function updateStage<Key extends keyof ProjectStageFormValues>(
    index: number,
    key: Key,
    value: ProjectStageFormValues[Key],
  ) {
    handleStagesChange(
      form.etapas.map((stage, stageIndex) =>
        stageIndex === index ? { ...stage, [key]: value } : stage,
      ),
    );
  }

  function removeStage(index: number) {
    handleStagesChange(form.etapas.filter((_, stageIndex) => stageIndex !== index));
  }

  function moveStage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= form.etapas.length) {
      return;
    }

    const nextStages = [...form.etapas];
    const [stage] = nextStages.splice(index, 1);
    nextStages.splice(nextIndex, 0, stage);
    handleStagesChange(nextStages);
  }

  function applyStageTemplate(template: StageTemplate) {
    handleStagesChange(buildStagesFromTemplate(template.stages, form));
  }

  function syncStagePlan() {
    if (form.etapas.length === 0) {
      handleStagesChange(buildStagesFromTemplate(stageTemplates[0].stages, form));
      return;
    }

    handleStagesChange(redistributeStages(form.etapas, form));
  }

  return (
    <Modal onClose={onClose} open={modalState.open} size="2xl">
      <form className="flex max-h-[92vh] flex-col" onSubmit={handleSubmit}>
        <ModalHeader className="shrink-0 px-4 py-3 sm:px-5">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {isEdit ? "Actualizacion de proyecto" : "Alta de proyecto"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar proyecto" : "Registrar proyecto"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta los datos clave y arma las etapas con plantillas rapidas.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {error || hasStageHoursMismatch ? (
            <div className="mb-4 space-y-3">
              <StatusMessage message={error} tone="error" />
              {hasStageHoursMismatch ? (
                <StatusMessage
                  message={`Las horas del proyecto (${formatDecimalValue(plannedHours)} h) deben coincidir con la suma de etapas (${formatDecimalValue(stagedHours)} h).`}
                  tone="warning"
                />
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            <div className="xl:col-span-2">
              <TextField
                icon={<FileText className="size-4" />}
                label="Descripcion"
                onChange={(event) => onChange("descripcion", event.target.value)}
                placeholder="Opcional; se completa con el nombre si queda vacia"
                value={form.descripcion}
              />
            </div>
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
              <span className=" flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                <DollarSign className="size-4" />
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
            <CalendarField
              icon={<CalendarDays className="size-4" />}
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
              label="Fin planificado"
              onChange={(selectedValue) =>
                onChange("fechaFinPlanificada", selectedValue)
              }
              placeholder="Selecciona el fin planificado"
              required
              value={form.fechaFinPlanificada}
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

          {!isEdit ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-white p-2 text-slate-500 shadow-sm">
                    <ListChecks className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Etapas del proyecto
                    </p>
                    <p className="mt-1 max-w-2xl text-xs text-slate-500">
                      Puedes usar una plantilla para repartir horas, o agregar
                      etapas puntuales. El orden se calcula automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
                  {stageTemplates.map((template) => (
                    <button
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                      key={template.label}
                      onClick={() => applyStageTemplate(template)}
                      type="button"
                    >
                      <WandSparkles className="size-3.5" />
                      {template.label}
                    </button>
                  ))}
                  <button
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    onClick={addStage}
                    type="button"
                  >
                    <Plus className="size-3.5" />
                    Anadir etapa
                  </button>
                  <button
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={syncStagePlan}
                    type="button"
                  >
                    <Sparkles className="size-3.5" />
                    Ajustar horas
                  </button>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    Math.abs(stageHoursDifference) > 0.01
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-white text-slate-600",
                  )}
                >
                  <span className="font-semibold">{form.etapas.length} etapas</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>
                    {formatDecimalValue(stagedHours)} de{" "}
                    {formatDecimalValue(plannedHours)} h planificadas
                  </span>
                </div>
              </div>

              {form.etapas.length === 0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
                  Usa una plantilla para crear etapas en un clic, o anade una etapa
                  manual si el proyecto solo necesita un hito especifico.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {form.etapas.map((stage, index) => (
                    <div
                      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-2 xl:grid-cols-4 xl:items-end"
                      key={`project-stage-${index}`}
                    >
                      <div className="md:col-span-2 xl:col-span-2">
                        <TextField
                          icon={<FolderKanban className="size-4" />}
                          label={`Etapa ${index + 1}`}
                          onChange={(event) =>
                            updateStage(index, "nombre", event.target.value)
                          }
                          placeholder={`Etapa ${index + 1}`}
                          required
                          value={stage.nombre}
                        />
                      </div>
                      <div>
                        <TextField
                          icon={<Clock3 className="size-4" />}
                          label="Horas"
                          min="0"
                          onChange={(event) =>
                            updateStage(
                              index,
                              "horasPlanificadas",
                              event.target.value,
                            )
                          }
                          step="0.01"
                          type="number"
                          value={stage.horasPlanificadas}
                        />
                      </div>
                      <div className="flex items-end justify-end gap-1">
                        <button
                          aria-label="Subir etapa"
                          className="min-h-11 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={index === 0}
                          onClick={() => moveStage(index, -1)}
                          title="Subir etapa"
                          type="button"
                        >
                          <ArrowUp className="size-4" />
                        </button>
                        <button
                          aria-label="Bajar etapa"
                          className="min-h-11 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={index === form.etapas.length - 1}
                          onClick={() => moveStage(index, 1)}
                          title="Bajar etapa"
                          type="button"
                        >
                          <ArrowDown className="size-4" />
                        </button>
                        <button
                          aria-label="Eliminar etapa"
                          className="min-h-11 rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                          onClick={() => removeStage(index)}
                          title="Eliminar etapa"
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="md:col-span-2">
                        <TextField
                          icon={<FileText className="size-4" />}
                          label="Descripcion"
                          onChange={(event) =>
                            updateStage(index, "descripcion", event.target.value)
                          }
                          placeholder="Opcional"
                          value={stage.descripcion}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </ModalBody>

        <ModalFooter className="shrink-0 px-4 py-3 sm:px-5">
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

const stageTemplates: StageTemplate[] = [
  {
    label: "Etapa unica",
    stages: [
      {
        descripcion: "Ejecucion completa del alcance planificado.",
        nombre: "Ejecucion",
        weight: 1,
      },
    ],
  },
  {
    label: "3 etapas",
    stages: [
      {
        descripcion: "Alineamiento, alcance y preparacion del trabajo.",
        nombre: "Inicio",
        weight: 2,
      },
      {
        descripcion: "Desarrollo principal de las actividades del proyecto.",
        nombre: "Ejecucion",
        weight: 6,
      },
      {
        descripcion: "Validacion, cierre operativo y entrega final.",
        nombre: "Cierre",
        weight: 2,
      },
    ],
  },
  {
    label: "4 etapas",
    stages: [
      {
        descripcion: "Levantamiento de contexto, requerimientos y prioridades.",
        nombre: "Descubrimiento",
        weight: 2,
      },
      {
        descripcion: "Construccion o ejecucion del servicio acordado.",
        nombre: "Implementacion",
        weight: 4.5,
      },
      {
        descripcion: "Revision, ajustes y validacion con el cliente.",
        nombre: "Validacion",
        weight: 2.5,
      },
      {
        descripcion: "Entrega, transferencia y cierre administrativo.",
        nombre: "Entrega",
        weight: 1,
      },
    ],
  },
];

function createBlankStage(
  form: ProjectFormValues,
  index: number,
): ProjectStageFormValues {
  const remainingHours = Math.max(
    plannedHoursFromForm(form) - totalStageHours(form.etapas),
    0,
  );

  return {
    descripcion: "",
    horasPlanificadas: formatDecimalValue(remainingHours),
    nombre: `Etapa ${index + 1}`,
  };
}

function buildStagesFromTemplate(
  stages: StageTemplate["stages"],
  form: ProjectFormValues,
): ProjectStageFormValues[] {
  const hours = distributeHours(plannedHoursFromForm(form), stages);

  return stages.map((stage, index) => ({
    descripcion: stage.descripcion,
    horasPlanificadas: hours[index],
    nombre: stage.nombre,
  }));
}

function redistributeStages(
  stages: ProjectStageFormValues[],
  form: ProjectFormValues,
) {
  const equalWeightStages = stages.map(() => ({
    descripcion: "",
    nombre: "",
    weight: 1,
  }));
  const hours = distributeHours(plannedHoursFromForm(form), equalWeightStages);

  return stages.map((stage, index) => ({
    ...stage,
    horasPlanificadas: hours[index],
  }));
}

function distributeHours(
  totalHours: number,
  stages: Array<{ weight: number }>,
) {
  if (stages.length === 0) {
    return [];
  }

  const totalWeight = stages.reduce((total, stage) => total + stage.weight, 0);

  if (!Number.isFinite(totalHours) || totalHours <= 0 || totalWeight <= 0) {
    return stages.map(() => "0.00");
  }

  let assignedHours = 0;

  return stages.map((stage, index) => {
    if (index === stages.length - 1) {
      return formatDecimalValue(Math.max(totalHours - assignedHours, 0));
    }

    const stageHours = roundToTwoDecimals((totalHours * stage.weight) / totalWeight);
    assignedHours += stageHours;

    return formatDecimalValue(stageHours);
  });
}

function totalStageHours(stages: ProjectStageFormValues[]) {
  return stages.reduce(
    (total, stage) => total + parseDecimalValue(stage.horasPlanificadas),
    0,
  );
}

function plannedHoursFromForm(form: ProjectFormValues) {
  return parseDecimalValue(form.horasPlanificadas);
}

function parseDecimalValue(value: string) {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}
