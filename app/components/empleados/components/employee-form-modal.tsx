"use client";

import {
  BadgeCheck,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import type { EmployeeFormValues, EmployeeModalState, EmployeeScope } from "../types/employee";
import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { TextField } from "../../ui/text-field";

type EmployeeFormModalProps = {
  form: EmployeeFormValues;
  isSaving: boolean;
  modalState: EmployeeModalState;
  onChange: <Key extends keyof EmployeeFormValues>(
    key: Key,
    value: EmployeeFormValues[Key],
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  scope: EmployeeScope;
};

export function EmployeeFormModal({
  form,
  isSaving,
  modalState,
  onChange,
  onClose,
  onSubmit,
  scope,
}: EmployeeFormModalProps) {
  const isEdit = modalState.mode === "edit";
  const title = isEdit ? "Editar empleado" : "Registrar empleado";
  const subtitle = isEdit
    ? "Actualiza los datos operativos del colaborador."
    : "Completa los datos para crear un nuevo colaborador.";

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
              {isEdit ? "Actualizacion" : "Alta de personal"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
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
              label="Rol ID"
              min="1"
              onChange={(event) => onChange("rolId", event.target.value)}
              required
              type="number"
              value={form.rolId}
            />
            <TextField
              icon={<UserRound className="size-4" />}
              label="Nombres"
              onChange={(event) => onChange("nombres", event.target.value)}
              required
              value={form.nombres}
            />
            <TextField
              icon={<UsersRound className="size-4" />}
              label="Apellidos"
              onChange={(event) => onChange("apellidos", event.target.value)}
              required
              value={form.apellidos}
            />
            <TextField
              icon={<FileText className="size-4" />}
              label="Numero de documento"
              onChange={(event) => onChange("numeroDocumento", event.target.value)}
              required
              value={form.numeroDocumento}
            />
            <TextField
              icon={<Mail className="size-4" />}
              label="Correo"
              onChange={(event) => onChange("correo", event.target.value)}
              required
              type="email"
              value={form.correo}
            />
            <TextField
              icon={<Phone className="size-4" />}
              label="Telefono"
              onChange={(event) => onChange("telefono", event.target.value)}
              required
              value={form.telefono}
            />
            <TextField
              icon={<ShieldCheck className="size-4" />}
              label={isEdit ? "Nueva contrasenia" : "Contrasenia"}
              onChange={(event) => onChange("contrasenia", event.target.value)}
              placeholder={isEdit ? "Opcional para actualizar" : "Obligatoria"}
              required={!isEdit}
              type="password"
              value={form.contrasenia}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Fecha de ingreso"
              onChange={(event) => onChange("fechaIngreso", event.target.value)}
              required
              type="date"
              value={form.fechaIngreso}
            />
            <TextField
              icon={<CalendarDays className="size-4" />}
              label="Fecha de salida"
              onChange={(event) => onChange("fechaSalida", event.target.value)}
              type="date"
              value={form.fechaSalida}
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
                ? "Actualizar empleado"
                : "Crear empleado"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
