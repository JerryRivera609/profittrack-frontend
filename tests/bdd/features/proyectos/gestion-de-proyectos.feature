Feature: Gestión de proyectos
  Como owner o administrador
  Quiero administrar proyectos de mi organización
  Para planificar y controlar la ejecución

  Scenario: Crear un proyecto
    Given que el usuario tiene permisos de gestión
    When registra un nuevo proyecto con cliente, servicio, líder y fechas
    Then el sistema crea el proyecto correctamente
    And el proyecto queda visible en el portafolio

  Scenario: Iniciar un proyecto
    Given que existe un proyecto en estado PLANIFICADO
    When el usuario lo inicia
    Then el sistema registra la fecha de inicio real
    And cambia el estado del proyecto a EN_PROCESO

  Scenario: Finalizar un proyecto
    Given que existe un proyecto en estado EN_PROCESO
    When el usuario lo finaliza
    Then el sistema registra la fecha de fin real
    And cambia el estado del proyecto a FINALIZADO
