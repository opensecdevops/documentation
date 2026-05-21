---
id: container-security
title: "osdo-container-security"
sidebar_label: "container-security"
---

# osdo-container-security

Workflow para el análisis de seguridad integral de imágenes Docker. Cubre todas las fases del ciclo de vida del contenedor: desde el análisis del Dockerfile y el código fuente hasta el escaneo de la imagen construida, la generación del SBOM y la firma del artefacto final. Diseñado para integrarse en pipelines de CI/CD que producen y publican imágenes de contenedores.

## Descripción general

Este workflow ejecuta una cadena completa de verificaciones de seguridad orientadas a contenedores, garantizando que ninguna imagen vulnerable o sin firmar llegue al registro de contenedores de producción.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con las herramientas necesarias
- **osdo-sast** — análisis estático del código fuente de la aplicación
- **osdo-sca** — verificación de vulnerabilidades en dependencias
- **osdo-secrets-scan** — detección de secretos en el repositorio y el Dockerfile
- **osdo-container-scan** — escaneo de vulnerabilidades de la imagen construida con Trivy y Grype
- **osdo-sbom** — generación del SBOM de la imagen con Syft
- **osdo-sign** — firma criptográfica de la imagen y el SBOM con Cosign

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `image-name` | `string` | Sí | — | Nombre y etiqueta de la imagen Docker a construir y analizar |
| `dockerfile-path` | `string` | No | `Dockerfile` | Ruta al Dockerfile a usar para la construcción |
| `registry` | `string` | No | `ghcr.io` | Registro de contenedores donde se publicará la imagen |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para bloqueo del pipeline |

## Ejemplo de uso

```yaml
name: OSDO Container Security

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  container-security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-container-security.yml@v2
    with:
      image-name: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
      fail-on-severity: 'high'
    secrets: inherit
    permissions:
      packages: write
      id-token: write
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `image-digest` | Digest SHA256 de la imagen construida y escaneada |
| `sbom-artifact` | Nombre del artefacto con el SBOM de la imagen |
| `signature-ref` | Referencia a la firma OCI almacenada en el registro |
| `scan-passed` | Booleano indicando si la imagen superó todos los controles |

## Notas

- El workflow construye la imagen antes del escaneo; si la construcción falla, los pasos de seguridad se omiten automáticamente.
- La firma con Cosign en modo keyless requiere el permiso `id-token: write` en el job; esto se habilita a través de `permissions`.
- El SBOM generado se adjunta como attestation OCI a la imagen en el registro, permitiendo su recuperación posterior con `cosign download sbom`.
- Se recomienda ejecutar este workflow en cada push a la rama principal y en cada release, pero no en cada pull request para evitar construir imágenes innecesariamente.
