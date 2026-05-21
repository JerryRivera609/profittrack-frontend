Feature: Toma de tiempo por tarea
  Como desarrollador
  Quiero registrar tiempo desde una tarea pendiente
  Para reflejar mi trabajo real por proyecto

  Scenario: El empleado inicia una tarea desde el tablero
    Given que el empleado tiene una tarea pendiente asignada
    When presiona el botón iniciar tarea
    Then el sistema abre una sesión activa de trabajo
    And registra la hora inicial de la sesión
    And muestra un contador de tiempo en vivo

  Scenario: El empleado pausa y continúa una tarea
    Given que el empleado tiene una sesión de trabajo activa
    When pausa la sesión
    Then el sistema detiene la acumulación de tiempo trabajado
    And empieza a contabilizar el tiempo en pausa
    When continúa la sesión
    Then el sistema reanuda la acumulación de tiempo trabajado

  Scenario: El empleado finaliza la tarea y registra horas
    Given que el empleado tiene una sesión activa con tiempo acumulado
    And completa un comentario de avance
    When finaliza la sesión
    Then el sistema construye un registro de horas válido
    And envía el proyecto, la tarea, la fecha, la hora de inicio y la hora de fin
    And calcula las horas trabajadas y el tiempo de descanso acumulado

  Scenario: El empleado puede registrar horas manualmente
    Given que el empleado trabajó fuera del temporizador
    When abre el registro manual desde una tarea
    Then el formulario se prellena con el proyecto y la tarea
    And el empleado puede completar fecha, horas y comentario
