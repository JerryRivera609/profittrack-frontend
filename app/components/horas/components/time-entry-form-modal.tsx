"use client";

import {
  AlarmClockCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  ListChecks,
} from "lucide-react";
import type { FormEvent } from "react";
import type {
  TimeEntryCatalogOption,
  TimeEntryFormValues,
  TimeEntryModalState,
} from "../types/time-entry";
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

type TimeEntryFormModalProps = {
  form: TimeEntryFormValues;
  isLoadingCatalogs: boolean;
  isSaving: boolean;
  modalState: TimeEntryModalState;
  onChange: <Key extends keyof TimeEntryFormValues>(
    key: Key,
    value: TimeEntryFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  projectOptions: TimeEntryCatalogOption[];
  stageOptions: TimeEntryCatalogOption[];
  taskTypeOptions: TimeEntryCatalogOption[];
};

export function TimeEntryFormModal({
  form,
  isLoadingCatalogs,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  projectOptions,
  stageOptions,
  taskTypeOptions,
}: TimeEntryFormModalProps) {
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
              Tarea realizada
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Registrar trabajo con horas
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              La tarea y sus horas se crean juntas y quedan pendientes de aprobacion.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SmartSelectField
              icon={<BriefcaseBusiness className="size-4" />}
              label="Proyecto"
              onChange={(value) => onChange("proyectoId", value)}
              options={projectOptions}
              placeholder="Selecciona un proyecto"
              required
              value={form.proyectoId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || stageOptions.length === 0}
              icon={<ListChecks className="size-4" />}
              label="Etapa"
              onChange={(value) => onChange("etapaProyectoId", value)}
              options={stageOptions}
              placeholder={isLoadingCatalogs ? "Cargando etapas..." : "Sin etapa"}
              value={form.etapaProyectoId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || taskTypeOptions.length === 0}
              icon={<ClipboardCheck className="size-4" />}
              label="Tipo de tarea"
              onChange={(value) => onChange("tipoTareaId", value)}
              options={taskTypeOptions}
              placeholder={isLoadingCatalogs ? "Cargando tipos..." : "Sin tipo"}
              value={form.tipoTareaId}
            />
            <TextField
              className="md:col-span-2"
              icon={<ClipboardCheck className="size-4" />}
              label="Nombre de la tarea realizada"
              onChange={(event) => onChange("nombre", event.target.value)}
              placeholder="Ejemplo: Implementar validacion de pagos"
              required
              value={form.nombre}
            />
            <TextField
              icon={<AlarmClockCheck className="size-4" />}
              label="Horas dedicadas"
              min="0"
              onChange={(event) => onChange("horasDedicadas", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.horasDedicadas}
            />
            <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
              Descripcion
              <span className="mt-1.5 flex rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                <FileText className="mt-0.5 size-4 shrink-0" />
                <textarea
                  className="min-h-28 min-w-0 flex-1 resize-y bg-transparent pl-2 text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  onChange={(event) => onChange("descripcion", event.target.value)}
                  placeholder="Opcional: agrega contexto para que el lider revise la declaracion."
                  value={form.descripcion}
                />
              </span>
            </label>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Guardando..." : "Registrar tarea"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
