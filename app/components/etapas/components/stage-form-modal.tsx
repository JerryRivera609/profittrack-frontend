"use client";

import {
  CalendarDays,
  Clock3,
  FileText,
  FolderKanban,
  Hash,
  ListChecks,
} from "lucide-react";
import type { FormEvent } from "react";
import type { StageFormValues, StageModalState } from "../types/stage";
import { Button } from "../../ui/button";
import { CalendarField } from "../../ui/calendar-field";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { TextField } from "../../ui/text-field";

type StageFormModalProps = {
  form: StageFormValues;
  isSaving: boolean;
  modalState: StageModalState;
  onChange: <Key extends keyof StageFormValues>(
    key: Key,
    value: StageFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  projectName?: string;
};

export function StageFormModal({
  form,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  projectName,
}: StageFormModalProps) {
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
              {isEdit ? "Actualizacion de etapa" : "Alta de etapa"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar etapa" : "Registrar etapa"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {projectName
                ? `Proyecto: ${projectName}`
                : "Selecciona un proyecto para gestionar sus etapas."}
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="md:col-span-2">
              <TextField
                icon={<ListChecks className="size-4" />}
                label="Nombre"
                onChange={(event) => onChange("nombre", event.target.value)}
                required
                value={form.nombre}
              />
            </div>
            <TextField
              icon={<Hash className="size-4" />}
              label="Orden"
              min="1"
              onChange={(event) => onChange("orden", event.target.value)}
              required
              type="number"
              value={form.orden}
            />
            <TextField
              icon={<Clock3 className="size-4" />}
              label="Horas planificadas"
              min="0"
              onChange={(event) => onChange("horasPlanificadas", event.target.value)}
              required
              step="0.01"
              type="number"
              value={form.horasPlanificadas}
            />
            <CalendarField
              icon={<CalendarDays className="size-4" />}
              label="Inicio planificado"
              onChange={(value) => onChange("fechaInicioPlanificada", value)}
              required
              value={form.fechaInicioPlanificada}
            />
            <CalendarField
              icon={<CalendarDays className="size-4" />}
              label="Fin planificado"
              onChange={(value) => onChange("fechaFinPlanificada", value)}
              required
              value={form.fechaFinPlanificada}
            />
            <div className="md:col-span-2">
              <TextField
                icon={<FileText className="size-4" />}
                label="Descripcion"
                onChange={(event) => onChange("descripcion", event.target.value)}
                placeholder="Opcional"
                value={form.descripcion}
              />
            </div>
            {isEdit ? (
              <>
                <CalendarField
                  icon={<CalendarDays className="size-4" />}
                  label="Inicio real"
                  onChange={(value) => onChange("fechaInicioReal", value)}
                  value={form.fechaInicioReal}
                />
                <CalendarField
                  icon={<CalendarDays className="size-4" />}
                  label="Fin real"
                  onChange={(value) => onChange("fechaFinReal", value)}
                  value={form.fechaFinReal}
                />
                <div className="md:col-span-2">
                  <TextField
                    icon={<FolderKanban className="size-4" />}
                    label="Estado"
                    onChange={(event) => onChange("estado", event.target.value)}
                    required
                    value={form.estado}
                  />
                </div>
              </>
            ) : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Guardando..." : isEdit ? "Actualizar etapa" : "Crear etapa"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
