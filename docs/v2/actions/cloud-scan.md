---
id: cloud-scan
title: "osdo-cloud-scan"
sidebar_label: "cloud-scan"
---

# osdo-cloud-scan

Acción para el análisis de seguridad de configuraciones e infraestructura en la nube. Combina Checkov y Prowler para auditar la postura de seguridad de entornos cloud en AWS, GCP y Azure, detectando configuraciones inseguras, incumplimientos de políticas de seguridad y desviaciones de los benchmarks CIS y los marcos de cumplimiento regulatorio.

## Herramientas utilizadas

- **Checkov** — herramienta de análisis de IaC que también soporta escaneo de configuraciones cloud mediante políticas predefinidas para múltiples frameworks de cumplimiento
- **Prowler** — herramienta de auditoría de seguridad cloud de código abierto; evalúa la postura de seguridad contra CIS Benchmarks, AWS Well-Architected, GDPR, SOC2 y otros estándares

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `provider` | `string` | Sí | — | Proveedor de nube a auditar: `aws`, `gcp`, `azure` |
| `credentials-path` | `string` | No | — | Ruta al archivo de credenciales del proveedor cloud (si no se usan variables de entorno) |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para fallo del pipeline: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-cloud-scan@v2
  with:
    provider: 'aws'
    fail-on-severity: 'high'
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: 'us-east-1'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `cloud-report` | Ruta al informe consolidado de seguridad cloud |
| `checkov-report` | Ruta al informe específico de Checkov |
| `prowler-report` | Ruta al informe específico de Prowler |
| `findings-count` | Número total de hallazgos de seguridad |
| `cis-compliance-score` | Porcentaje de cumplimiento del CIS Benchmark correspondiente al proveedor |

## Notas

- Las credenciales cloud deben configurarse preferiblemente mediante variables de entorno o roles IAM de GitHub Actions (OIDC) en lugar del parámetro `credentials-path` para mayor seguridad.
- Para AWS, se recomienda usar roles IAM con permisos de solo lectura (principio de mínimo privilegio) asignados específicamente para el escaneo con Prowler.
- Prowler soporta más de 300 verificaciones para AWS y más de 100 para GCP y Azure, cubriendo aspectos como gestión de identidades, cifrado, registro y monitoreo.
- Se recomienda ejecutar esta acción de forma programada (scheduled) además de en los pipelines de CI para detectar cambios de configuración realizados manualmente fuera de IaC.
