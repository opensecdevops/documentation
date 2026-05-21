---
id: supply-chain
title: "osdo-supply-chain"
sidebar_label: "supply-chain"
---

# osdo-supply-chain

Workflow para la seguridad integral de la cadena de suministro de software. Implementa las mejores prácticas de SLSA nivel 3 combinando la generación de SBOM, la firma criptográfica de artefactos y la generación de attestations de procedencia. Garantiza la trazabilidad completa del origen y el proceso de construcción de los artefactos distribuidos.

## Descripción general

Este workflow implementa el conjunto completo de controles de cadena de suministro recomendados por SLSA L3 y OpenSSF, proporcionando attestations verificables para cada artefacto producido por el pipeline.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con Syft, Cosign y slsa-github-generator
- **osdo-sca** — verificación de vulnerabilidades en dependencias como primer control
- **osdo-sbom** — generación del SBOM completo del proyecto con Syft en formato CycloneDX
- **osdo-sign** — firma criptográfica del artefacto principal y el SBOM con Cosign keyless
- **osdo-slsa-provenance** — generación de attestations de procedencia SLSA L3

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `artifact-path` | `string` | Sí | — | Ruta al artefacto o directorio de artefactos a proteger |
| `image` | `string` | No | — | Referencia a la imagen de contenedor (si aplica) para firma y attestation |
| `sbom-format` | `string` | No | `cyclonedx-json` | Formato del SBOM a generar: `cyclonedx-json`, `spdx-json` |
| `upload-assets` | `boolean` | No | `true` | Subir artefactos, SBOM y provenance como activos del release |

## Ejemplo de uso

```yaml
name: OSDO Supply Chain Security

on:
  release:
    types: [published]

jobs:
  supply-chain:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-supply-chain.yml@v2
    with:
      artifact-path: './dist'
      image: 'ghcr.io/${{ github.repository }}:${{ github.ref_name }}'
      upload-assets: true
    secrets: inherit
    permissions:
      id-token: write
      contents: write
      packages: write
      attestations: write
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `sbom-path` | Ruta al SBOM generado |
| `provenance-path` | Ruta al archivo de provenance SLSA L3 |
| `signature-ref` | Referencia a la firma en el registro OCI |
| `slsa-level` | Nivel SLSA alcanzado por los artefactos |
| `rekor-log-id` | Identificador de la entrada en el registro de transparencia Rekor |

## Notas

- Este workflow está diseñado para ejecutarse en el contexto de un release de GitHub, donde los artefactos finales ya están compilados y listos para distribución.
- Los permisos `id-token: write` y `attestations: write` son obligatorios para la firma keyless con Cosign y la generación de attestations SLSA L3.
- Los consumidores de los artefactos pueden verificar la provenance usando `slsa-verifier verify-artifact` con el artefacto descargado y el repositorio de origen.
- El SBOM firmado puede ser verificado independientemente con `cosign verify-attestation` para garantizar que no ha sido manipulado después de su generación.
