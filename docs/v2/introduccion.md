---
id: introduccion
title: "Introducción a OSDO v2"
sidebar_label: "¿Qué es OSDO v2?"
---

# Introducción a OSDO v2

**OSDO (Open Secure DevOps)** es un framework de DevSecOps de código abierto diseñado para integrar seguridad en cada etapa del ciclo de vida del desarrollo de software. La versión 2 representa una evolución completa del proyecto original, con una arquitectura de 3 capas, una CLI reescrita en Node.js y una integración profunda con OSDO App.

## ¿Qué es OSDO v2?

OSDO v2 es un framework modular compuesto por tres capas interdependientes:

1. **osdo-actions** — 22 GitHub Actions reutilizables que encapsulan herramientas de seguridad (Trivy, Grype, Semgrep, Gitleaks, etc.)
2. **osdo-workflows** — 10 workflows de GitHub Actions que orquestan las actions para escenarios completos de seguridad
3. **osdo-cli** — Interfaz de línea de comandos en Node.js/oclif para gestionar el framework desde tu terminal

Adicionalmente, **OSDO App** (aplicación Laravel) proporciona un panel centralizado para registro de proyectos, generación de paquetes de configuración y seguimiento de deployments.

## Capacidades principales

| Componente         | Cantidad | Descripción                                              |
|--------------------|----------|----------------------------------------------------------|
| Actions            | 22       | Análisis de código, contenedores, cadena de suministro, pruebas, dominios especializados |
| Workflows          | 10       | Pipelines preconfigurados para los escenarios más comunes |
| Dominios           | 4        | Web Apps, Mobile, Smart Contracts, GenAI/LLM             |
| Idioma             | Español  | Documentación y mensajes del CLI en español              |

## Arquitectura: Los tres pilares

```
┌─────────────────────────────────────────────────────────────────┐
│                          OSDO v2                                │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   osdo-actions   │  │  osdo-workflows  │  │   osdo-cli   │  │
│  │                  │  │                  │  │              │  │
│  │  22 GitHub       │  │  10 Pipelines    │  │  oclif /     │  │
│  │  Actions         │◄─┤  reutilizables   │  │  Node.js     │  │
│  │  (Trivy, Grype,  │  │  (framework,     │  │              │  │
│  │   Semgrep, ...)  │  │   container,     │  │  osdo app    │  │
│  │                  │  │   supply-chain,  │  │  osdo scan   │  │
│  │                  │  │   ...)           │  │  osdo monitor│  │
│  └──────────────────┘  └──────────────────┘  └──────┬───────┘  │
│                                                      │          │
│                                              ┌───────▼───────┐  │
│                                              │   OSDO App    │  │
│                                              │   (Laravel)   │  │
│                                              │               │  │
│                                              │  Panel, API,  │  │
│                                              │  Deployments  │  │
│                                              └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start: 30 segundos para un DevSecOps seguro

La forma más rápida de añadir seguridad a tu repositorio de GitHub es utilizar el workflow `osdo-framework` directamente:

```yaml
# .github/workflows/osdo-security.yml
name: OSDO Security

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  security:
    uses: opensecdevops/osdo-workflows/.github/workflows/osdo-framework.yml@v2
    with:
      enable-sast: true
      enable-sca: true
      enable-secrets: true
```

Con esta configuración, cada push y pull request ejecutará automáticamente:
- **SAST** (Semgrep): análisis estático de seguridad del código fuente
- **SCA** (Grype): análisis de dependencias y vulnerabilidades conocidas
- **Secrets Scan** (Gitleaks): detección de secretos y credenciales expuestas

## Cobertura por dominio

| Dominio de Seguridad | Cobertura | Actions disponibles                              |
|----------------------|-----------|--------------------------------------------------|
| Web Apps             | 90%       | sast, sca, secrets-scan, dast-scan, api-scan, sbom, sign, security-gate |
| Mobile               | 70%       | mobile-scan, sast, sca, secrets-scan, sbom       |
| Smart Contracts      | 60%       | smart-contract-audit, sast, sbom, slsa-provenance |
| GenAI / LLM          | 40%       | llm-scan, sast, secrets-scan, sbom               |
| SLSA Level 3         | 100%      | slsa-provenance, sign, sbom, policy-gate         |

## Siguientes pasos

- **[Novedades en v2](./novedades)** — Qué cambia respecto a v1
- **[Migración v1 → v2](./migracion-v1-v2)** — Guía paso a paso para actualizar
- **[Instalación del CLI](./cli/instalacion)** — Instalar `osdo-cli` en tu sistema
- **[Las 22 Actions](./actions/sast)** — Referencia completa de todas las actions
