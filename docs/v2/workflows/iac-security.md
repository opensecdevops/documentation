---
id: iac-security
title: "osdo-iac-security"
sidebar_label: "iac-security"
---

# osdo-iac-security

Workflow para el análisis de seguridad de Infraestructura como Código. Cubre los principales frameworks de IaC utilizados en entornos modernos: Terraform, Kubernetes y Ansible. Detecta configuraciones inseguras, desviaciones de los benchmarks de seguridad y violaciones de políticas de la organización antes de que la infraestructura sea aprovisionada o desplegada.

## Descripción general

Este workflow integra el escaneo estático de IaC con la evaluación de políticas personalizadas, garantizando que los cambios en la infraestructura cumplan con los estándares de seguridad y cumplimiento antes de ser aplicados en cualquier entorno.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con Checkov, Terrascan y las herramientas necesarias
- **osdo-iac-scan** — análisis de seguridad con Checkov y Terrascan según el framework
- **osdo-secrets-scan** — detección de secretos embebidos en archivos de configuración IaC
- **osdo-policy-gate** — evaluación de políticas personalizadas de la organización sobre los manifiestos IaC

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `iac-path` | `string` | No | `.` | Ruta al directorio con los archivos de IaC a analizar |
| `framework` | `string` | No | `terraform` | Framework a analizar: `terraform`, `kubernetes`, `ansible`, `helm` |
| `policy-path` | `string` | No | `.osdo/policies/iac` | Ruta a las políticas personalizadas para el policy-gate |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para bloqueo del pipeline |

## Ejemplo de uso

```yaml
name: OSDO IaC Security

on:
  pull_request:
    paths:
      - 'infrastructure/**'
      - 'k8s/**'
      - '*.tf'

jobs:
  iac-security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-iac-security.yml@v2
    with:
      iac-path: './infrastructure'
      framework: 'terraform'
      fail-on-severity: 'medium'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `scan-report` | Artefacto con el informe consolidado de seguridad IaC |
| `violations-count` | Número total de violaciones de seguridad detectadas |
| `policy-gate-passed` | Booleano indicando si se superaron las políticas de la organización |
| `checkov-report` | Artefacto con el informe detallado de Checkov |

## Notas

- Se recomienda configurar este workflow con un trigger en `paths` para ejecutarse únicamente cuando se modifican archivos de infraestructura, reduciendo el tiempo de ejecución del pipeline general.
- Para Terraform, es necesario ejecutar `terraform init` como paso previo para que las herramientas puedan analizar los módulos externos.
- El workflow incluye comentarios automáticos en pull requests de GitHub con un resumen de los hallazgos, facilitando la revisión por el equipo.
- Para entornos con múltiples workspaces de Terraform, se recomienda parametrizar el `iac-path` y ejecutar el workflow en modo matriz.
