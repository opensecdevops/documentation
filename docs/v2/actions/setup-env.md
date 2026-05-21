---
id: setup-env
title: "osdo-setup-env"
sidebar_label: "setup-env"
---

# osdo-setup-env

Acción de configuración del entorno de herramientas de seguridad. Instala y almacena en caché todas las herramientas necesarias para los escaneos de OSDO, configura las versiones de lenguajes de programación requeridas y optimiza los tiempos de ejecución del pipeline mediante un sistema de caché inteligente. Se recomienda usarla al inicio del workflow para preparar el entorno.

## Herramientas utilizadas

- **Herramientas de seguridad OSDO** — Semgrep, Bandit, ESLint, OSV-Scanner, Gitleaks, Trivy, Grype, Checkov, Syft, Cosign y otras herramientas del ecosistema OSDO
- **Caché de GitHub Actions** — sistema de caché para reutilizar instalaciones de herramientas entre ejecuciones del pipeline

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `tools` | `string` | No | `all` | Lista separada por comas de herramientas a instalar, o `all` para instalar todas |
| `node-version` | `string` | No | `20` | Versión de Node.js a configurar en el entorno |
| `python-version` | `string` | No | `3.11` | Versión de Python a configurar en el entorno |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-setup-env@v2
  with:
    tools: 'semgrep,trivy,cosign'
    node-version: '20'
    python-version: '3.11'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `cache-hit` | Booleano indicando si las herramientas se cargaron desde caché |
| `tools-installed` | Lista de herramientas instaladas exitosamente |
| `node-version` | Versión de Node.js configurada en el entorno |
| `python-version` | Versión de Python configurada en el entorno |

## Notas

- Se recomienda agregar esta acción como el primer paso en cualquier job que use herramientas de OSDO para garantizar que el entorno esté correctamente configurado.
- El sistema de caché guarda las instalaciones de herramientas usando el hash de la versión instalada como clave, invalidando el caché automáticamente cuando hay actualizaciones.
- Si se usa `tools: all`, la instalación puede tardar varios minutos en la primera ejecución; en ejecuciones subsiguientes el caché reduce el tiempo a menos de 30 segundos.
- Para entornos de runners auto-hospedados (self-hosted), algunas herramientas pueden ya estar disponibles; la acción detectará las instalaciones existentes y las reutilizará.
