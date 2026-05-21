---
id: policy-gate
title: "osdo-policy-gate"
sidebar_label: "policy-gate"
---

# osdo-policy-gate

Acción para la evaluación de políticas de seguridad como compuertas de control en el pipeline. Utiliza Kyverno y OPA Conftest para verificar que los recursos y artefactos cumplan con las políticas definidas por la organización antes de permitir el avance del workflow. Permite implementar controles de gobierno como código.

## Herramientas utilizadas

- **Kyverno** — motor de políticas para Kubernetes de CNCF; evalúa recursos Kubernetes contra políticas declarativas en formato YAML
- **OPA Conftest** — herramienta de prueba de configuraciones usando Open Policy Agent (OPA); permite escribir políticas en Rego para evaluar cualquier formato de configuración estructurada

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `policy-path` | `string` | Sí | — | Ruta al directorio o archivo de políticas a aplicar |
| `target` | `string` | Sí | — | Ruta al recurso o configuración a evaluar contra las políticas |
| `engine` | `string` | No | `conftest` | Motor de políticas a usar: `conftest` (OPA/Rego) o `kyverno` |
| `fail-on-violation` | `boolean` | No | `true` | Falla el pipeline si alguna política es violada |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-policy-gate@v2
  with:
    policy-path: './policies/security'
    target: './k8s/manifests'
    engine: 'conftest'
    fail-on-violation: true
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `policy-report` | Ruta al informe de evaluación de políticas |
| `violations-count` | Número total de violaciones de política detectadas |
| `passed-policies` | Número de políticas evaluadas que pasaron correctamente |
| `failed-policies` | Lista de políticas que fallaron |

## Notas

- Para OPA Conftest, las políticas deben escribirse en lenguaje Rego. Se pueden organizar en paquetes por dominio (ej. `package kubernetes.security`, `package docker.security`).
- Kyverno es especialmente útil para evaluar manifiestos de Kubernetes; las políticas se definen como recursos YAML de tipo `ClusterPolicy` o `Policy`.
- Esta acción puede usarse para validar resultados de otros escaneos (ej. verificar que el informe SARIF de SAST no supere un número máximo de hallazgos críticos).
- Se recomienda versionar las políticas en el mismo repositorio que el código de infraestructura para mantener la coherencia entre el código y las restricciones aplicadas.
