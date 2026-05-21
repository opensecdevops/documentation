---
id: cloud-security
title: "osdo-cloud-security"
sidebar_label: "cloud-security"
---

# osdo-cloud-security

Workflow para la auditoría de seguridad multi-cloud. Evalúa la postura de seguridad de entornos en AWS, GCP y Azure de forma unificada, combinando el análisis de la infraestructura como código con la auditoría en tiempo real de la configuración cloud. Detecta desviaciones de los benchmarks CIS, incumplimientos de marcos regulatorios (SOC2, GDPR, PCI-DSS) y configuraciones de riesgo antes de que afecten a los entornos productivos.

## Descripción general

Este workflow puede configurarse para auditar uno o múltiples proveedores cloud simultáneamente, generando informes unificados que facilitan la visibilidad de la postura de seguridad en entornos multi-cloud.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con Checkov, Prowler y las herramientas cloud
- **osdo-iac-scan** — análisis de la infraestructura como código (Terraform, CloudFormation)
- **osdo-cloud-scan** — auditoría en tiempo real de la configuración cloud con Prowler y Checkov
- **osdo-compliance-report** — generación del informe de cumplimiento multi-framework (CIS, SOC2, PCI-DSS)

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `providers` | `string` | No | `aws` | Proveedores cloud a auditar (separados por coma): `aws`, `gcp`, `azure` |
| `iac-path` | `string` | No | `./infrastructure` | Ruta a los archivos IaC del proyecto |
| `compliance-frameworks` | `string` | No | `cis` | Frameworks de cumplimiento a evaluar: `cis`, `soc2`, `pci-dss`, `gdpr`, `hipaa` |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para bloqueo del pipeline |

## Ejemplo de uso

```yaml
name: OSDO Cloud Security

on:
  schedule:
    - cron: '0 6 * * 1'  # Todos los lunes a las 6:00 UTC
  push:
    paths:
      - 'infrastructure/**'

jobs:
  cloud-security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-cloud-security.yml@v2
    with:
      providers: 'aws,gcp'
      iac-path: './infrastructure'
      compliance-frameworks: 'cis,soc2'
      fail-on-severity: 'high'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `cloud-security-report` | Artefacto con el informe consolidado de seguridad cloud |
| `cis-score-aws` | Puntuación de cumplimiento CIS Benchmark para AWS |
| `cis-score-gcp` | Puntuación de cumplimiento CIS Benchmark para GCP |
| `cis-score-azure` | Puntuación de cumplimiento CIS Benchmark para Azure |
| `compliance-report` | Artefacto con el informe de cumplimiento multi-framework |

## Notas

- Para auditar entornos cloud en tiempo real, las credenciales deben configurarse como secretos de GitHub. Se recomienda usar roles IAM con permisos de solo lectura y OIDC donde sea posible.
- La ejecución programada semanal (`schedule`) es especialmente útil para detectar cambios de configuración realizados manualmente fuera del proceso IaC (configuration drift).
- Para entornos multi-cuenta de AWS o multi-proyecto de GCP, se puede iterar sobre las cuentas/proyectos usando una estrategia de matriz en el job.
- El informe de cumplimiento incluye evidencia de los controles satisfechos y fallidos, lo cual es útil para preparar auditorías externas de SOC2 o PCI-DSS.
