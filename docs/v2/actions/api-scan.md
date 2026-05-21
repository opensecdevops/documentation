---
id: api-scan
title: "osdo-api-scan"
sidebar_label: "api-scan"
---

# osdo-api-scan

Acción para el análisis de seguridad de APIs REST y GraphQL. Combina la auditoría de contratos OpenAPI con 42Crunch y la validación contra el OWASP API Security Top 10 para detectar vulnerabilidades en el diseño y la implementación de APIs, incluyendo problemas de autenticación, autorización excesiva y exposición de datos sensibles.

## Herramientas utilizadas

- **42Crunch** — plataforma de auditoría de APIs que analiza especificaciones OpenAPI para detectar vulnerabilidades y violaciones de buenas prácticas de diseño
- **OWASP API Security Top 10** — framework de referencia para la evaluación de las vulnerabilidades más críticas en APIs modernas

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `openapi-file` | `string` | Sí | — | Ruta al archivo de especificación OpenAPI (JSON o YAML) |
| `target-url` | `string` | No | — | URL base de la API desplegada para pruebas dinámicas (opcional) |
| `fail-on-severity` | `string` | No | `medium` | Umbral de severidad para fallo del pipeline: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-api-scan@v2
  with:
    openapi-file: './api/openapi.yaml'
    target-url: 'https://staging-api.myapp.com'
    fail-on-severity: 'high'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `api-report` | Ruta al informe de auditoría de la API |
| `score` | Puntuación de seguridad de la API según 42Crunch (0-100) |
| `issues-count` | Número total de problemas de seguridad detectados |
| `owasp-api-top10-mapping` | Mapeo de los hallazgos al OWASP API Security Top 10 |

## Notas

- El análisis estático de la especificación OpenAPI puede detectar problemas de diseño sin necesidad de tener la API desplegada. Se recomienda ejecutar siempre este análisis.
- Si se proporciona `target-url`, la acción realiza también pruebas dinámicas contra la API desplegada, aumentando la cobertura de hallazgos.
- 42Crunch requiere que la especificación OpenAPI sea válida según OAS 3.x. Se recomienda validar el contrato previamente con herramientas como `spectral`.
- El informe incluye una puntuación de seguridad de 0 a 100 que puede usarse como métrica de seguimiento en el tiempo.
