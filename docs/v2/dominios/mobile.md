---
id: mobile
title: "Aplicaciones Móviles"
sidebar_label: "Aplicaciones Móviles"
---

# Dominio: Aplicaciones Móviles

OSDO v2 proporciona cobertura de seguridad especializada para aplicaciones móviles Android e iOS, abarcando desde el análisis estático del código fuente con reglas específicas para plataformas móviles hasta el análisis de los binarios compilados. Este dominio cubre las principales categorías del OWASP Mobile Application Security Verification Standard (MASVS) con una cobertura estimada del 70%.

## Cobertura de seguridad

Las aplicaciones móviles se benefician de las siguientes capacidades de OSDO v2:

- **SAST con reglas móviles** — análisis estático con reglas especializadas para Kotlin, Java, Swift y Objective-C
- **Análisis de binarios con MobSF** — análisis estático y dinámico de APKs e IPAs
- **SCA** — verificación de vulnerabilidades en dependencias de terceros de Android (Gradle) e iOS (CocoaPods, SPM)
- **SBOM** — inventario completo de componentes de la aplicación móvil

## Acciones recomendadas

| Acción | Plataforma | Propósito | Cuándo ejecutar |
|--------|-----------|-----------|-----------------|
| `osdo-sast` | Android/iOS | Análisis estático con reglas móviles | En cada pull request |
| `osdo-mobile-scan` | Android/iOS | Análisis de binario con MobSF | En cada build de release |
| `osdo-sca` | Android/iOS | Vulnerabilidades en dependencias | En cada pull request |
| `osdo-sbom` | Android/iOS | Inventario de componentes | En cada release |

## Configuración recomendada para proyectos móviles

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
      source-path: './app/src/main'
      fail-on-severity: 'high'
    secrets: inherit
```

## Cobertura OWASP MASVS

| Categoría MASVS | Descripción | Cobertura OSDO | Acción(es) responsable(s) |
|-----------------|-------------|----------------|--------------------------|
| MASVS-STORAGE | Almacenamiento seguro de datos | Alta | `osdo-mobile-scan`, `osdo-sast` |
| MASVS-CRYPTO | Uso correcto de criptografía | Alta | `osdo-sast`, `osdo-mobile-scan` |
| MASVS-AUTH | Autenticación y gestión de sesiones | Media | `osdo-sast`, `osdo-mobile-scan` |
| MASVS-NETWORK | Comunicaciones de red seguras | Alta | `osdo-mobile-scan` |
| MASVS-PLATFORM | Interacción con la plataforma | Alta | `osdo-mobile-scan`, `osdo-sast` |
| MASVS-CODE | Calidad y robustez del código | Media | `osdo-sast`, `osdo-sca` |
| MASVS-RESILIENCE | Resistencia a la ingeniería inversa | Baja | `osdo-mobile-scan` |

## Reglas Semgrep específicas para móvil

OSDO v2 incluye reglas Semgrep especializadas para detectar:

**Android (Kotlin/Java):**
- Uso inseguro de `SharedPreferences` para datos sensibles
- Componentes exportados sin validación de permisos (`android:exported=true`)
- Uso de `WebView` con `JavascriptInterface` vulnerable
- Almacenamiento de datos sensibles en logs
- Uso de algoritmos criptográficos débiles (DES, MD5, SHA1)

**iOS (Swift/Objective-C):**
- Almacenamiento de datos sensibles en `UserDefaults` sin cifrado
- Uso de `NSLog` para datos sensibles en producción
- Configuración insegura de `NSAppTransportSecurity`
- Uso de `UIWebView` (deprecado) en lugar de `WKWebView`
- Validación insuficiente de certificados SSL

## Cobertura estimada

| Categoría | Cobertura |
|-----------|-----------|
| Análisis estático de código (SAST) | ~65% de los controles MASVS |
| Análisis de binario (MobSF) | ~70% de los controles MASVS |
| Vulnerabilidades de dependencias | ~90% de CVEs publicados |
| Cobertura combinada | ~70% del OWASP MASVS |

## Notas

- El análisis de binarios con MobSF requiere que el APK o IPA esté firmado con la firma de release; los builds de debug pueden no reflejar el estado de seguridad final de la aplicación.
- Para análisis iOS, la ejecución en un runner macOS es necesaria para algunas verificaciones específicas de la plataforma Apple.
- La cobertura del 70% refleja las capacidades de análisis automatizado; para aplicaciones que manejan datos altamente sensibles, se recomienda complementar con una revisión manual de seguridad orientada al OWASP MSTG.
