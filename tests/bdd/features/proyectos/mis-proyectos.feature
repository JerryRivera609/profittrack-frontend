Feature: Proyectos asignados al empleado
  Como desarrollador
  Quiero ver solo mis proyectos asignados
  Para trabajar únicamente sobre lo que me corresponde

  Scenario: El backend devuelve los proyectos del usuario autenticado
    Given que el empleado ha iniciado sesión correctamente
    When consulta sus proyectos asignados
    Then el sistema usa el endpoint de mis proyectos
    And solo muestra proyectos asociados al usuario autenticado

  Scenario: Un empleado sin proyectos no ve cartera general
    Given que el empleado no tiene proyectos asignados
    When entra al módulo de proyectos
    Then el sistema muestra un estado vacío
    And no expone proyectos de otros empleados ni de toda la empresa
