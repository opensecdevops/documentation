---
id: security-gate
title: "osdo-security-gate"
sidebar_label: "security-gate"
---

# osdo-security-gate

Acción orquestadora que ejecuta múltiples escaneos de seguridad de forma consolidada. Actúa como compuerta de seguridad unificada en el pipeline, combinando SAST, SCA y detección de secretos en una sola acción configurable. Simplifica la adopción de seguridad en proyectos que necesitan una solución integral sin configurar múltiples acciones independientes.

## Herramientas utilizadas

- **Semgrep / Bandit / ESLint** — para análisis estático de código (SAST), según los lenguajes detectados
- **OSV-Scanner / OWASP Dependency-Check** — para análisis de vulnerabilidades en dependencias (SCA)
- **Gitleaks / detect-secrets** — para detección de secretos y credenciales expuestas

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `enable-sast` | `boolean` | No | `true` | Habilitar el escaneo SAST de código fuente |
| `enable-sca` | `boolean` | No | `true` | Habilitar el análisis de composición de software (SCA) |
| `enable-secrets` | `boolean` | No | `true` | Habilitar la detección de secretos en el repositorio |
| `fail-on-severity` | `string` | No | `high` | Severidad mínima para fallo del pipeline: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-security-gate@v2
  with:
    enable-sast: true
    enable-sca: true
    enable-secrets: true
    fail-on-severity: 'high'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `gate-passed` | Booleano indicando si el pipeline superó la compuerta de seguridad |
| `consolidated-report` | Ruta al informe consolidado de todos los escaneos |
| `total-findings` | Número total de hallazgos entre todos los escaneos habilitados |
| `sast-findings` | Número de hallazgos del escaneo SAST |
| `sca-findings` | Número de vulnerabilidades encontradas en SCA |
| `secrets-findings` | Número de secretos detectados |

## Notas

- Esta acción es ideal para proyectos que están adoptando DevSecOps por primera vez y necesitan una configuración mínima para obtener cobertura de seguridad básica.
- Para mayor control y personalización, se recomienda usar las acciones individuales (`osdo-sast`, `osdo-sca`, `osdo-secrets-scan`) con configuraciones específicas.
- El informe consolidado agrega los resultados de todos los escaneos habilitados en un único artefacto descargable desde la interfaz de GitHub Actions.
- Se puede configurar `fail-on-severity: critical` para reducir los falsos positivos en las primeras etapas de adopción y aumentar gradualmente el nivel de exigencia.
