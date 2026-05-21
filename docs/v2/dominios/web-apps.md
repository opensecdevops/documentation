---
id: web-apps
title: "Aplicaciones Web"
sidebar_label: "Aplicaciones Web"
---

# Dominio: Aplicaciones Web

OSDO v2 proporciona cobertura de seguridad integral para aplicaciones web, abarcando desde el análisis estático del código fuente hasta las pruebas dinámicas de la aplicación en ejecución. Este dominio cubre las principales vulnerabilidades del OWASP Top 10 y está diseñado para integrarse en los pipelines de CI/CD de proyectos web independientemente del stack tecnológico utilizado.

## Cobertura de seguridad

Las aplicaciones web se benefician de las siguientes capacidades de OSDO v2:

- **SAST** — análisis estático de código fuente para detectar vulnerabilidades en el código de la aplicación
- **SCA** — verificación de vulnerabilidades en dependencias de terceros (npm, pip, Maven, etc.)
- **Detección de secretos** — prevención de exposición de credenciales en el repositorio
- **SBOM** — generación del inventario completo de componentes de software
- **DAST** — pruebas dinámicas sobre la aplicación en ejecución con OWASP ZAP
- **API Scan** — auditoría de seguridad de APIs REST con validación OpenAPI y 42Crunch

## Acciones recomendadas

| Acción | Propósito | Cuándo ejecutar |
|--------|-----------|-----------------|
| `osdo-sast` | Análisis estático del código fuente | En cada pull request |
| `osdo-sca` | Vulnerabilidades en dependencias | En cada pull request |
| `osdo-secrets-scan` | Detección de secretos expuestos | En cada push |
| `osdo-sbom` | Generación del inventario de software | En releases |
| `osdo-dast-scan` | Pruebas dinámicas de seguridad | En deploys a staging |
| `osdo-api-scan` | Auditoría de seguridad de APIs | En cambios de contrato OpenAPI |
| `osdo-compliance-report` | Informe de cumplimiento | En releases y auditorías |

## Mapeo OWASP Top 10

| Categoría OWASP | Cobertura OSDO | Acción(es) responsable(s) |
|-----------------|----------------|--------------------------|
| A01 - Control de acceso roto | Parcial | `osdo-dast-scan`, `osdo-sast` |
| A02 - Fallos criptográficos | Alta | `osdo-sast`, `osdo-secrets-scan` |
| A03 - Inyección | Alta | `osdo-sast`, `osdo-dast-scan` |
| A04 - Diseño inseguro | Parcial | `osdo-sast`, `osdo-api-scan` |
| A05 - Mala configuración de seguridad | Alta | `osdo-dast-scan`, `osdo-iac-scan` |
| A06 - Componentes vulnerables y desactualizados | Completa | `osdo-sca` |
| A07 - Fallos de identificación y autenticación | Parcial | `osdo-dast-scan`, `osdo-sast` |
| A08 - Fallos en la integridad del software y los datos | Alta | `osdo-sbom`, `osdo-sign`, `osdo-slsa-provenance` |
| A09 - Fallos en el registro y monitoreo de seguridad | Referencia | `osdo-compliance-report` |
| A10 - Falsificación de solicitudes del lado del servidor (SSRF) | Parcial | `osdo-sast`, `osdo-dast-scan` |

## Configuración recomendada para proyectos web

```yaml
name: OSDO Web App Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-framework.yml@v2
    with:
      enable-sast: true
      enable-sca: true
      enable-secrets: true
      severity-threshold: 'high'
    secrets: inherit

  dast:
    if: github.event_name == 'push'
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-dast.yml@v2
    needs: [security]
    with:
      target-url: 'https://staging.myapp.com'
      scan-type: 'baseline'
    secrets: inherit
```

## Cobertura estimada

| Categoría | Cobertura |
|-----------|-----------|
| Vulnerabilidades de código (SAST) | ~75% de los CWEs más comunes |
| Vulnerabilidades de dependencias (SCA) | ~95% de CVEs publicados |
| Pruebas dinámicas (DAST baseline) | ~60% del OWASP Top 10 |
| Pruebas dinámicas (DAST full) | ~80% del OWASP Top 10 |
| Seguridad de APIs | ~85% del OWASP API Top 10 |

## Notas

- La cobertura total del OWASP Top 10 se maximiza combinando escaneo SAST, SCA, DAST y API Scan en el mismo pipeline.
- Para aplicaciones web con autenticación, configurar el script de autenticación de ZAP es crítico para que el DAST pueda acceder a las funcionalidades protegidas.
- Se recomienda el workflow `osdo-framework` como punto de partida y añadir `osdo-dast` una vez que el equipo tenga un entorno de staging estable.
