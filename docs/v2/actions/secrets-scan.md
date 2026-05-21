---
id: secrets-scan
title: "osdo-secrets-scan"
sidebar_label: "secrets-scan"
---

# osdo-secrets-scan

Acción para la detección de secretos y credenciales expuestas en el código fuente o en el historial de git. Combina Gitleaks y detect-secrets para maximizar la cobertura en diferentes modalidades de escaneo. Previene la exposición de tokens de API, contraseñas, claves privadas y otros secretos sensibles.

## Herramientas utilizadas

- **Gitleaks** — herramienta de detección de secretos en repositorios git, analiza el historial de commits y el árbol de trabajo actual
- **detect-secrets** — solución de Yelp para detectar secretos con soporte para múltiples tipos de credenciales y línea base de falsos positivos

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del repositorio o directorio a escanear |
| `mode` | `string` | No | `git` | Modo de escaneo: `git` (historial completo) o `filesystem` (archivos actuales) |
| `fail-on-finding` | `boolean` | No | `true` | Falla el pipeline si se detectan secretos |
| `report-format` | `string` | No | `sarif` | Formato del informe: `sarif` o `json` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-secrets-scan@v2
  with:
    path: '.'
    mode: 'git'
    fail-on-finding: true
    report-format: 'sarif'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `secrets-report` | Ruta al informe de secretos detectados |
| `secrets-count` | Número total de secretos encontrados |
| `gitleaks-report` | Ruta al informe específico de Gitleaks |
| `detect-secrets-report` | Ruta al informe específico de detect-secrets |

## Notas

- En el modo `git`, se analiza todo el historial del repositorio incluyendo commits eliminados. Esto puede ser lento en repositorios con historial extenso; se recomienda limitar el rango con `--since` si es necesario.
- Se puede configurar un archivo `.gitleaks.toml` en la raíz del repositorio para personalizar reglas y definir falsos positivos conocidos.
- Para detect-secrets, es posible mantener una línea base (`.secrets.baseline`) que excluya secretos ya conocidos y revisados.
- Esta acción debe ejecutarse en las primeras etapas del pipeline para evitar la propagación de secretos a artefactos posteriores.
