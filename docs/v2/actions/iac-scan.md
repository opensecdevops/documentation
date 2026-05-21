---
id: iac-scan
title: "osdo-iac-scan"
sidebar_label: "iac-scan"
---

# osdo-iac-scan

Acción para el análisis de seguridad de Infraestructura como Código (IaC). Detecta configuraciones inseguras, incumplimientos de políticas y malas prácticas en archivos de Terraform, Kubernetes y Ansible utilizando Checkov y Terrascan. Esencial para prevenir configuraciones deficientes que lleguen a entornos productivos.

## Herramientas utilizadas

- **Checkov** — herramienta de análisis estático para IaC de Bridgecrew/Prisma Cloud; soporta Terraform, CloudFormation, Kubernetes, Helm, ARM y más
- **Terrascan** — escáner de políticas de seguridad para IaC de Tenable; detecta violaciones de cumplimiento antes del aprovisionamiento

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del directorio con los archivos de IaC a analizar |
| `framework` | `string` | No | `terraform` | Framework objetivo: `terraform`, `kubernetes`, `ansible`, `cloudformation`, `helm` |
| `fail-on-severity` | `string` | No | `high` | Severidad mínima para fallo del pipeline: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-iac-scan@v2
  with:
    path: './infrastructure/terraform'
    framework: 'terraform'
    fail-on-severity: 'high'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `scan-report` | Ruta al informe consolidado de vulnerabilidades IaC |
| `violations-count` | Número total de violaciones detectadas |
| `checkov-report` | Ruta al informe específico de Checkov en formato JSON |
| `terrascan-report` | Ruta al informe específico de Terrascan |
| `passed-checks` | Número de verificaciones que pasaron exitosamente |

## Notas

- Para proyectos Terraform con módulos externos, asegúrate de ejecutar `terraform init` antes de esta acción para que Checkov pueda analizar los módulos descargados.
- Es posible personalizar las reglas usando archivos `.checkov.yaml` y `terrascan.toml` en la raíz del proyecto para ignorar controles específicos o definir umbrales personalizados.
- En el caso de Kubernetes, la acción analiza tanto manifiestos YAML estáticos como charts de Helm si se especifica `framework: helm`.
- Se recomienda ejecutar esta acción en pull requests que modifiquen archivos de infraestructura para obtener retroalimentación temprana.
