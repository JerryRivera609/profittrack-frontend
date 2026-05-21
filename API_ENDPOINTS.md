# API del backend de ProfitTrack

## Resumen general

Este backend está construido con Spring Boot y expone una API REST orientada a la gestión de empresas, empleados, proyectos, horas, ingresos, egresos y métricas de rentabilidad.

La mayoría de endpoints están bajo el prefijo `/api` y requieren autenticación con JWT. Según `SecurityConfig`, solo `/api/auth/**`, Swagger y `/error` son públicos.

## Reglas globales

- Autenticación: el backend usa JWT y manejo de sesión con cookies.
- Endpoints públicos: `/api/auth/**`.
- Endpoints protegidos: todo lo demás requiere usuario autenticado.
- Multiempresa: varios endpoints fuerzan el `empresaId` desde el usuario autenticado para evitar acceso cruzado entre empresas.
- Borrado lógico: algunos módulos no eliminan físicamente, sino que marcan el recurso como inactivo.

## APIs de autenticación

- `POST /api/auth/login`: valida credenciales de empleado o dueño, crea sesión y devuelve datos básicos del usuario autenticado.
- `POST /api/auth/refresh`: renueva la sesión usando la cookie `refresh_token`.
- `POST /api/auth/logout`: cierra la sesión actual y limpia cookies.
- `POST /api/auth/logout-all`: cierra todas las sesiones activas del usuario actual.

## APIs de empleados

- `POST /api/empleados`: crea un empleado en la empresa del usuario autenticado.
- `GET /api/empleados/{id}`: obtiene el detalle de un empleado por id.
- `GET /api/empleados`: lista los empleados activos de la empresa.
- `GET /api/empleados/inactivos`: lista los empleados inactivos.
- `PATCH /api/empleados/{id}/reactivar`: reactiva un empleado inactivo.
- `PATCH /api/empleados/{id}`: actualiza parcialmente un empleado.
- `DELETE /api/empleados/{id}`: elimina o desactiva un empleado.

## APIs de dueños

- `POST /api/duenios`: crea un nuevo dueño dentro de la empresa actual.
- `GET /api/duenios/{id}`: obtiene un dueño por id.
- `GET /api/duenios`: lista los dueños activos de la empresa.
- `PATCH /api/duenios/{id}`: actualiza parcialmente un dueño.
- `DELETE /api/duenios/{id}`: elimina o desactiva un dueño.

## APIs de empresa

- `GET /api/empresas/mi-empresa`: devuelve los datos de la empresa asociada al usuario autenticado.
- `PATCH /api/empresas/mi-empresa`: actualiza la información de la empresa actual.

## APIs de clientes

- `POST /api/clientes`: crea un cliente en la empresa actual.
- `GET /api/clientes/{id}`: obtiene un cliente por id.
- `GET /api/clientes`: lista los clientes activos de la empresa.
- `GET /api/clientes/inactivos`: lista los clientes inactivos.
- `PATCH /api/clientes/{id}/reactivar`: reactiva un cliente inactivo.
- `PATCH /api/clientes/{id}`: actualiza parcialmente un cliente.
- `DELETE /api/clientes/{id}`: elimina o desactiva un cliente.

## APIs de proyectos

- `POST /api/proyectos`: crea un proyecto y lo asocia a la empresa autenticada.
- `GET /api/proyectos/{id}`: obtiene un proyecto por id.
- `GET /api/proyectos`: lista los proyectos activos de la empresa.
- `GET /api/proyectos/inactivos`: lista los proyectos inactivos.
- `PATCH /api/proyectos/{id}/reactivar`: reactiva un proyecto inactivo.
- `PATCH /api/proyectos/{id}`: actualiza parcialmente un proyecto.
- `DELETE /api/proyectos/{id}`: elimina o desactiva un proyecto.

## APIs de asignación proyecto-empleado

- `POST /api/proyecto-empleados`: asigna un empleado a un proyecto.
- `GET /api/proyecto-empleados/proyecto/{proyectoId}`: lista los empleados asignados a un proyecto.
- `DELETE /api/proyecto-empleados/{id}`: elimina una asignación proyecto-empleado.

## APIs de tareas del proyecto

- `POST /api/tareas`: crea una tarea dentro de un proyecto.
- `GET /api/tareas/proyecto/{proyectoId}`: lista las tareas activas de un proyecto.
- `GET /api/tareas/proyecto/{proyectoId}/inactivas`: lista las tareas inactivas de un proyecto.
- `PATCH /api/tareas/{id}/reactivar`: reactiva una tarea inactiva.
- `PATCH /api/tareas/{id}`: actualiza parcialmente una tarea.
- `DELETE /api/tareas/{id}`: elimina o desactiva una tarea.

