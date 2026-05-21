---
id: instalacion
title: "Instalación del CLI"
sidebar_label: "Instalación"
---

# Instalación del CLI de OSDO v2

El CLI de OSDO v2 (`osdo-cli`) está construido con [oclif](https://oclif.io/) sobre Node.js y se distribuye como paquete npm.

## Requisitos previos

| Requisito       | Versión mínima | Cómo verificar          |
|-----------------|----------------|-------------------------|
| Node.js         | >= 20.0.0      | `node --version`        |
| npm             | >= 8.0.0       | `npm --version`         |
| Git             | >= 2.30        | `git --version`         |
| Homebrew (opt.) | cualquiera     | `brew --version`        |

Para instalar Node.js 20 LTS si aún no lo tienes:

```bash
# Con nvm (recomendado)
nvm install 20
nvm use 20

# Con Homebrew
brew install node@20
```

---

## Métodos de instalación

### Opción 1: npm global (recomendado)

```bash
npm install -g @osdo/cli
```

Este método instala el binario `osdo` de forma global y lo hace disponible en cualquier directorio.

### Opción 2: npx (sin instalación permanente)

Si prefieres no instalar el CLI globalmente o quieres probar una versión específica:

```bash
npx @osdo/cli --version
npx @osdo/cli scan --help
```

### Opción 3: Homebrew (macOS / Linux)

```bash
brew tap opensecdevops/tap
brew install osdo-cli
```

### Opción 4: Desde el código fuente

Para contribuidores o usuarios que necesiten la versión de desarrollo:

```bash
# Clonar el repositorio
git clone https://github.com/opensecdevops/osdo-cli.git
cd osdo-cli

# Instalar dependencias
npm install

# Construir
npm run build

# Enlazar globalmente
npm link

# Verificar
osdo --version
```

---

## Verificación de la instalación

Una vez instalado, verifica que el CLI funciona correctamente:

```bash
osdo --version
# osdo/2.0.0 darwin-arm64 node-v20.x.x

osdo --help
```

La salida de `osdo --help` debe mostrar todos los comandos disponibles:

```
OSDO CLI v2.0.0 — Open Secure DevOps

USAGE
  $ osdo [COMMAND]

COMMANDS
  app       Integración con OSDO App (login, pull, push, status)
  catalog   Explorar el catálogo de actions y workflows
  certify   Gestionar certificaciones de seguridad
  config    Gestionar configuración del proyecto (.osdo/config.yaml)
  deploy    Operaciones de despliegue
  init      Inicializar OSDO en un proyecto
  monitor   Métricas de seguridad en tiempo real (Prometheus/Alertmanager)
  pipeline  Gestionar pipelines de CI/CD
  preset    Aplicar presets de seguridad por tipo de proyecto
  scan      Ejecutar escaneos de seguridad (Trivy/Grype)
  security  Operaciones de seguridad avanzadas
  status    Ver estado del proyecto y pipeline

OPCIONES GLOBALES
  --help     (-h)  Mostrar ayuda
  --version  (-v)  Mostrar versión
  --json           Salida en formato JSON
  --no-color       Deshabilitar colores en la terminal
```

---

## Configuración de autocompletado de shell

El CLI incluye soporte de autocompletado para bash, zsh y fish.

### bash

```bash
# Generar el script de completado
osdo autocomplete bash

# Activarlo en la sesión actual
source <(osdo autocomplete:script bash)

# Activarlo permanentemente
echo 'source <(osdo autocomplete:script bash)' >> ~/.bashrc
source ~/.bashrc
```

### zsh

```bash
# Generar el script de completado
osdo autocomplete zsh

# Activarlo en la sesión actual
source <(osdo autocomplete:script zsh)

# Activarlo permanentemente
echo 'source <(osdo autocomplete:script zsh)' >> ~/.zshrc
source ~/.zshrc
```

### fish

```bash
# Generar el script de completado
osdo autocomplete fish

# Activarlo permanentemente (fish lo instala automáticamente)
osdo autocomplete:script fish > ~/.config/fish/completions/osdo.fish
```

---

## Configuración inicial

Después de instalar el CLI, inicializa OSDO en tu proyecto:

```bash
# Navegar a tu repositorio
cd mi-proyecto

# Inicializar OSDO (crea .osdo/config.yaml)
osdo init

# Ver la configuración generada
cat .osdo/config.yaml
```

El comando `osdo init` detecta automáticamente el tipo de proyecto (web-app, mobile, etc.) y genera una configuración adaptada.

Para autenticarte con OSDO App (si tu organización lo usa):

```bash
osdo app login --url https://app.osdo.dev --token <tu-token>
```

Para explorar todos los comandos disponibles:

```bash
# Ayuda general
osdo --help

# Ayuda de un comando específico
osdo scan --help
osdo app --help
osdo monitor --help
```

---

## Actualización

Para actualizar a la última versión del CLI:

```bash
# npm global
npm update -g @osdo/cli

# Verificar nueva versión
osdo --version
```

## Desinstalación

```bash
# npm global
npm uninstall -g @osdo/cli

# Homebrew
brew uninstall osdo-cli
```
