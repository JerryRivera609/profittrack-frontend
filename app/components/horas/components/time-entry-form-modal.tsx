"use client";

import {
  AlarmClockCheck,
  BriefcaseBusiness,
  Clock3,
  FileText,
  PauseCircle,
  PlayCircle,
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
  isLoadingTasks: boolean;
  isSaving: boolean;
  modalState: TimeEntryModalState;
  onChange: <Key extends keyof TimeEntryFormValues>(
    key: Key,
    value: TimeEntryFormValues[Key],
  ) => void;
  onClose: () => void;
  onFinishNow: () => void;
  onStartNow: () => void;
  onSubmit: () => void;
  projectOptions: TimeEntryCatalogOption[];
  taskOptions: TimeEntryCatalogOption[];
};

export function TimeEntryFormModal({
  form,
  isLoadingTasks,
  isSaving,
  modalState,
  onChange,
  onClose,
  onFinishNow,
  onStartNow,
  onSubmit,
  projectOptions,
  taskOptions,
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
              Registro productivo
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Nueva sesion de trabajo
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Registra tiempo por tarea. El sistema calcula las horas y deja la
              aprobacion lista para revision del lider.
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
              disabled={isLoadingTasks || taskOptions.length === 0}
              icon={<AlarmClockCheck className="size-4" />}
              label="Tarea"
              onChange={(value) => onChange("tareaId", value)}
              options={taskOptions}
              placeholder={isLoadingTasks ? "Cargando tareas..." : "Selecciona una tarea"}
              required
              value={form.tareaId}
            />
            <TextField
              icon={<Clock3 className="size-4" />}
              label="Fecha de trabajo"
              onChange={(event) => onChange("fechaTrabajo", event.target.value)}
              required
              type="date"
              value={form.fechaTrabajo}
            />
            <TextField
              icon={<PlayCircle className="size-4" />}
              label="Hora de inicio"
              onChange={(event) => onChange("horaIngreso", event.target.value)}
              required
              type="datetime-local"
              value={form.horaIngreso}
            />
            <TextField
              icon={<PauseCircle className="size-4" />}
              label="Hora de fin"
              onChange={(event) => onChange("horaSalida", event.target.value)}
              required
              type="datetime-local"
              value={form.horaSalida}
            />
            <TextField
              icon={<Clock3 className="size-4" />}
              label="Minutos de descanso"
              min="0"
              onChange={(event) => onChange("minutosDescanso", event.target.value)}
              required
              type="number"
              value={form.minutosDescanso}
            />
            <TextField
              icon={<AlarmClockCheck className="size-4" />}
              label="Horas trabajadas"
              min="0"
              onChange={(event) => onChange("horasTrabajadas", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.horasTrabajadas}
            />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<PlayCircle className="size-4" />}
                  onClick={onStartNow}
                  type="button"
                  variant="secondary"
                >
                  Iniciar ahora
                </Button>
                <Button
                  icon={<PauseCircle className="size-4" />}
                  onClick={onFinishNow}
                  type="button"
                  variant="secondary"
                >
                  Finalizar ahora
                </Button>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Usa este flujo como temporizador por tarea. Si trabajaste fuera del
                sistema, puedes registrar manualmente las horas ajustando inicio, fin y descanso.
              </p>
            </div>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-3">
              Comentario de trabajo
              <span className="mt-1.5 flex rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                <FileText className="mt-0.5 size-4 shrink-0" />
                <textarea
                  className="min-h-28 min-w-0 flex-1 resize-y bg-transparent pl-2 text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  onChange={(event) => onChange("descripcion", event.target.value)}
                  placeholder="Ejemplo: Se avanzó la implementación del módulo de clientes y se corrigieron validaciones del formulario."
                  required
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
            {isSaving ? "Guardando..." : "Registrar horas"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
