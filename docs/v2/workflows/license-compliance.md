---
id: license-compliance
title: "osdo-license-compliance"
sidebar_label: "license-compliance"
---

# osdo-license-compliance

Workflow para la gestión y verificación del cumplimiento de licencias de software. Combina el análisis de licencias de dependencias con la aplicación de políticas de licencias de la organización, generando informes detallados para revisiones legales y auditorías de cumplimiento. Previene la introducción accidental de dependencias con licencias incompatibles o restrictivas.

## Descripción general

Este workflow implementa un proceso sistemático de verificación de licencias que se ejecuta en cada cambio de dependencias, garantizando que el proyecto siempre cumpla con la política de licencias aprobada por el equipo legal.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con FOSSA, license-checker y las herramientas de análisis de licencias
- **osdo-license-scan** — análisis de licencias de todas las dependencias del proyecto
- **osdo-policy-gate** — evaluación de la política de licencias aprobadas por la organización
- **osdo-compliance-report** — generación del informe de cumplimiento de licencias

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del proyecto a analizar |
| `allowed-licenses` | `string` | No | `MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC` | Lista de licencias permitidas por la organización |
| `policy-file` | `string` | No | `.osdo/license-policy.yaml` | Ruta al archivo de política de licencias de la organización |
| `fail-on-violation` | `boolean` | No | `true` | Falla el pipeline si se detectan licencias no permitidas |

## Ejemplo de uso

```yaml
name: OSDO License Compliance

on:
  pull_request:
    paths:
      - 'package.json'
      - 'package-lock.json'
      - 'requirements.txt'
      - 'pom.xml'
      - 'go.mod'

jobs:
  license-compliance:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-license-compliance.yml@v2
    with:
      path: '.'
      allowed-licenses: 'MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC,MPL-2.0'
      fail-on-violation: true
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `license-report` | Artefacto con el informe completo de licencias |
| `violations-count` | Número de dependencias con licencias no permitidas |
| `license-summary` | Resumen de tipos de licencias detectados en el proyecto |
| `compliance-passed` | Booleano indicando si el proyecto cumple la política de licencias |

## Notas

- Se recomienda configurar el trigger en `paths` para que el workflow se active únicamente cuando cambian los archivos de dependencias, evitando ejecuciones innecesarias.
- La política de licencias (`policy-file`) debe ser definida y aprobada por el equipo legal antes de configurarse en el pipeline, y revisada periódicamente ante cambios regulatorios.
- Las licencias copyleft fuertes (GPL-2.0, GPL-3.0, AGPL-3.0) y las licencias con cláusulas de publicidad pueden requerir acciones legales específicas; el workflow genera alertas diferenciadas para este tipo de licencias.
- Para proyectos que usan FOSSA como solución comercial de gestión de licencias, se puede configurar la integración con la API de FOSSA proporcionando `FOSSA_API_KEY` como secreto.
