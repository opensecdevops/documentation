---
id: sbom
title: "osdo-sbom"
sidebar_label: "sbom"
---

# osdo-sbom

Acción para la generación de Listas de Materiales de Software (SBOM, por sus siglas en inglés). Produce un inventario exhaustivo de todos los componentes, dependencias y metadatos de una aplicación o imagen de contenedor, siguiendo los estándares CycloneDX y SPDX. Fundamental para la transparencia de la cadena de suministro de software.

## Herramientas utilizadas

- **Syft** — generador de SBOM de Anchore que analiza imágenes de contenedores, directorios y archivos; soporta múltiples formatos de salida
- **CycloneDX** — estándar de SBOM del OWASP; las herramientas CLI de CycloneDX enriquecen el SBOM con metadatos de vulnerabilidades y licencias

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del directorio o imagen de contenedor a analizar |
| `format` | `string` | No | `cyclonedx-json` | Formato de salida del SBOM: `cyclonedx-json`, `cyclonedx-xml`, `spdx-json`, `spdx-tv` |
| `output-file` | `string` | No | `sbom.json` | Nombre del archivo de salida para el SBOM generado |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-sbom@v2
  with:
    path: '.'
    format: 'cyclonedx-json'
    output-file: 'sbom-${{ github.sha }}.json'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `sbom-path` | Ruta al archivo SBOM generado |
| `component-count` | Número total de componentes identificados en el SBOM |
| `sbom-format` | Formato del SBOM generado |

## Notas

- El SBOM generado puede subirse como artefacto del workflow y adjuntarse al release de GitHub para distribución con el artefacto de software.
- Para imágenes de contenedores, especifica el nombre de la imagen en `path` (ej. `myapp:latest`). Syft detectará automáticamente si se trata de una imagen o un directorio.
- El formato `cyclonedx-json` es el recomendado para interoperabilidad con otras herramientas de OSDO como `osdo-sca` y `osdo-sign`.
- Se puede combinar con `osdo-sign` para firmar el SBOM y garantizar su integridad mediante Sigstore/Cosign.
