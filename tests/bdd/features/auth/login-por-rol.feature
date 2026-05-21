Feature: Acceso al sistema por rol
  Como usuario del sistema
  Quiero iniciar sesión según mi rol
  Para entrar al portal que me corresponde

  Scenario: Owner accede al portal empresarial
    Given que existe un usuario con rol owner
    When inicia sesión con credenciales válidas
    Then el sistema lo redirige al portal owner
    And puede ver dashboard, proyectos y módulos de gestión empresarial

  Scenario: Desarrollador accede a su portal operativo
    Given que existe un usuario autenticado que no es owner
    When inicia sesión con credenciales válidas
    Then el sistema lo redirige al portal de desarrollador
    And puede ver sus proyectos, tareas y horas de trabajo

  Scenario: Usuario con credenciales inválidas no accede
    Given que el usuario ingresa un correo o contraseña incorrectos
    When intenta iniciar sesión
    Then el sistema rechaza el acceso
    And muestra un mensaje de credenciales inválidas
