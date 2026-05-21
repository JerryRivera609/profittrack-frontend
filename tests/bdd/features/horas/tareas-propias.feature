Feature: Visibilidad de tareas del empleado
  Como desarrollador
  Quiero ver solo tareas que me pertenecen
  Para no tomar tiempo sobre trabajo de otro colaborador

  Scenario: El empleado solo ve tareas asignadas a su usuario
    Given que el empleado logueado tiene id 5
    And existen estas tareas candidatas:
      | id | empleadoAsignadoId |
      | 2  | 5                  |
      | 3  | 5                  |
      | 7  | 8                  |
    When filtramos las tareas visibles para el empleado
    Then solo quedan visibles las tareas:
      | id |
      | 2  |
      | 3  |
