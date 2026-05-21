Feature: Registro financiero básico
  Como owner
  Quiero registrar ingresos y egresos
  Para controlar la salud financiera de la empresa

  Scenario: Registrar un ingreso
    Given que el owner está autenticado
    When registra un ingreso asociado a un proyecto
    Then el sistema guarda el ingreso con un tipo válido

  Scenario: Registrar un egreso
    Given que el owner está autenticado
    And existe una categoría de egreso activa
    When registra un egreso asociado a un proyecto
    Then el sistema guarda el egreso correctamente
