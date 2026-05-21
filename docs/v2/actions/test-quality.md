---
id: test-quality
title: "osdo-test-quality"
sidebar_label: "test-quality"
---

# osdo-test-quality

Acción para la verificación de la calidad de las pruebas automatizadas y la cobertura de código. Ejecuta la suite de pruebas del proyecto usando Jest o PHPUnit, genera informes de cobertura y valida que se alcancen los umbrales mínimos definidos. Garantiza que el código mantenga estándares de calidad y pruebas adecuados antes de la integración.

## Herramientas utilizadas

- **Jest** — framework de pruebas para JavaScript/TypeScript con soporte nativo de cobertura de código mediante Istanbul/V8
- **PHPUnit** — framework de pruebas unitarias estándar para PHP con generación de informes de cobertura en formato Clover y HTML

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `framework` | `string` | No | `jest` | Framework de pruebas a usar: `jest`, `phpunit`, `pytest`, `junit` |
| `coverage-threshold` | `string` | No | `80` | Porcentaje mínimo de cobertura de código requerido (0-100) |
| `test-command` | `string` | No | `auto` | Comando personalizado para ejecutar las pruebas, o `auto` para usar el comando predeterminado del framework |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-test-quality@v2
  with:
    framework: 'jest'
    coverage-threshold: '85'
    test-command: 'npm test -- --coverage'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `coverage-report` | Ruta al informe de cobertura generado |
| `coverage-percentage` | Porcentaje de cobertura de código alcanzado |
| `tests-passed` | Número de pruebas que pasaron exitosamente |
| `tests-failed` | Número de pruebas que fallaron |
| `coverage-met` | Booleano indicando si se alcanzó el umbral de cobertura |

## Notas

- Si `coverage-threshold` no se alcanza, el pipeline fallará independientemente de si las pruebas pasan. Esto asegura que el código nuevo esté adecuadamente cubierto por pruebas.
- El informe de cobertura se genera en formato compatible con Codecov y Coveralls para su visualización en dashboards externos.
- Con `test-command: auto`, la acción detecta el comando de pruebas a partir del `package.json` para Jest o el archivo `phpunit.xml` para PHPUnit.
- Se recomienda establecer un umbral de cobertura gradualmente creciente a medida que se añaden más pruebas al proyecto, evitando bloqueos abruptos del pipeline.
