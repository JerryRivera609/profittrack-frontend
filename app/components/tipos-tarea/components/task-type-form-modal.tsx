"use client";

import { AlignLeft, ClipboardCheck, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { TextField } from "../../ui/text-field";
import type {
  TaskTypeFormValues,
  TaskTypeModalState,
  TaskTypeScope,
} from "../types/task-type";

type TaskTypeFormModalProps = {
  form: TaskTypeFormValues;
  isSaving: boolean;
  modalState: TaskTypeModalState;
  onChange: <Key extends keyof TaskTypeFormValues>(
    key: Key,
    value: TaskTypeFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  scope: TaskTypeScope;
};

export function TaskTypeFormModal({
  form,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  scope,
}: TaskTypeFormModalProps) {
  const isEdit = modalState.mode === "edit";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <Modal onClose={onClose} open={modalState.open} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {isEdit ? "Actualizacion de catalogo" : "Nuevo tipo de tarea"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar tipo de tarea" : "Registrar tipo de tarea"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Completa el nombre y la descripcion para este catalogo.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </ModalHeader>

        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2">
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

            <TextField
              icon={<ClipboardCheck className="size-4" />}
              label="Nombre"
              onChange={(event) => onChange("nombre", event.target.value)}
              required
              value={form.nombre}
            />
            <TextField
              className="md:col-span-2"
              icon={<AlignLeft className="size-4" />}
              label="Descripcion"
              onChange={(event) => onChange("descripcion", event.target.value)}
              required
              value={form.descripcion}
            />
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
                ? "Actualizar tipo"
                : "Crear tipo"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
