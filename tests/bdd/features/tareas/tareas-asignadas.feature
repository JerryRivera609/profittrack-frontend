Feature: Tareas asignadas al empleado
  Como desarrollador
  Quiero ver solo tareas que me pertenecen
  Para no tomar trabajo ajeno

  Scenario: El empleado ve tareas asignadas a su usuario
    Given que el empleado ha iniciado sesión
    And existen tareas activas en sus proyectos
    When el sistema carga las tareas pendientes
    Then solo se muestran tareas cuyo empleadoAsignadoId coincide con el usuario logueado

  Scenario: Las tareas finalizadas no aparecen en el tablero operativo
    Given que el empleado tiene tareas pendientes y tareas finalizadas
    When entra al módulo de horas
    Then el tablero de toma de tiempo solo muestra tareas no finalizadas
