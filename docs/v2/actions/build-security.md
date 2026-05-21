---
id: build-security
title: "osdo-build-security"
sidebar_label: "build-security"
---

# osdo-build-security

Acción para el endurecimiento (hardening) del proceso de construcción de software. Implementa medidas de seguridad durante la fase de build para garantizar la integridad de los artefactos generados, incluyendo la firma de los binarios producidos, la verificación de la cadena de dependencias y la aplicación de controles de seguridad sobre el propio proceso de compilación.

## Herramientas utilizadas

- **Cosign** — para la firma criptográfica de los artefactos de build generados, garantizando su autenticidad e integridad
- **Controles de endurecimiento del build** — verificaciones de integridad del entorno de construcción, validación de dependencias y aplicación de flags de seguridad en la compilación

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `build-command` | `string` | Sí | — | Comando de construcción del proyecto a ejecutar bajo condiciones endurecidas |
| `sign-artifacts` | `boolean` | No | `true` | Firmar automáticamente los artefactos generados después del build |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-build-security@v2
  with:
    build-command: 'npm run build:production'
    sign-artifacts: true
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `build-report` | Ruta al informe de seguridad del proceso de build |
| `artifacts-signed` | Lista de artefactos firmados durante el proceso de build |
| `build-hash` | Hash SHA-256 del directorio de artefactos generados |
| `hardening-score` | Puntuación de endurecimiento del proceso de build (0-100) |

## Notas

- El endurecimiento del build incluye la validación de que las dependencias instaladas corresponden exactamente a los hashes especificados en el archivo de lock (`package-lock.json`, `poetry.lock`, `go.sum`, etc.).
- Si `sign-artifacts: true`, la acción firma todos los artefactos generados usando Cosign en modo keyless, requiriendo el permiso `id-token: write` en el job.
- Se verifica que el proceso de build no realice descargas de red no autorizadas ni accesos a recursos externos no declarados, reduciendo el riesgo de ataques a la cadena de suministro durante la compilación.
- Esta acción es especialmente importante para proyectos que distribuyen binarios o paquetes públicos, donde la integridad del proceso de build es crítica para la confianza de los usuarios finales.
