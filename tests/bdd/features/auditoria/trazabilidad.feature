Feature: Auditoría de acciones críticas
  Como administrador
  Quiero rastrear acciones sensibles del sistema
  Para contar con trazabilidad operativa

  Scenario: Registrar una acción de creación
    Given que un usuario ejecuta una operación crítica de alta
    When la operación finaliza correctamente
    Then el sistema registra una auditoría con acción CREAR

  Scenario: Registrar una acción de actualización o eliminación
    Given que un usuario modifica o elimina una entidad sensible
    When la operación finaliza correctamente
    Then el sistema registra una auditoría con la acción correspondiente
