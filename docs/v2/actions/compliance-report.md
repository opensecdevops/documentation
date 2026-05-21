---
id: compliance-report
title: "osdo-compliance-report"
sidebar_label: "compliance-report"
---

# osdo-compliance-report

Acción para la generación de informes de cumplimiento normativo a partir de los resultados de los escaneos de seguridad. Mapea los hallazgos de las herramientas de OSDO a los controles de frameworks reconocidos como OWASP Top 10, SLSA y OpenSSF Scorecard, generando informes consolidados para auditorías y revisiones de cumplimiento.

## Herramientas utilizadas

- **OWASP Top 10** — framework de referencia para clasificar las vulnerabilidades más críticas en aplicaciones web
- **SLSA** — framework de niveles de seguridad para la cadena de suministro de software (Supply-chain Levels for Software Artifacts)
- **OpenSSF Scorecard** — herramienta de evaluación de prácticas de seguridad en proyectos de código abierto

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `results-path` | `string` | Sí | — | Ruta al directorio que contiene los informes de escaneo de las acciones de OSDO |
| `format` | `string` | No | `markdown` | Formato del informe de cumplimiento generado: `markdown` o `html` |
| `output-file` | `string` | No | `compliance-report.md` | Nombre del archivo de salida para el informe de cumplimiento |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-compliance-report@v2
  with:
    results-path: './security-results'
    format: 'html'
    output-file: 'compliance-report-${{ github.sha }}.html'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `report-path` | Ruta al informe de cumplimiento generado |
| `owasp-compliance-score` | Puntuación de cumplimiento OWASP Top 10 (porcentaje de controles satisfechos) |
| `slsa-level` | Nivel SLSA alcanzado según los artefactos y prácticas detectadas |
| `openssf-score` | Puntuación OpenSSF Scorecard del repositorio |

## Notas

- Esta acción debe ejecutarse al final del pipeline, después de que todas las acciones de escaneo hayan generado sus informes, para poder consolidar todos los resultados.
- Los informes de las acciones de OSDO deben guardarse en el directorio especificado en `results-path` usando `actions/upload-artifact` y `actions/download-artifact`.
- El formato `html` genera un informe visual más adecuado para presentar a equipos de auditoría y gestión; el formato `markdown` es preferible para revisiones en pull requests.
- El mapeo OWASP cubre las 10 categorías del OWASP Top 10 más reciente, indicando qué controles se verificaron y cuáles tuvieron hallazgos.
