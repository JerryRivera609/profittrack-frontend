Feature: Administración de empresas y owners
  Como administrador del SaaS
  Quiero gestionar empresas y dueños
  Para mantener el alta operativa de clientes

  Scenario: Crear una empresa
    Given que el administrador está autenticado
    When registra una nueva empresa con sus datos principales
    Then el sistema crea la empresa correctamente

  Scenario: Asignar un owner a una empresa
    Given que existe una empresa activa
    When el administrador registra un owner para esa empresa
    Then el sistema crea el owner
    And el owner queda vinculado a la empresa seleccionada
