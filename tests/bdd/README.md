# Gherkin / BDD

Este proyecto incluye una base de Gherkin ejecutable con `Cucumber + TypeScript`.

## Ejecutar

```bash
npm run bdd
```

Para correr solo los escenarios del módulo de horas:

```bash
npm run bdd:horas
```

## Estructura

- `tests/bdd/features/`: escenarios `.feature`
- `tests/bdd/steps/`: step definitions en TypeScript
- `app/components/horas/utils/time-entry-policy.ts`: reglas de negocio compartidas entre app y BDD

## Objetivo

Usar Gherkin para reglas de negocio y flujos críticos, por ejemplo:

- visibilidad de tareas por empleado
- registro de horas por tarea
- aprobación/rechazo de horas
- acceso por rol
