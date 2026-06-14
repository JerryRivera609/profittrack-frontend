import type { TimeEntryFormValues } from "../types/time-entry";

export function validateTimeEntryForm(form: TimeEntryFormValues) {
  if (!form.proyectoId.trim()) {
    return "Selecciona el proyecto asociado.";
  }

  if (!form.nombre.trim()) {
    return "Completa el nombre de la tarea realizada.";
  }

  const horas = Number.parseFloat(form.horasDedicadas || "0");

  if (!Number.isFinite(horas) || horas <= 0) {
    return "Las horas dedicadas deben ser mayores a cero.";
  }

  return "";
}
