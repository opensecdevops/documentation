---
id: smart-contracts
title: "Contratos Inteligentes"
sidebar_label: "Contratos Inteligentes"
---

# Dominio: Contratos Inteligentes

OSDO v2 proporciona cobertura de seguridad especializada para contratos inteligentes escritos en Solidity para la blockchain de Ethereum y redes compatibles con EVM (Polygon, BNB Chain, Avalanche, etc.). Este dominio combina análisis estático con ejecución simbólica para detectar las vulnerabilidades más críticas en el desarrollo de contratos inteligentes antes de su despliegue en la red.

## Cobertura de seguridad

Los proyectos de contratos inteligentes se benefician de las siguientes capacidades de OSDO v2:

- **Auditoría con Slither** — análisis estático rápido del AST y flujo de control de los contratos Solidity
- **Análisis simbólico con Mythril** — ejecución simbólica del bytecode EVM para detectar vulnerabilidades en tiempo de ejecución
- **SCA de dependencias** — verificación de vulnerabilidades en librerías de contratos (OpenZeppelin, etc.)
- **SBOM** — inventario de los contratos, sus dependencias y versiones del compilador

## Acciones recomendadas

| Acción | Propósito | Cuándo ejecutar |
|--------|-----------|-----------------|
| `osdo-smart-contract-audit` | Auditoría automatizada con Slither + Mythril | En cada pull request |
| `osdo-sca` | Vulnerabilidades en dependencias de contratos | En cada pull request |
| `osdo-sbom` | Inventario de contratos y dependencias | En cada despliegue |
| `osdo-secrets-scan` | Detección de claves privadas expuestas | En cada push |

## Configuración recomendada para proyectos de contratos inteligentes

```yaml
name: OSDO Smart Contract Security

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'contracts/**'
      - 'hardhat.config.js'
      - 'foundry.toml'

jobs:
  contract-audit:
    uses: opensecdevops/osdo-actions/.github/workflows/osdo-framework.yml@v2
    with:
      enable-sast: true
      enable-sca: true
      enable-secrets: true
      severity-threshold: 'medium'
    secrets: inherit

  smart-contract-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: opensecdevops/osdo-actions/osdo-smart-contract-audit@v2
        with:
          contracts-path: './contracts'
          solidity-version: '0.8.20'
```

## Reglas de Slither cubiertas

OSDO v2 habilita por defecto las reglas de mayor impacto de Slither, incluyendo:

| Categoría | Detector Slither | Severidad |
|-----------|-----------------|-----------|
| Reentrancia | `reentrancy-eth`, `reentrancy-no-eth` | Crítica/Alta |
| Control de acceso | `suicidal`, `unprotected-upgrade` | Crítica |
| Aritmética | `integer-overflow`, `divide-before-multiply` | Media |
| Visibilidad | `uninitialized-local`, `uninitialized-state` | Media/Alta |
| Lógica de negocio | `tx-origin`, `timestamp` | Media |
| Manipulación de gas | `costly-loop`, `calls-loop` | Baja/Media |
| Conformidad ERC | `erc20-interface`, `erc721-interface` | Informativa |

## Vulnerabilidades SWC cubiertas

Los análisis con Slither y Mythril cubren las siguientes categorías del Smart Contract Weakness Classification (SWC):

| SWC | Descripción | Herramienta |
|-----|-------------|-------------|
| SWC-100 | Función de retiro de fondos incorrecta | Slither + Mythril |
| SWC-101 | Desbordamiento/subdesbordamiento de enteros | Slither + Mythril |
| SWC-104 | Resultado de llamada no verificado | Slither |
| SWC-106 | Función de suicidio no protegida | Slither |
| SWC-107 | Reentrancia | Slither + Mythril |
| SWC-110 | Afirmación violada | Mythril |
| SWC-115 | Uso incorrecto de `tx.origin` | Slither |
| SWC-116 | Dependencia de timestamp del bloque | Slither |

## Notas

- Esta acción proporciona auditoría automatizada; para contratos que manejan fondos significativos o tienen lógica de negocio compleja, es **obligatoria** una auditoría manual por especialistas en seguridad blockchain.
- Mythril puede tardar entre 5 y 30 minutos por contrato dependiendo de su complejidad; se recomienda limitar el análisis de Mythril a contratos críticos en el pipeline de CI y ejecutar el análisis completo de forma programada.
- Asegúrate de que las dependencias del proyecto (OpenZeppelin, etc.) estén instaladas con `npm install` o `forge install` antes de ejecutar la auditoría para que las herramientas puedan resolver las importaciones.
- Los contratos deben compilar sin errores antes de ejecutar el análisis; se recomienda incluir un paso de compilación previo al escaneo.
