"use client";

import { AlignLeft, BadgeCheck, ShieldCheck } from "lucide-react";
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
  RoleFormValues,
  RoleModalState,
  RoleScope,
} from "../types/role";

type RoleFormModalProps = {
  form: RoleFormValues;
  isSaving: boolean;
  modalState: RoleModalState;
  onChange: <Key extends keyof RoleFormValues>(
    key: Key,
    value: RoleFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  scope: RoleScope;
};

export function RoleFormModal({
  form,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  scope,
}: RoleFormModalProps) {
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
              {isEdit ? "Actualizacion de rol" : "Nuevo rol de empleado"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar rol" : "Registrar rol"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Define el nombre y la descripcion que se usaran al asignar empleados.
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
              icon={<BadgeCheck className="size-4" />}
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
            {isSaving ? "Guardando..." : isEdit ? "Actualizar rol" : "Crear rol"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
