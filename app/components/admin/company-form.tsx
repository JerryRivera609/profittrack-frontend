"use client";

import { Building2, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Empresa, EmpresaPayload } from "../../types/domain";
import { Button } from "../ui/button";
import { Panel } from "../ui/panel";
import { TextField } from "../ui/text-field";

const emptyCompany: EmpresaPayload = {
  correo: "",
  direccion: "",
  nombre: "",
  ruc: "",
  telefono: "",
};

type CompanyFormProps = {
  editingCompany: Empresa | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (payload: EmpresaPayload) => void | Promise<void>;
};

export function CompanyForm({
  editingCompany,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: CompanyFormProps) {
  const [form, setForm] = useState<EmpresaPayload>(() =>
    getInitialCompanyForm(editingCompany),
  );

  function updateField(field: keyof EmpresaPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(form);

    if (!editingCompany) {
      setForm({ ...emptyCompany });
    }
  }

  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Empresas</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {editingCompany ? "Editar empresa" : "Crear empresa"}
          </h3>
        </div>
        <Building2 className="size-5 text-teal-600" />
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <TextField
          icon={<Building2 className="size-4" />}
          label="Nombre"
          onChange={(event) => updateField("nombre", event.target.value)}
          required
          value={form.nombre}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="RUC"
            onChange={(event) => updateField("ruc", event.target.value)}
            required
            value={form.ruc}
          />
          <TextField
            icon={<Phone className="size-4" />}
            label="Telefono"
            onChange={(event) => updateField("telefono", event.target.value)}
            required
            type="tel"
            value={form.telefono}
          />
        </div>

        <TextField
          icon={<Mail className="size-4" />}
          label="Correo"
          onChange={(event) => updateField("correo", event.target.value)}
          required
          type="email"
          value={form.correo}
        />

        <TextField
          icon={<MapPin className="size-4" />}
          label="Direccion"
          onChange={(event) => updateField("direccion", event.target.value)}
          required
          value={form.direccion}
        />

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            disabled={isSubmitting}
            icon={<Save className="size-4" />}
            type="submit"
          >
            {editingCompany ? "Guardar empresa" : "Crear empresa"}
          </Button>
          {editingCompany && (
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

function getInitialCompanyForm(editingCompany: Empresa | null): EmpresaPayload {
  if (!editingCompany) {
    return { ...emptyCompany };
  }

  return {
    correo: editingCompany.correo,
    direccion: editingCompany.direccion,
    nombre: editingCompany.nombre,
    ruc: editingCompany.ruc,
    telefono: editingCompany.telefono,
  };
}
