---
id: sast
title: "osdo-sast"
sidebar_label: "sast"
---

# osdo-sast

Acción para realizar análisis estático de seguridad del código fuente (SAST). Combina Semgrep, Bandit y ESLint para detectar vulnerabilidades en múltiples lenguajes de programación, incluyendo Python, JavaScript, TypeScript y otros. Los resultados se consolidan en un único informe y pueden configurarse para bloquear el pipeline ante hallazgos críticos.

## Herramientas utilizadas

- **Semgrep** — motor de análisis estático multilenguaje con reglas de seguridad mantenidas por la comunidad y Semgrep OSS
- **Bandit** — analizador de seguridad específico para Python que detecta patrones inseguros comunes
- **ESLint** — linter para JavaScript/TypeScript con plugins de seguridad como `eslint-plugin-security`

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del código fuente a analizar |
| `scanners` | `string` | No | `semgrep,bandit,eslint` | Lista separada por comas de los escáneres a usar |
| `fail-on-finding` | `boolean` | No | `true` | Falla el pipeline si se encuentran vulnerabilidades |
| `severity-threshold` | `string` | No | `medium` | Umbral mínimo de severidad: `low`, `medium`, `high`, `critical` |
| `output-format` | `string` | No | `sarif` | Formato del informe de salida: `sarif`, `json`, `text` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-sast@v2
  with:
    path: './src'
    scanners: 'semgrep,bandit'
    fail-on-finding: true
    severity-threshold: 'high'
    output-format: 'sarif'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `sarif-report` | Ruta al informe SARIF generado con los hallazgos |
| `findings-count` | Número total de vulnerabilidades encontradas |
| `high-severity-count` | Número de vulnerabilidades de severidad alta o crítica |

## Notas

- Los resultados en formato SARIF son compatibles con GitHub Code Scanning y pueden subirse directamente usando `github/codeql-action/upload-sarif`.
- Si se utilizan los tres escáneres simultáneamente, el tiempo de ejecución puede incrementarse. Se recomienda ajustar `scanners` según el lenguaje predominante del proyecto.
- Para proyectos Python, se recomienda combinar Semgrep con Bandit. Para proyectos JavaScript/TypeScript, Semgrep con ESLint ofrece la mayor cobertura.
