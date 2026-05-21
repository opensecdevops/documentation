---
id: dast
title: "osdo-dast"
sidebar_label: "dast"
---

# osdo-dast

Workflow para pruebas dinámicas de seguridad de aplicaciones web. Orquesta el despliegue de un entorno de staging, la configuración de autenticación para OWASP ZAP, la ejecución del escaneo activo o pasivo, y el análisis y publicación de los resultados. Diseñado para integrarse en pipelines de entrega continua donde se dispone de un entorno efímero de pruebas.

## Descripción general

El workflow DAST complementa el análisis estático (SAST/SCA) detectando vulnerabilidades que solo son visibles en tiempo de ejecución, como problemas de configuración del servidor, vulnerabilidades de sesión y comportamientos inesperados ante entradas maliciosas.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con OWASP ZAP y las herramientas de análisis
- **osdo-dast-scan** — ejecuta el escaneo ZAP con el tipo y configuración especificados
- **osdo-compliance-report** — genera el informe de cumplimiento mapeando los hallazgos al OWASP Top 10

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `target-url` | `string` | Sí | — | URL de la aplicación a escanear en el entorno de staging |
| `scan-type` | `string` | No | `baseline` | Tipo de escaneo ZAP: `baseline`, `full`, `api` |
| `auth-script` | `string` | No | — | Ruta a un script de autenticación personalizado para ZAP |
| `openapi-spec` | `string` | No | — | Ruta a la especificación OpenAPI para escaneo orientado a APIs |
| `fail-on-risk-codes` | `string` | No | `3,4` | Códigos de riesgo ZAP que causan fallo del pipeline |

## Ejemplo de uso

```yaml
name: OSDO DAST

on:
  deployment_status:

jobs:
  dast:
    if: github.event.deployment_status.state == 'success'
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-dast.yml@v2
    with:
      target-url: ${{ github.event.deployment_status.target_url }}
      scan-type: 'baseline'
      fail-on-risk-codes: '3,4'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `zap-report` | Artefacto con el informe HTML detallado de ZAP |
| `alerts-summary` | Resumen de alertas por nivel de riesgo |
| `owasp-mapping` | Mapeo de los hallazgos a las categorías del OWASP Top 10 |
| `dast-passed` | Booleano indicando si el escaneo pasó los umbrales definidos |

## Notas

- El evento `deployment_status` permite ejecutar el escaneo automáticamente cuando un entorno de preview o staging está disponible, sin necesidad de configurar URLs estáticas.
- Para autenticación, el `auth-script` debe implementar el protocolo de autenticación de ZAP (Selenium o basado en formularios); se proporcionan scripts de ejemplo en el repositorio.
- El escaneo `full` puede tardar entre 15 y 60 minutos dependiendo del tamaño de la aplicación; se recomienda para entornos de pre-producción y no para cada pull request.
- Los resultados se publican como comentario en el pull request asociado al deployment cuando el workflow se activa via `deployment_status`.
