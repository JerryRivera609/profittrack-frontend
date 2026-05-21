Feature: Generación de planillas
  Como owner o administrador
  Quiero generar planillas mensuales
  Para consolidar pagos del equipo

  Scenario: Crear una planilla mensual
    Given que existen empleados activos en la empresa
    When el usuario genera una planilla para un mes y año determinados
    Then el sistema crea la planilla
    And guarda el detalle por empleado
