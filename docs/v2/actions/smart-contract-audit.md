---
id: smart-contract-audit
title: "osdo-smart-contract-audit"
sidebar_label: "smart-contract-audit"
---

# osdo-smart-contract-audit

Acción para la auditoría automatizada de seguridad de contratos inteligentes escritos en Solidity. Combina Slither y Mythril para detectar vulnerabilidades críticas como reentrancia, desbordamientos de enteros, acceso no controlado a funciones privilegiadas y otros patrones inseguros comunes en el desarrollo de contratos para la blockchain de Ethereum y redes compatibles con EVM.

## Herramientas utilizadas

- **Slither** — framework de análisis estático para contratos inteligentes Solidity de Trail of Bits; detecta vulnerabilidades mediante análisis del AST y flujo de control
- **Mythril** — analizador de seguridad simbólico para bytecode EVM de ConsenSys; realiza ejecución simbólica para detectar vulnerabilidades en tiempo de ejecución

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `contracts-path` | `string` | No | `./contracts` | Ruta al directorio que contiene los contratos Solidity a auditar |
| `solidity-version` | `string` | No | `0.8.19` | Versión del compilador Solidity a usar para el análisis |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-smart-contract-audit@v2
  with:
    contracts-path: './contracts'
    solidity-version: '0.8.20'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `audit-report` | Ruta al informe consolidado de auditoría de contratos |
| `slither-report` | Ruta al informe específico de Slither en formato JSON |
| `mythril-report` | Ruta al informe específico de Mythril |
| `vulnerabilities-count` | Número total de vulnerabilidades detectadas |
| `critical-vulnerabilities` | Número de vulnerabilidades críticas (reentrancia, acceso no autorizado, etc.) |

## Notas

- Slither es significativamente más rápido que Mythril y adecuado para ejecuciones en cada pull request. Mythril realiza análisis más profundo pero puede tardar varios minutos por contrato.
- Para proyectos con múltiples contratos interdependientes, asegúrate de que todas las dependencias (OpenZeppelin, etc.) estén instaladas antes de ejecutar la auditoría.
- Las vulnerabilidades detectadas incluyen la categoría SWC (Smart Contract Weakness Classification) para facilitar la priorización y remediación.
- Esta acción es una auditoría automatizada complementaria; para contratos que manejen fondos significativos, se recomienda además una auditoría manual por especialistas en seguridad blockchain.
