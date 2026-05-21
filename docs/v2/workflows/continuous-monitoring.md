---
id: continuous-monitoring
title: "osdo-continuous-monitoring"
sidebar_label: "continuous-monitoring"
---

# osdo-continuous-monitoring

Workflow para la monitorización continua de la postura de seguridad del proyecto. Ejecuta escaneos programados de forma periódica para detectar nuevas vulnerabilidades en dependencias, cambios de configuración no autorizados y degradaciones en la postura de seguridad que se producen sin cambios en el código fuente. Integra alertas y notificaciones para garantizar una respuesta oportuna ante nuevos riesgos.

## Descripción general

A diferencia de los workflows orientados a cambios de código, `osdo-continuous-monitoring` opera de forma periódica y autónoma, detectando vulnerabilidades recién publicadas en dependencias existentes, cambios en el estado de la infraestructura cloud y desviaciones de las líneas base de seguridad establecidas.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno de herramientas actualizado con las últimas definiciones de vulnerabilidades
- **osdo-sca** — re-escaneo periódico de dependencias con las bases de datos de CVEs más recientes
- **osdo-secrets-scan** — verificación periódica de que no se hayan introducido secretos en el historial reciente
- **osdo-cloud-scan** — auditoría periódica de la postura de seguridad cloud para detectar configuration drift
- **osdo-compliance-report** — generación del informe de cumplimiento periódico

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `schedule` | `string` | No | `0 6 * * 1` | Expresión cron para la programación del escaneo periódico |
| `notify-channel` | `string` | No | — | Canal o webhook para enviar notificaciones ante hallazgos nuevos |
| `severity-threshold` | `string` | No | `high` | Severidad mínima para generar alertas y notificaciones |
| `enable-cloud-scan` | `boolean` | No | `false` | Habilitar el escaneo de seguridad cloud en el monitoreo continuo |

## Ejemplo de uso

```yaml
name: OSDO Continuous Monitoring

on:
  schedule:
    - cron: '0 6 * * 1,4'  # Lunes y jueves a las 6:00 UTC
  workflow_dispatch:  # Permite ejecución manual

jobs:
  continuous-monitoring:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-continuous-monitoring.yml@v2
    with:
      severity-threshold: 'high'
      enable-cloud-scan: true
    secrets:
      NOTIFY_WEBHOOK: ${{ secrets.SECURITY_SLACK_WEBHOOK }}
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `monitoring-report` | Artefacto con el informe de monitoreo del periodo |
| `new-vulnerabilities` | Número de nuevas vulnerabilidades detectadas desde el último escaneo |
| `trend-data` | Datos de tendencia de la postura de seguridad en el tiempo |
| `alerts-sent` | Booleano indicando si se enviaron alertas por nuevos hallazgos |

## Notas

- El workflow compara los resultados actuales con los del escaneo anterior para identificar únicamente las vulnerabilidades **nuevas**, evitando notificaciones redundantes por hallazgos ya conocidos.
- Las notificaciones se envían al `notify-channel` únicamente cuando se detectan nuevos hallazgos por encima del umbral de severidad configurado, reduciendo el ruido de alertas.
- Se recomienda habilitar `workflow_dispatch` junto con el trigger `schedule` para permitir ejecuciones manuales ante incidentes de seguridad que requieran verificación inmediata.
- Los datos históricos de los escaneos se almacenan como artefactos con retención de 90 días, permitiendo analizar tendencias y el progreso en la mejora de la postura de seguridad.
