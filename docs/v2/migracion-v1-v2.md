---
id: migracion-v1-v2
title: "Migración de v1 a v2"
sidebar_label: "Migración v1 → v2"
---

# Migración de v1 a v2

Esta guía cubre todos los cambios necesarios para migrar un proyecto de OSDO v1 a OSDO v2.

:::warning Cambios incompatibles
OSDO v2 introduce cambios que rompen la compatibilidad con v1. Lee esta guía completa antes de actualizar.
:::

## Resumen de cambios incompatibles (Breaking Changes)

| Componente              | v1                                    | v2                                        |
|-------------------------|---------------------------------------|-------------------------------------------|
| CLI — instalación       | `go install github.com/osdo/osdo-infra-cli@latest` | `npm install -g @osdo/cli`     |
| CLI — nombre binario    | `osdo-infra-cli`                      | `osdo`                                    |
| Config — campo versión  | No requerido                          | `version: "2.0"` obligatorio              |
| Actions — referencia    | `@v1` o `@main`                       | `@v2`                                     |
| Workflows — referencia  | `@v1` o `@main`                       | `@v2`                                     |

---

## Paso 1: Reemplazar el CLI

### Desinstalar CLI v1 (Go)

```bash
# Si instalaste con go install
rm $(go env GOPATH)/bin/osdo-infra-cli

# O si está en /usr/local/bin
sudo rm /usr/local/bin/osdo-infra-cli
```

### Instalar CLI v2 (Node.js)

Requiere Node.js >= 20 y npm >= 8.

```bash
# Instalación global recomendada
npm install -g @osdo/cli

# Verificar instalación
osdo --version
# osdo/2.0.0 darwin-arm64 node-v20.x.x
```

---

## Paso 2: Actualizar `.osdo/config.yaml`

El esquema de configuración ha cambiado en v2. El campo `version` ahora es obligatorio.

### Config v1 (deprecada)

```yaml
project:
  name: mi-aplicacion
  type: web-app

security:
  sast: true
  sca: true
```

### Config v2 (requerida)

```yaml
version: "2.0"

project:
  name: mi-aplicacion
  type: web-app  # web-app | mobile | smart-contract | genai

security:
  sast: true
  sca: true
  secrets: true
  container: false
  iac: false

thresholds:
  critical: 0
  high: 5
  medium: 20
```

Puedes usar el CLI para migrar automáticamente:

```bash
osdo config migrate
```

Este comando lee el `config.yaml` existente, añade `version: "2.0"` y rellena los campos nuevos con sus valores por defecto.

---

## Paso 3: Actualizar referencias de Actions de `@v1` a `@v2`

Busca todos los archivos de workflow que referencien actions de OSDO y actualiza el tag:

```bash
# Buscar todas las referencias a v1 en workflows
grep -r "opensecdevops/osdo-actions" .github/workflows/

# Reemplazar @v1 y @main por @v2
sed -i 's|opensecdevops/osdo-actions/\(.*\)@v1|opensecdevops/osdo-actions/\1@v2|g' .github/workflows/*.yml
sed -i 's|opensecdevops/osdo-actions/\(.*\)@main|opensecdevops/osdo-actions/\1@v2|g' .github/workflows/*.yml
```

**Antes (v1):**
```yaml
- uses: opensecdevops/osdo-actions/sast@v1
- uses: opensecdevops/osdo-actions/sca@main
```

**Después (v2):**
```yaml
- uses: opensecdevops/osdo-actions/sast@v2
- uses: opensecdevops/osdo-actions/sca@v2
```

---

## Paso 4: Actualizar referencias de Workflows de `@v1` a `@v2`

```yaml
# Antes (v1)
jobs:
  security:
    uses: opensecdevops/osdo-workflows/.github/workflows/osdo-framework.yml@v1

# Después (v2)
jobs:
  security:
    uses: opensecdevops/osdo-workflows/.github/workflows/osdo-framework.yml@v2
```

---

## Paso 5: Aprender los nuevos comandos `osdo app`

v2 introduce el subcomando `osdo app` para interactuar con OSDO App. Si usabas comandos del CLI v1 para descargar configuraciones, ahora debes usar:

| v1 (obsoleto)                          | v2                          |
|----------------------------------------|-----------------------------|
| `osdo-infra-cli download-config`       | `osdo app pull`             |
| `osdo-infra-cli upload-results`        | `osdo app push`             |
| `osdo-infra-cli auth --token <token>`  | `osdo app login --token <token>` |

---

## Checklist de migración

Usa esta lista para asegurarte de que no te dejas ningún paso:

- [ ] Desinstalado `osdo-infra-cli` (CLI v1 en Go)
- [ ] Instalado `@osdo/cli` v2 via npm (`npm install -g @osdo/cli`)
- [ ] Verificado `osdo --version` muestra `2.x.x`
- [ ] Ejecutado `osdo config migrate` en todos los repositorios
- [ ] Comprobado que `.osdo/config.yaml` contiene `version: "2.0"`
- [ ] Actualizadas todas las references de actions de `@v1`/`@main` a `@v2`
- [ ] Actualizadas todas las references de workflows de `@v1`/`@main` a `@v2`
- [ ] Probado un pipeline completo en una rama de prueba
- [ ] Revisados los logs del CLI para confirmar ausencia de warnings de deprecación
- [ ] Actualizado `COMPATIBILITY.md` del repositorio (si existe)

---

## Problemas comunes

### Error: `osdo: command not found`

Asegúrate de que el directorio de binarios globales de npm está en tu `PATH`:

```bash
# Ver dónde instala npm los binarios globales
npm config get prefix
# /usr/local

# Añadir al PATH (bash/zsh)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Error: `config.yaml: campo 'version' requerido`

El archivo `.osdo/config.yaml` no tiene el campo `version: "2.0"`. Ejecuta:

```bash
osdo config migrate
```

### Error: `action not found at @v1`

Las actions referenciadas con `@v1` ya no son compatibles con las entradas de v2. Actualiza todas las referencias a `@v2` siguiendo el Paso 3.

### Warning: `CLI v1 config schema detectado`

El CLI v2 detecta automáticamente configuraciones v1 y muestra este warning. Ejecuta `osdo config migrate` para eliminar el warning.
