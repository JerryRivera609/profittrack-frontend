Feature: Resumen compacto de horas
  Como usuario operativo
  Quiero ver un resumen breve de mis horas
  Para entender mi estado sin perder espacio de trabajo

  Scenario: El empleado ve un resumen compacto en la parte superior
    Given que existen horas registradas para el usuario
    When entra al módulo de horas
    Then el sistema muestra un resumen compacto de registradas, aprobadas, pendientes y rechazadas
    And el tablero de toma de tiempo sigue siendo el bloque principal de la pantalla

  Scenario: El flujo recomendado no ocupa un panel grande
    Given que el usuario está en la pantalla de horas
    When revisa la interfaz principal
    Then el flujo recomendado aparece como acción informativa secundaria
    And no desplaza el tablero principal de tareas