## APIs de tipos de tarea

- `POST /api/tipos-tarea`: crea un tipo de tarea para la empresa actual.
- `GET /api/tipos-tarea`: lista los tipos de tarea activos de la empresa.
- `GET /api/tipos-tarea/{id}`: obtiene un tipo de tarea por id.
- `PATCH /api/tipos-tarea/{id}`: actualiza parcialmente un tipo de tarea.
- `DELETE /api/tipos-tarea/{id}`: elimina un tipo de tarea.

## APIs de tipos de servicio

- `POST /api/tipos-servicio`: crea un tipo de servicio para la empresa actual.
- `GET /api/tipos-servicio`: lista los tipos de servicio activos de la empresa.
- `GET /api/tipos-servicio/{id}`: obtiene un tipo de servicio por id.
- `PATCH /api/tipos-servicio/{id}`: actualiza parcialmente un tipo de servicio.
- `DELETE /api/tipos-servicio/{id}`: elimina un tipo de servicio.

## APIs de registro de horas

- `POST /api/registro-horas`: registra horas trabajadas por el usuario autenticado.
- `GET /api/registro-horas/resumen`: devuelve un resumen de horas con filtros opcionales por `proyectoId`, `empleadoId`, `fechaInicio` y `fechaFin`.
- `GET /api/registro-horas/mis-horas`: lista los registros de horas del usuario autenticado.
- `GET /api/registro-horas/proyecto/{proyectoId}`: lista los registros de horas asociados a un proyecto.
- `PATCH /api/registro-horas/{id}/aprobar`: aprueba un registro de horas.
- `PATCH /api/registro-horas/{id}/rechazar`: rechaza un registro de horas.
- `DELETE /api/registro-horas/{id}`: elimina un registro de horas.

## APIs de costos de horas registradas

- `GET /api/costos-registro/proyecto/{proyectoId}`: lista el costo calculado de cada registro de horas dentro de un proyecto.
- `GET /api/costos-registro/proyecto/{proyectoId}/resumen`: devuelve un resumen de costos por empleado dentro del proyecto, incluyendo horas totales, costo total y cantidad de registros.

## APIs de historial de costo por hora

- `POST /api/historial-costo-hora`: registra un nuevo costo por hora para un empleado.
- `GET /api/historial-costo-hora/empleado/{empleadoId}`: lista el historial de costos por hora de un empleado.

## APIs de planillas

- `POST /api/planillas`: crea una planilla para la empresa actual.
- `GET /api/planillas/{id}`: obtiene una planilla por id.
- `GET /api/planillas`: lista las planillas de la empresa.

## APIs de ingresos

- `POST /api/ingresos`: registra un ingreso para la empresa actual.
- `GET /api/ingresos`: lista todos los ingresos de la empresa.
- `GET /api/ingresos/proyecto/{proyectoId}`: lista los ingresos asociados a un proyecto.
- `DELETE /api/ingresos/{id}`: elimina un ingreso.

## APIs de egresos

- `POST /api/egresos`: registra un egreso para la empresa actual.
- `GET /api/egresos`: lista todos los egresos de la empresa.
- `GET /api/egresos/proyecto/{proyectoId}`: lista los egresos asociados a un proyecto.
- `DELETE /api/egresos/{id}`: elimina un egreso.

## APIs de categorías de egreso

- `POST /api/categorias-egreso`: crea una categoría de egreso para la empresa actual.
- `GET /api/categorias-egreso`: lista las categorías de egreso activas de la empresa.
- `DELETE /api/categorias-egreso/{id}`: desactiva una categoría de egreso.

## APIs de métricas

- `POST /api/metricas/proyecto/{proyectoId}/snapshot`: genera y guarda un snapshot de métricas de un proyecto.
- `GET /api/metricas/proyecto/{proyectoId}`: lista el historial de snapshots de métricas de un proyecto.
- `GET /api/metricas/proyecto/{proyectoId}/actual`: calcula la rentabilidad actual del proyecto en tiempo real.

## Observaciones útiles

- Los módulos de empleados, clientes, proyectos y tareas manejan recursos activos e inactivos.
- Algunos endpoints validan roles antes de permitir crear, editar, aprobar o eliminar.
- En autenticación, el backend diferencia entre `empleado` y `duenio`.
- El backend corre por defecto en el puerto `8080`.
