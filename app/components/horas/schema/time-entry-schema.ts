import type { TimeEntryFormValues } from "../types/time-entry";

export function validateTimeEntryForm(form: TimeEntryFormValues) {
  if (!form.proyectoId.trim()) {
    return "Selecciona el proyecto asociado.";
  }

  if (!form.tareaId.trim()) {
    return "Selecciona la tarea trabajada.";
  }

  if (!form.fechaTrabajo.trim()) {
    return "Selecciona la fecha de trabajo.";
  }

  if (!form.horaIngreso.trim()) {
    return "Registra la hora de inicio.";
  }

  if (!form.horaSalida.trim()) {
    return "Registra la hora de fin.";
  }

  const descanso = Number.parseInt(form.minutosDescanso || "0", 10);

  if (!Number.isFinite(descanso) || descanso < 0) {
    return "Los minutos de descanso deben ser cero o mayores.";
  }

  const horas = Number.parseFloat(form.horasTrabajadas || "0");

  if (!Number.isFinite(horas) || horas <= 0) {
    return "Las horas trabajadas deben ser mayores a cero.";
  }

  const start = Date.parse(form.horaIngreso);
  const end = Date.parse(form.horaSalida);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return "La hora de salida debe ser posterior a la hora de ingreso.";
  }

  if (!form.descripcion.trim()) {
    return "Describe brevemente el trabajo realizado.";
  }

  return "";
}
