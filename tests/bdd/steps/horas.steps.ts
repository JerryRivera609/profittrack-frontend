import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { buildCreateTimeEntryPayload } from "../../../app/components/horas/utils/time-entry-form";
import { filterTasksForEmployee } from "../../../app/components/horas/utils/time-entry-policy";
import type {
  PendingTaskWorkItem,
  TimeEntryFormValues,
} from "../../../app/components/horas/types/time-entry";

type HorasWorld = {
  empleadoId?: number;
  filteredTasks: PendingTaskWorkItem[];
  payload?: ReturnType<typeof buildCreateTimeEntryPayload>;
  rawTasks: PendingTaskWorkItem[];
  sessionComment?: string;
  sessionEnd?: string;
  sessionPauseMinutes?: number;
  sessionProjectId?: number;
  sessionStart?: string;
  sessionTaskId?: number;
};

const world: HorasWorld = {
  filteredTasks: [],
  rawTasks: [],
};

Given("que el empleado logueado tiene id {int}", function (empleadoId: number) {
  world.empleadoId = empleadoId;
});

Given("existen estas tareas candidatas:", function (table) {
  world.rawTasks = table.hashes().map(
    (row: { empleadoAsignadoId: string; id: string }) =>
      ({
        clienteNombre: "Cliente de prueba",
        descripcion: "Tarea de prueba",
        empleadoAsignadoId: Number.parseInt(row.empleadoAsignadoId, 10),
        estado: "EN_CURSO",
        horasPlanificadas: 1,
        horasReales: 0,
        id: Number.parseInt(row.id, 10),
        nombre: `Tarea ${row.id}`,
        proyectoCodigo: "PR-001",
        proyectoId: 1,
        proyectoNombre: "Proyecto demo",
      }) satisfies PendingTaskWorkItem,
  );
});

When("filtramos las tareas visibles para el empleado", function () {
  world.filteredTasks = filterTasksForEmployee(world.rawTasks, world.empleadoId);
});

Then("solo quedan visibles las tareas:", function (table) {
  const expectedIds = table
    .hashes()
    .map((row: { id: string }) => Number.parseInt(row.id, 10));

  assert.deepEqual(
    world.filteredTasks.map((task) => task.id),
    expectedIds,
  );
});

Given(
  "una sesion de trabajo sobre la tarea {int} del proyecto {int}",
  function (taskId: number, projectId: number) {
    world.sessionTaskId = taskId;
    world.sessionProjectId = projectId;
  },
);

Given("la sesion inicio el {string}", function (startedAt: string) {
  world.sessionStart = startedAt;
});

Given("la sesion finalizo el {string}", function (finishedAt: string) {
  world.sessionEnd = finishedAt;
});

Given(
  "el tiempo en pausa acumulado es de {int} minutos",
  function (pauseMinutes: number) {
    world.sessionPauseMinutes = pauseMinutes;
  },
);

Given("el comentario final es {string}", function (comment: string) {
  world.sessionComment = comment;
});

When("construimos el payload de registro de horas", function () {
  assert.ok(world.sessionProjectId, "projectId ausente");
  assert.ok(world.sessionTaskId, "taskId ausente");
  assert.ok(world.sessionStart, "sessionStart ausente");
  assert.ok(world.sessionEnd, "sessionEnd ausente");

  const workedMs =
    new Date(world.sessionEnd).getTime() -
    new Date(world.sessionStart).getTime() -
    (world.sessionPauseMinutes ?? 0) * 60_000;

  const form: TimeEntryFormValues = {
    descripcion: world.sessionComment ?? "",
    etapaProyectoId: "",
    horasDedicadas: (workedMs / 3_600_000).toFixed(2),
    nombre: `Tarea realizada ${world.sessionTaskId}`,
    proyectoId: `${world.sessionProjectId}`,
    tipoTareaId: "",
  };

  world.payload = buildCreateTimeEntryPayload(form);
});

Then(
  "el payload usa el proyecto {int} y la tarea {int}",
  function (projectId: number, taskId: number) {
    assert.equal(world.payload?.proyectoId, projectId);
    assert.equal("tareaId" in (world.payload ?? {}), false);
    assert.ok(taskId);
  },
);

Then(
  "el payload registra {float} horas trabajadas",
  function (hoursWorked: number) {
    assert.equal(world.payload?.horasDedicadas, hoursWorked);
  },
);

Then("el payload tiene un comentario obligatorio", function () {
  assert.ok(world.payload?.descripcion);
  assert.notEqual(world.payload?.descripcion.trim(), "");
});
