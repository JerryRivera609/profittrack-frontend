"use client";

import { Building2, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import type { ClientFormValues, ClientModalState, ClientScope } from "../types/client";
import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { TextField } from "../../ui/text-field";

type ClientFormModalProps = {
  form: ClientFormValues;
  isSaving: boolean;
  modalState: ClientModalState;
  onChange: <Key extends keyof ClientFormValues>(
    key: Key,
    value: ClientFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  scope: ClientScope;
};

export function ClientFormModal({
  form,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  scope,
}: ClientFormModalProps) {
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
              {isEdit ? "Actualizacion de cliente" : "Alta de cliente"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isEdit ? "Editar cliente" : "Registrar cliente"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Completa los datos comerciales y de contacto del cliente.
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
              icon={<Building2 className="size-4" />}
              label="Razon social"
              onChange={(event) => onChange("razonSocial", event.target.value)}
              required
              value={form.razonSocial}
            />
            <TextField
              icon={<ShieldCheck className="size-4" />}
              label="RUC"
              onChange={(event) => onChange("ruc", event.target.value)}
              required
              value={form.ruc}
            />
            <TextField
              icon={<UserRound className="size-4" />}
              label="Nombre de contacto"
              onChange={(event) => onChange("nombreContacto", event.target.value)}
              required
              value={form.nombreContacto}
            />
            <TextField
              icon={<Mail className="size-4" />}
              label="Correo de contacto"
              onChange={(event) => onChange("correoContacto", event.target.value)}
              required
              type="email"
              value={form.correoContacto}
            />
            <TextField
              icon={<Phone className="size-4" />}
              label="Telefono de contacto"
              onChange={(event) => onChange("telefonoContacto", event.target.value)}
              required
              value={form.telefonoContacto}
            />
            <TextField
              className="md:col-span-2"
              icon={<MapPin className="size-4" />}
              label="Direccion"
              onChange={(event) => onChange("direccion", event.target.value)}
              required
              value={form.direccion}
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
                ? "Actualizar cliente"
                : "Crear cliente"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
