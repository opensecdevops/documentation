---
id: framework
title: "osdo-framework"
sidebar_label: "framework"
---

# osdo-framework

Workflow orquestador principal de OSDO v2. Actúa como punto de entrada unificado para la seguridad del ciclo de vida de desarrollo de software, activando automáticamente los escaneos de SAST, SCA y detección de secretos, con una compuerta de políticas configurable que permite adaptar el nivel de exigencia a las necesidades de cada proyecto u organización.

## Descripción general

El workflow `osdo-framework` es el workflow recomendado para adoptar OSDO desde cero. Orquesta los escaneos fundamentales de seguridad y aplica políticas de bloqueo configurables, proporcionando una cobertura de seguridad de base sólida con una configuración mínima.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno de herramientas de seguridad
- **osdo-secrets-scan** — detección de secretos y credenciales expuestas
- **osdo-sast** — análisis estático de código fuente
- **osdo-sca** — análisis de composición de software y dependencias
- **osdo-policy-gate** — evaluación de políticas de seguridad como compuerta final

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `enable-sast` | `boolean` | No | `true` | Habilitar el escaneo SAST |
| `enable-sca` | `boolean` | No | `true` | Habilitar el análisis SCA |
| `enable-secrets` | `boolean` | No | `true` | Habilitar la detección de secretos |
| `policy-path` | `string` | No | `.osdo/policies` | Ruta al directorio de políticas de seguridad para el policy-gate |
| `severity-threshold` | `string` | No | `high` | Umbral de severidad para fallos: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
name: OSDO Security Framework

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-framework.yml@v2
    with:
      enable-sast: true
      enable-sca: true
      enable-secrets: true
      severity-threshold: 'high'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `framework-passed` | Booleano indicando si todos los controles del framework pasaron |
| `consolidated-report` | Artefacto con el informe consolidado de todos los escaneos |
| `policy-gate-result` | Resultado de la evaluación de la compuerta de políticas |

## Notas

- Este es el workflow de entrada recomendado para equipos que adoptan OSDO por primera vez; proporciona cobertura inmediata con configuración mínima.
- El orden de ejecución garantiza que la detección de secretos se realice primero, antes de que ninguna herramienta que acceda a la red sea ejecutada.
- Para proyectos maduros con requisitos de seguridad más específicos, se recomienda migrar a los workflows especializados (`osdo-container-security`, `osdo-supply-chain`, etc.) en función del tipo de aplicación.
- Los resultados se publican automáticamente en el panel de seguridad de GitHub (Security tab) mediante el upload de informes SARIF.
