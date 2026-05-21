---
id: mobile-scan
title: "osdo-mobile-scan"
sidebar_label: "mobile-scan"
---

# osdo-mobile-scan

Acción para el análisis de seguridad de aplicaciones móviles Android e iOS. Combina MobSF (Mobile Security Framework) con reglas especializadas de Semgrep para detectar vulnerabilidades en aplicaciones móviles, incluyendo almacenamiento inseguro de datos, comunicaciones inseguras, permisos excesivos y exposición de información sensible.

## Herramientas utilizadas

- **MobSF** — framework de análisis de seguridad móvil automatizado; realiza análisis estático y dinámico de APKs, IPAs y archivos ZIP de código fuente
- **Semgrep iOS/Android** — reglas especializadas de Semgrep para detectar patrones inseguros en código Swift, Objective-C, Kotlin y Java móvil

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `apk-path` | `string` | No | — | Ruta al archivo APK de Android a analizar |
| `ipa-path` | `string` | No | — | Ruta al archivo IPA de iOS a analizar |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para fallo del pipeline: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-mobile-scan@v2
  with:
    apk-path: './build/app-release.apk'
    fail-on-severity: 'high'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `mobsf-report` | Ruta al informe detallado de MobSF en formato JSON |
| `security-score` | Puntuación de seguridad de la aplicación según MobSF (0-100) |
| `vulnerabilities-count` | Número total de vulnerabilidades detectadas |
| `semgrep-report` | Ruta al informe de Semgrep con hallazgos en código fuente |

## Notas

- Al menos uno de los parámetros `apk-path` o `ipa-path` es obligatorio. Se puede proporcionar ambos para analizar versiones Android e iOS en el mismo job.
- MobSF se ejecuta como un contenedor Docker durante el análisis; asegúrate de que el runner de GitHub Actions tenga Docker disponible.
- Para análisis de código fuente (no binario), se puede proporcionar la ruta al directorio del proyecto en lugar de un archivo compilado, y MobSF realizará un análisis estático del código.
- La puntuación de seguridad de MobSF va de 0 (inseguro) a 100 (seguro); se recomienda establecer un umbral mínimo de 70 como requisito para el merge.
