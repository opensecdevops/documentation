---
id: dast-scan
title: "osdo-dast-scan"
sidebar_label: "dast-scan"
---

# osdo-dast-scan

Acción para pruebas dinámicas de seguridad de aplicaciones (DAST). Utiliza OWASP ZAP para realizar análisis de seguridad sobre aplicaciones en ejecución, detectando vulnerabilidades que solo se manifiestan en tiempo de ejecución como XSS, inyecciones SQL, problemas de autenticación y configuraciones inseguras de cabeceras HTTP.

## Herramientas utilizadas

- **OWASP ZAP** — proxy de seguridad de aplicaciones web de OWASP (Zed Attack Proxy); soporta escaneos automatizados baseline, completos y orientados a APIs REST/GraphQL

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `target-url` | `string` | Sí | — | URL de la aplicación objetivo a escanear (ej. `https://staging.myapp.com`) |
| `scan-type` | `string` | No | `baseline` | Tipo de escaneo: `baseline` (pasivo, rápido), `full` (activo, completo), `api` (orientado a APIs) |
| `fail-on-risk-codes` | `string` | No | `3,4` | Códigos de riesgo que causan fallo del pipeline: 1=Bajo, 2=Medio, 3=Alto, 4=Crítico |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-dast-scan@v2
  with:
    target-url: 'https://staging.myapp.com'
    scan-type: 'baseline'
    fail-on-risk-codes: '3,4'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `zap-report` | Ruta al informe HTML detallado generado por ZAP |
| `json-report` | Ruta al informe JSON estructurado de ZAP |
| `alerts-count` | Número total de alertas detectadas por severidad |
| `high-alerts` | Número de alertas de riesgo alto o crítico |

## Notas

- El escaneo de tipo `baseline` ejecuta solo reglas pasivas y es adecuado para pipelines de CI rápidos (tiempo típico: 2-5 minutos).
- El escaneo `full` ejecuta reglas activas que envían peticiones potencialmente maliciosas al objetivo; **nunca ejecutar contra entornos de producción**.
- Para APIs, usar `scan-type: api` junto con un archivo de definición OpenAPI mejora significativamente la cobertura y reduce los falsos positivos.
- Se recomienda ejecutar esta acción contra un entorno de staging o preview desplegado en el mismo pipeline (deploy-then-scan).
