---
id: mobile-security
title: "osdo-mobile-security"
sidebar_label: "mobile-security"
---

# osdo-mobile-security

Workflow para el análisis de seguridad integral de aplicaciones móviles Android e iOS. Combina el análisis estático del código fuente, el análisis del binario compilado con MobSF y la generación del SBOM de las dependencias móviles. Cubre las categorías del OWASP Mobile Security Testing Guide (MSTG) para garantizar que las aplicaciones móviles cumplan con los estándares de seguridad antes de su publicación en las tiendas de aplicaciones.

## Descripción general

Este workflow aborda los vectores de ataque específicos de aplicaciones móviles, incluyendo el almacenamiento inseguro de datos, las comunicaciones sin cifrar, la exportación incorrecta de componentes y las vulnerabilidades en el código nativo.

## Acciones utilizadas

- **osdo-setup-env** — configura el entorno con MobSF, Semgrep y las herramientas móviles
- **osdo-sast** — análisis estático del código fuente con reglas específicas para Android (Kotlin/Java) e iOS (Swift/Objective-C)
- **osdo-mobile-scan** — análisis del binario compilado (APK/IPA) con MobSF
- **osdo-sbom** — generación del SBOM de las dependencias de la aplicación móvil
- **osdo-sca** — verificación de vulnerabilidades en las dependencias de terceros

## Entradas del workflow

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `platform` | `string` | Sí | — | Plataforma objetivo: `android`, `ios`, `both` |
| `apk-path` | `string` | No | — | Ruta al archivo APK de Android (requerido si `platform` es `android` o `both`) |
| `ipa-path` | `string` | No | — | Ruta al archivo IPA de iOS (requerido si `platform` es `ios` o `both`) |
| `source-path` | `string` | No | `.` | Ruta al código fuente para el análisis SAST |
| `fail-on-severity` | `string` | No | `high` | Umbral de severidad para bloqueo del pipeline |

## Ejemplo de uso

```yaml
name: OSDO Mobile Security

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  mobile-security:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-mobile-security.yml@v2
    with:
      platform: 'android'
      apk-path: './build/app-release.apk'
      source-path: './app/src'
      fail-on-severity: 'high'
    secrets: inherit
```

## Salidas del workflow

| Salida | Descripción |
|--------|-------------|
| `mobile-security-score` | Puntuación de seguridad global de la aplicación móvil |
| `mobsf-report` | Artefacto con el informe detallado de MobSF |
| `sast-report` | Artefacto con los hallazgos del análisis estático de código móvil |
| `sbom-path` | Ruta al SBOM de las dependencias de la aplicación |
| `owasp-mstg-coverage` | Porcentaje de controles del OWASP MSTG cubiertos |

## Notas

- MobSF se ejecuta como un servicio Docker durante el análisis; el runner de GitHub Actions debe soportar Docker-in-Docker o estar configurado con Docker disponible.
- Para aplicaciones iOS, el análisis del IPA incluye verificaciones de configuraciones de seguridad de transporte (ATS), permisos solicitados y uso de criptografía.
- Para aplicaciones Android, se verifican las configuraciones del `AndroidManifest.xml`, el uso de permisos peligrosos, la exportación de componentes y el cifrado de datos en reposo.
- Los resultados incluyen el porcentaje de cobertura del OWASP Mobile Security Testing Guide (MSTG) para las categorías MASVS-STORAGE, MASVS-CRYPTO, MASVS-AUTH y MASVS-NETWORK.
