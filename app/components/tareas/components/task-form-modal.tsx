"use client";

import {
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";
import type { FormEvent } from "react";
import type {
  TaskCatalogOption,
  TaskFormValues,
  TaskModalState,
} from "../types/task";
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

type TaskFormModalProps = {
  employeeOptions: TaskCatalogOption[];
  form: TaskFormValues;
  isLoadingCatalogs: boolean;
  isSaving: boolean;
  modalState: TaskModalState;
  onChange: <Key extends keyof TaskFormValues>(
    key: Key,
    value: TaskFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  projectOptions: TaskCatalogOption[];
  taskTypeOptions: TaskCatalogOption[];
};

export function TaskFormModal({
  employeeOptions,
  form,
  isLoadingCatalogs,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  projectOptions,
  taskTypeOptions,
}: TaskFormModalProps) {
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
              {isEdit ? "Actualizacion de tarea" : "Alta de tarea"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar tarea" : "Registrar tarea"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Completa la planificacion y asignacion de la tarea.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SmartSelectField
              disabled={isLoadingCatalogs || projectOptions.length === 0}
              helperText="Selecciona el proyecto al que pertenece la tarea."
              icon={<ClipboardCheck className="size-4" />}
              label="Proyecto"
              onChange={(selectedValue) => onChange("proyectoId", selectedValue)}
              options={projectOptions}
              placeholder={isLoadingCatalogs ? "Cargando proyectos..." : "Selecciona un proyecto"}
              required
              value={form.proyectoId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || taskTypeOptions.length === 0}
              helperText="Selecciona el catalogo que clasifica esta tarea."
              icon={<ClipboardCheck className="size-4" />}
              label="Tipo de tarea"
              onChange={(selectedValue) => onChange("tipoTareaId", selectedValue)}
              options={taskTypeOptions}
              placeholder={isLoadingCatalogs ? "Cargando tipos..." : "Selecciona un tipo"}
              required
              value={form.tipoTareaId}
            />
            <SmartSelectField
              disabled={isLoadingCatalogs || employeeOptions.length === 0}
              helperText="Selecciona el colaborador responsable."
              icon={<UserRound className="size-4" />}
              label="Responsable"
              onChange={(selectedValue) => onChange("empleadoAsignadoId", selectedValue)}
              options={employeeOptions}
              placeholder={isLoadingCatalogs ? "Cargando empleados..." : "Selecciona un responsable"}
              required
              value={form.empleadoAsignadoId}
            />
            <TextField
              icon={<ClipboardCheck className="size-4" />}
              label="Nombre"
              onChange={(event) => onChange("nombre", event.target.value)}
              required
              value={form.nombre}
            />
            <TextField
              className="xl:col-span-2"
              icon={<FileText className="size-4" />}
              label="Descripcion"
              onChange={(event) => onChange("descripcion", event.target.value)}
              required
              value={form.descripcion}
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
              onChange={(selectedValue) => onChange("fechaInicioPlanificada", selectedValue)}
              placeholder="Selecciona el inicio planificado"
              required
              value={form.fechaInicioPlanificada}
            />
            <CalendarField
              icon={<CalendarDays className="size-4" />}
              label="Fin planificado"
              onChange={(selectedValue) => onChange("fechaFinPlanificada", selectedValue)}
              placeholder="Selecciona el fin planificado"
              required
              value={form.fechaFinPlanificada}
            />
            {isEdit ? (
              <TextField
                icon={<ClipboardCheck className="size-4" />}
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
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Guardando..." : isEdit ? "Actualizar tarea" : "Crear tarea"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
