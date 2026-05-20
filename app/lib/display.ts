import type { Duenio, Empresa } from "../types/domain";

export function getDuenioNombre(duenio: Duenio) {
  return `${duenio.nombres} ${duenio.apellidos}`.trim();
}

export function getEmpresaNombre(empresas: Empresa[], empresaId: number) {
  return (
    empresas.find((empresa) => empresa.id === empresaId)?.nombre ??
    `Empresa #${empresaId}`
  );
}

export function getDisplayName(email: string) {
  return email.split("@")[0]?.replace(/[._-]/g, " ") || "Admin";
}
