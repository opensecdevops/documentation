---
id: sca
title: "osdo-sca"
sidebar_label: "sca"
---

# osdo-sca

Acción para análisis de composición de software (SCA). Identifica vulnerabilidades conocidas en dependencias de terceros utilizando OSV-Scanner y OWASP Dependency-Check. Compatible con los principales gestores de paquetes del ecosistema moderno. Los resultados se mapean a la base de datos OSV y a la NVD de NIST.

## Herramientas utilizadas

- **OSV-Scanner** — escáner de vulnerabilidades de código abierto desarrollado por Google, basado en la base de datos OSV (Open Source Vulnerabilities)
- **OWASP Dependency-Check** — herramienta de análisis de dependencias que detecta CVEs conocidos en librerías de terceros

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del proyecto donde se encuentran los archivos de dependencias |
| `package-manager` | `string` | No | `auto` | Gestor de paquetes: `npm`, `pip`, `maven`, `gradle`, `cargo`, `go`, `auto` |
| `fail-on-vulnerability` | `boolean` | No | `true` | Falla el pipeline si se detectan vulnerabilidades |
| `severity-threshold` | `string` | No | `medium` | Umbral mínimo de severidad para fallo: `low`, `medium`, `high`, `critical` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-sca@v2
  with:
    path: '.'
    package-manager: 'npm'
    fail-on-vulnerability: true
    severity-threshold: 'high'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `vulnerability-report` | Ruta al informe de vulnerabilidades en formato JSON |
| `vulnerability-count` | Número total de vulnerabilidades encontradas |
| `critical-count` | Número de vulnerabilidades críticas detectadas |
| `sbom-path` | Ruta al SBOM generado durante el análisis (formato CycloneDX) |

## Notas

- Con `package-manager: auto`, la acción detecta automáticamente el tipo de proyecto según los archivos de manifiesto presentes (`package.json`, `requirements.txt`, `pom.xml`, etc.).
- OWASP Dependency-Check requiere descargar la base de datos NVD en la primera ejecución. Se recomienda habilitar el caché de GitHub Actions para acelerar ejecuciones posteriores.
- Los resultados de ambas herramientas se consolidan y se deduplican por CVE antes de evaluar el umbral de severidad.
