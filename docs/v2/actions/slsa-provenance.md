---
id: slsa-provenance
title: "osdo-slsa-provenance"
sidebar_label: "slsa-provenance"
---

# osdo-slsa-provenance

Acción para la generación de attestations de procedencia SLSA (Supply-chain Levels for Software Artifacts). Utiliza slsa-github-generator para producir attestations verificables de nivel SLSA L3 que documentan el origen y el proceso de construcción de los artefactos de software, mejorando la seguridad de la cadena de suministro.

## Herramientas utilizadas

- **slsa-github-generator** — generador oficial de SLSA de Google para GitHub Actions; produce attestations firmadas que cumplen con los requisitos SLSA L3 en entornos de CI/CD

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `binary` | `string` | Sí | — | Ruta al binario o artefacto para el que se genera la provenance |
| `upload-assets` | `boolean` | No | `true` | Subir el artefacto y su provenance como activos del release de GitHub |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-slsa-provenance@v2
  with:
    binary: './dist/myapp-linux-amd64'
    upload-assets: true
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `provenance-file` | Ruta al archivo de provenance generado en formato SLSA |
| `provenance-sha256` | Hash SHA-256 del archivo de provenance |
| `slsa-level` | Nivel SLSA alcanzado (ej. `SLSA_L3`) |

## Notas

- La generación de attestations SLSA L3 requiere que el workflow se ejecute en un entorno de GitHub Actions con permisos `id-token: write` para obtener el token OIDC necesario para la firma.
- El workflow que utilice esta acción debe estar aislado en un job dedicado para cumplir con los requisitos de aislamiento de SLSA L3, separando el build del proceso de generación de provenance.
- Los attestations generados se pueden verificar usando `slsa-verifier verify-artifact` proporcionando el artefacto, la provenance y el repositorio de origen.
- Se recomienda combinar esta acción con `osdo-sign` para también firmar los binarios de forma independiente con Cosign.
