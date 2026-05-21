---
id: api-security
title: "osdo-api-security"
sidebar_label: "api-security"
---

# osdo-api-security

Workflow para la seguridad integral de APIs REST y GraphQL. Combina la validación del contrato OpenAPI, la auditoría de seguridad con 42Crunch y las pruebas dinámicas contra la API desplegada. Cubre las principales vulnerabilidades del OWASP API Security Top 10 tanto en la fase de diseño (análisis del contrato) como en la fase de ejecución (pruebas dinámicas).

## Descripción general

Este workflow implementa una estrategia de seguridad de API en capas: primero valida la especificación, luego audita el diseño y finalmente prueba la implementación real. Esto permite detectar problemas tanto en el contrato como en el comportamiento real de la API.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con las herramientas de análisis de APIs
- **osdo-api-scan** — auditoría del contrato OpenAPI con 42Crunch y verificación del OWASP API Top 10
- **osdo-dast-scan** — pruebas dinámicas orientadas a APIs con OWASP ZAP en modo `api`
- **osdo-compliance-report** — generación del informe de cumplimiento mapeando hallazgos al OWASP API Top 10

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `openapi-file` | `string` | Sí | — | Ruta a la especificación OpenAPI del proyecto (JSON o YAML) |
| `target-url` | `string` | No | — | URL base de la API desplegada para pruebas dinámicas |
| `fail-on-severity` | `string` | No | `medium` | Umbral de severidad para bloqueo del pipeline |
| `enable-dynamic-scan` | `boolean` | No | `false` | Habilitar las pruebas dinámicas con ZAP (requiere `target-url`) |

## Ejemplo de uso

```yaml
name: OSDO API Security

on:
  pull_request:
    paths:
      - 'api/**'
      - 'openapi.yaml'
      - 'openapi.json'

jobs:
  api-security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-api-security.yml@v2
    with:
      openapi-file: './api/openapi.yaml'
      target-url: 'https://staging-api.myapp.com'
      enable-dynamic-scan: true
      fail-on-severity: 'medium'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `api-security-score` | Puntuación de seguridad global de la API (0-100) |
| `api-report` | Artefacto con el informe completo de seguridad de la API |
| `owasp-api-top10-report` | Mapeo de hallazgos al OWASP API Security Top 10 |
| `contract-valid` | Booleano indicando si el contrato OpenAPI es válido y seguro |

## Notas

- El análisis estático del contrato OpenAPI se ejecuta siempre; las pruebas dinámicas solo se activan si `enable-dynamic-scan: true` y se proporciona `target-url`.
- Se recomienda habilitar las pruebas dinámicas únicamente en pipelines que tienen acceso a un entorno de staging, no en builds de pull requests que no despliegan la aplicación.
- El workflow valida automáticamente que el archivo OpenAPI cumpla con la especificación OAS 3.x antes de ejecutar la auditoría de seguridad.
- Los hallazgos del OWASP API Top 10 se clasifican por categoría (API1-API10) para facilitar la priorización y la asignación de responsabilidades de remediación.
