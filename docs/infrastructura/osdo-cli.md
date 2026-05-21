---
title: OSDO CLI
description: Guía completa de la herramienta de línea de comandos OSDO (v2.0)
---

# OSDO CLI

**OSDO CLI** es la herramienta unificada para gestionar todo el ciclo de vida de desarrollo seguro con el Framework OSDO. En su versión **v2.0**, ha evolucionado para convertirse en un **Internal Developer Platform (IDP)** ligero, capaz no solo de desplegar infraestructura, sino también de generar pipelines de CI/CD seguros para múltiples arquitecturas.

## Instalación

```bash
# Descargar la última versión
curl -L https://github.com/osdo/osdo-infra-cli/releases/latest/download/osdo-cli -o osdo

# Dar permisos de ejecución
chmod +x osdo

# Mover al PATH
sudo mv osdo /usr/local/bin/

# Verificar instalación
osdo --help
```

## Comandos Principales

### 1. Gestión de Infraestructura (`deploy`)

Despliega el stack de herramientas DevSecOps (SonarQube, Vault, ArgoCD, etc.) en tu plataforma objetivo.

```bash
# Despliegue interactivo (Recomendado)
osdo deploy --interactive

# Despliegue rápido con presets
osdo deploy --platform kind --preset development
osdo deploy --platform k3s --preset staging
osdo deploy --platform kubernetes --preset production

# Despliegue de componentes específicos
osdo deploy --platform k3s --components sonarqube,harbor,gitlab
```

**Plataformas Soportadas:**
- Kubernetes / K3s / Kind
- Docker Swarm / Docker Compose
- Helm Charts

### 2. Generación de Pipelines (`pipeline`) <span class="badge badge--success">Nuevo en v2.0</span>

Genera workflows de CI/CD seguros (GitHub Actions o GitLab CI) con controles de seguridad pre-configurados.

```bash
# Generar pipeline interactivamente
osdo pipeline generate

# Generar pipeline para stack específico
osdo pipeline generate --type mobile --platform github --output .github/workflows/mobile-ci.yml
```

#### Templates Disponibles

| Template | Descripción | Herramientas Incluidas |
|----------|-------------|------------------------|
| **Backend** | Para APIs (Go, Node, Python) | SAST (SonarQube), Container Scan (Trivy) |
| **Frontend** | Para SPAs (React, Vue) | ESLint, Build check, S3 Deploy |
| **Mobile** | Apps iOS/Android | Fastlane, Mobile Security Framework (MobSF) |
| **Web3** | Smart Contracts | Solhint, Slither, Mythril, Foundry test |
| **GenAI** | Modelos LLM / RAG | Giskard (AI Quality), Model Scan |

**Características de Seguridad por Defecto:**
- `fail-on-severity: HIGH` (Bloquea el pipeline ante vulnerabilidades críticas)
- Permisos mínimos (`contents: read`)
- Secret Scanning activado

### 3. Estado del Sistema (`status`)

Verifica la salud de los componentes desplegados y del propio CLI.

```bash
# Ver estado general
osdo status

# Monitoreo continuo (watch mode)
osdo status --watch
```

## Referencia de Flags

### Globales
- `--verbose`: Muestra logs detallados de depuración.
- `--config`: Especifica un archivo de configuración personalizado.

### Deploy
- `--dry-run`: Simula el despliegue sin realizar cambios.
- `--force`: Omite advertencias no críticas.
- `--no-monitoring`: Despliega sin el stack de Prometheus/Grafana (ahorra recursos).

## Solución de Problemas

Si encuentras problemas durante el despliegue:

1. Ejecuta con `--verbose` para ver logs detallados.
2. Usa `osdo scan` para verificar que tu entorno cumple los prerrequisitos (Docker, Kubectl, etc.).
3. Consulta los logs de los pods en Kubernetes: `kubectl logs -n osdo -l app=<componente>`
