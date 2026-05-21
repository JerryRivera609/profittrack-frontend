Feature: Aprobación de horas registradas
  Como líder o responsable
  Quiero aprobar o rechazar registros de horas
  Para validar el tiempo imputado al proyecto

  Scenario: El líder aprueba un registro pendiente
    Given que existe un registro de horas pendiente
    When el líder aprueba el registro
    Then el sistema marca el registro como aprobado
    And esas horas quedan listas para contabilizarse en el flujo validado

  Scenario: El líder rechaza un registro pendiente
    Given que existe un registro de horas pendiente
    When el líder rechaza el registro
    Then el sistema cambia el estado del registro a rechazado
    And el registro no queda en el flujo aprobado
