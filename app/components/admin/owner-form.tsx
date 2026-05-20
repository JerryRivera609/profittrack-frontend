"use client";

import { Building2, KeyRound, Mail, Save, UserRound, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type {
  Duenio,
  DuenioPayload,
  DuenioUpdatePayload,
  Empresa,
} from "../../types/domain";
import { Button } from "../ui/button";
import { Panel } from "../ui/panel";
import { SelectField } from "../ui/select-field";
import { TextField } from "../ui/text-field";

type OwnerFormProps = {
  editingOwner: Duenio | null;
  empresas: Empresa[];
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (payload: DuenioPayload | DuenioUpdatePayload) => void | Promise<void>;
};

export function OwnerForm({
  editingOwner,
  empresas,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: OwnerFormProps) {
  const defaultEmpresaId = useMemo(
    () => empresas[0]?.id.toString() ?? "",
    [empresas],
  );
  const [apellidos, setApellidos] = useState(editingOwner?.apellidos ?? "");
  const [contrasenia, setContrasenia] = useState("");
  const [correo, setCorreo] = useState(editingOwner?.correo ?? "");
  const [empresaId, setEmpresaId] = useState(
    editingOwner?.empresaId.toString() ?? defaultEmpresaId,
  );
  const [formError, setFormError] = useState("");
  const [nombres, setNombres] = useState(editingOwner?.nombres ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedEmpresaId = empresaId || defaultEmpresaId;
    const parsedEmpresaId = Number(selectedEmpresaId);

    if (!parsedEmpresaId) {
      setFormError("Selecciona una empresa.");
      return;
    }

    if (!editingOwner && !contrasenia.trim()) {
      setFormError("Ingresa una contrasenia para el owner.");
      return;
    }

    const payload: DuenioUpdatePayload = {
      apellidos,
      correo,
      empresaId: parsedEmpresaId,
      nombres,
    };

    if (contrasenia.trim()) {
      payload.contrasenia = contrasenia;
    }

    await onSubmit(payload);

    if (!editingOwner) {
      setApellidos("");
      setContrasenia("");
      setCorreo("");
      setEmpresaId(defaultEmpresaId);
      setNombres("");
    }
  }

  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Owners</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {editingOwner ? "Editar owner" : "Crear owner"}
          </h3>
        </div>
        <UserRound className="size-5 text-amber-600" />
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <SelectField
          disabled={!empresas.length}
          icon={<Building2 className="size-4" />}
          label="Empresa asignada"
          onChange={(event) => setEmpresaId(event.target.value)}
          required
          value={empresaId || defaultEmpresaId}
        >
          {!empresas.length && <option value="">Crea una empresa primero</option>}
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </SelectField>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            icon={<UserRound className="size-4" />}
            label="Nombres"
            onChange={(event) => setNombres(event.target.value)}
            required
            value={nombres}
          />
          <TextField
            label="Apellidos"
            onChange={(event) => setApellidos(event.target.value)}
            required
            value={apellidos}
          />
        </div>

        <TextField
          icon={<Mail className="size-4" />}
          label="Correo"
          onChange={(event) => setCorreo(event.target.value)}
          required
          type="email"
          value={correo}
        />

        <TextField
          icon={<KeyRound className="size-4" />}
          label={editingOwner ? "Nueva contrasenia" : "Contrasenia"}
          onChange={(event) => setContrasenia(event.target.value)}
          required={!editingOwner}
          type="password"
          value={contrasenia}
        />

        {formError && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            disabled={isSubmitting || !empresas.length}
            icon={<Save className="size-4" />}
            type="submit"
          >
            {editingOwner ? "Guardar owner" : "Crear owner"}
          </Button>
          {editingOwner && (
            <Button
              disabled={isSubmitting}
              icon={<X className="size-4" />}
              onClick={onCancelEdit}
              variant="secondary"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
