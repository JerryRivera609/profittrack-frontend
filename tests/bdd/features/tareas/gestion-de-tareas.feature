Feature: Gestión de tareas del proyecto
  Como líder o responsable
  Quiero administrar tareas dentro de un proyecto
  Para organizar el trabajo del equipo

  Scenario: Crear una tarea del proyecto
    Given que existe un proyecto activo
    When el usuario registra una nueva tarea con tipo, responsable y fechas
    Then el sistema crea la tarea dentro del proyecto
    And la tarea queda visible en el backlog

  Scenario: Iniciar una tarea
    Given que existe una tarea en estado PENDIENTE
    When el usuario la inicia
    Then el sistema cambia el estado de la tarea a EN_CURSO
    And registra la fecha de inicio real

  Scenario: Finalizar una tarea
    Given que existe una tarea en estado EN_CURSO
    When el usuario la finaliza
    Then el sistema cambia el estado de la tarea a FINALIZADO
    And registra la fecha de fin real
