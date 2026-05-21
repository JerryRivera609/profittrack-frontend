Feature: Registro de horas desde una sesion activa
  Como desarrollador
  Quiero registrar mis horas al finalizar una tarea
  Para dejar evidencia exacta del tiempo invertido

  Scenario: Finalizar una sesion construye un payload valido para la API
    Given una sesion de trabajo sobre la tarea 12 del proyecto 4
    And la sesion inicio el "2026-05-21T09:00:00.000Z"
    And la sesion finalizo el "2026-05-21T11:30:00.000Z"
    And el tiempo en pausa acumulado es de 15 minutos
    And el comentario final es "Se avanzo el modelado del backend"
    When construimos el payload de registro de horas
    Then el payload usa el proyecto 4 y la tarea 12
    And el payload registra 2.25 horas trabajadas
    And el payload tiene un comentario obligatorio
