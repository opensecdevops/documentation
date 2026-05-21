---
id: novedades
title: "Novedades en OSDO v2"
sidebar_label: "Novedades en v2"
---

# Novedades en OSDO v2

Esta página resume los cambios más importantes introducidos en OSDO v2 respecto a la versión 1.0.

## CLI migrado a oclif (Node.js)

El CLI original de OSDO estaba escrito en Go usando el framework Cobra (`osdo-infra-cli`). En v2, el CLI ha sido completamente reescrito en **Node.js usando [oclif](https://oclif.io/)** (`osdo-cli`).

**Motivaciones:**
- Ecosistema npm más accesible para equipos web y DevOps
- Integración nativa con la App (Laravel) mediante llamadas HTTP
- Soporte de plugins mediante el sistema de plugins de oclif
- Distribución más sencilla via `npm install -g @osdo/cli`

**Instalación nueva:**
```bash
npm install -g @osdo/cli
osdo --version
```

## 22 actions documentadas (vs 14 en v1)

OSDO v1 incluía 14 GitHub Actions. En v2 se han añadido **8 nuevas actions**, alcanzando las 22 acciones documentadas:

| Nuevas en v2              | Descripción                                              |
|---------------------------|----------------------------------------------------------|
| `build-security`          | Análisis de seguridad del proceso de build               |
| `slsa-provenance`         | Generación de provenance SLSA Level 3                    |
| `policy-gate`             | Evaluación de políticas de seguridad (OPA/Rego)          |
| `fuzz`                    | Fuzzing automatizado de funciones y endpoints            |
| `security-gate`           | Gate de calidad unificado para pipelines                 |
| `setup-env`               | Preparación del entorno de seguridad                     |
| `smart-contract-audit`    | Auditoría de smart contracts (Slither, Mythril)          |
| `llm-scan`                | Análisis de seguridad en aplicaciones con LLMs           |

Las 22 actions están organizadas en 5 categorías:
1. Análisis de Código (sast, sca, secrets-scan)
2. Infraestructura y Contenedores (container-scan, iac-scan, build-security)
3. Cadena de Suministro (sbom, slsa-provenance, sign, policy-gate, fuzz)
4. Pruebas y Calidad (test-quality, security-gate, dast-scan, api-scan, compliance-report, setup-env)
5. Especializado (mobile-scan, smart-contract-audit, llm-scan, cloud-scan, license-scan)

## Integración CLI con App (`osdo app`)

El nuevo subcomando `osdo app` permite gestionar la integración bidireccional entre el CLI y OSDO App:

```bash
# Autenticarse con la App
osdo app login --url https://app.osdo.dev --token <token>

# Descargar la configuración del proyecto desde la App
osdo app pull --project mi-proyecto

# Publicar resultados de escaneo a la App
osdo app push --results ./osdo-report.json

# Ver estado del proyecto en la App
osdo app status
```

Las rutas API correspondientes en la App son:
- `POST /api/cli/auth` — Autenticación del CLI
- `GET /api/cli/packages` — Descarga de paquetes de configuración
- `POST /api/cli/deployments` — Registro de deployments

## JSON Schema para `.osdo/config.yaml`

En v2, el archivo de configuración `.osdo/config.yaml` tiene un **JSON Schema formal** que permite validación automática en IDEs compatibles (VS Code, IntelliJ).

Estructura mínima v2:
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

thresholds:
  critical: 0
  high: 5
```

El campo `version: "2.0"` es **obligatorio** en v2. Los archivos sin este campo serán tratados como v1 y mostrarán un aviso de deprecación.

## Pre-commit hooks para 7+ lenguajes

OSDO v2 incluye hooks de pre-commit listos para usar en 7 lenguajes:

| Lenguaje   | Hook                              | Herramienta            |
|------------|-----------------------------------|------------------------|
| PHP        | `osdo-precommit-php`              | PHPCS + Semgrep        |
| Node.js    | `osdo-precommit-node`             | ESLint Security + npm audit |
| Python     | `osdo-precommit-python`           | Bandit + Safety        |
| Go         | `osdo-precommit-go`               | Gosec + govulncheck    |
| Docker     | `osdo-precommit-docker`           | Hadolint + Trivy       |
| Secrets    | `osdo-precommit-secrets`          | Gitleaks               |
| IaC        | `osdo-precommit-iac`              | Checkov + tfsec        |

Instalación en `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/opensecdevops/osdo-cli
    rev: v2
    hooks:
      - id: osdo-precommit-secrets
      - id: osdo-precommit-sast
```

## Monitor real (Prometheus / Grafana)

El comando `osdo monitor` ya no muestra datos simulados. En v2, se conecta a la **API real de Prometheus y Alertmanager** configurados en tu infraestructura:

```bash
# Ver métricas de seguridad en tiempo real
osdo monitor --prometheus http://prometheus.internal:9090

# Ver alertas activas
osdo monitor alerts --alertmanager http://alertmanager.internal:9093
```

## Security scan real (Trivy / Grype)

El comando `osdo security scan` ahora ejecuta **escaneos reales** utilizando Trivy y Grype como backends:

```bash
# Escanear imagen Docker
osdo security scan image nginx:latest

# Escanear sistema de archivos
osdo security scan fs ./src

# Escanear con salida SARIF (para GitHub Security)
osdo security scan image myapp:latest --format sarif --output results.sarif
```

## Workflow `osdo app pull/push`

El nuevo flujo de trabajo `osdo app pull/push` permite sincronizar la configuración de seguridad entre el CLI y la App:

```
desarrollador           osdo-cli             OSDO App
     │                     │                    │
     │  osdo app pull       │                    │
     │────────────────────►│                    │
     │                     │  GET /api/cli/     │
     │                     │  packages          │
     │                     │───────────────────►│
     │                     │  config.yaml +     │
     │                     │  templates         │
     │                     │◄───────────────────│
     │  .osdo/ actualizado  │                    │
     │◄────────────────────│                    │
     │                     │                    │
     │  osdo app push       │                    │
     │────────────────────►│                    │
     │                     │  POST /api/cli/    │
     │                     │  deployments       │
     │                     │───────────────────►│
     │                     │  200 OK            │
     │◄────────────────────│◄───────────────────│
```
