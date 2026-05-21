---
id: genai-llm
title: "GenAI / LLM"
sidebar_label: "GenAI / LLM"
---

# Dominio: GenAI / LLM

OSDO v2 proporciona cobertura de seguridad especializada para aplicaciones basadas en inteligencia artificial generativa (GenAI) y modelos de lenguaje de gran escala (LLM). Este dominio aborda los riesgos de seguridad únicos que emergen en pipelines de IA, incluyendo la inyección de prompts, la fuga de datos de entrenamiento, el envenenamiento de modelos y el comportamiento inesperado ante entradas adversariales.

## Cobertura de seguridad

Los proyectos GenAI y LLM se benefician de las siguientes capacidades de OSDO v2:

- **Análisis de configuración LLM** — evaluación de prompts del sistema, parámetros del modelo y configuraciones de seguridad
- **Análisis de datasets** — detección de PII, secretos y datos sensibles en datasets de entrenamiento y fine-tuning
- **Detección de inyección de prompts** — identificación de vectores de inyección en prompts del sistema y plantillas de prompts
- **SAST** — análisis del código de la aplicación que integra el LLM para detectar vulnerabilidades en la capa de aplicación
- **SCA** — verificación de vulnerabilidades en SDKs de LLM (LangChain, OpenAI SDK, Hugging Face, etc.)

## Acciones recomendadas

| Acción | Propósito | Cuándo ejecutar |
|--------|-----------|-----------------|
| `osdo-llm-scan` | Análisis de configuración y datasets LLM | En cambios de config/prompts/datasets |
| `osdo-sast` | Vulnerabilidades en el código de la aplicación | En cada pull request |
| `osdo-sca` | Vulnerabilidades en SDKs y dependencias LLM | En cada pull request |
| `osdo-secrets-scan` | Detección de API keys de LLM expuestas | En cada push |

## Configuración recomendada para proyectos GenAI/LLM

```yaml
name: OSDO GenAI Security

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'prompts/**'
      - 'config/llm*.yaml'
      - 'data/**'
      - '*.py'

jobs:
  llm-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: opensecdevops/osdo-actions/osdo-secrets-scan@v2
        with:
          mode: 'git'
          fail-on-finding: true

      - uses: opensecdevops/osdo-actions/osdo-llm-scan@v2
        with:
          model-config-path: './config/llm-config.yaml'
          dataset-path: './data/training-samples.jsonl'

      - uses: opensecdevops/osdo-actions/osdo-sast@v2
        with:
          path: './src'
          scanners: 'semgrep'
          severity-threshold: 'medium'

      - uses: opensecdevops/osdo-actions/osdo-sca@v2
        with:
          path: '.'
          fail-on-vulnerability: true
          severity-threshold: 'high'
```

## Mapeo OWASP LLM Top 10

| Categoría OWASP LLM | Descripción | Cobertura OSDO | Acción(es) responsable(s) |
|---------------------|-------------|----------------|--------------------------|
| LLM01 - Inyección de prompts | Manipulación del comportamiento del modelo mediante entradas maliciosas | Alta | `osdo-llm-scan` |
| LLM02 - Manejo inseguro de salidas | Procesamiento sin validación de salidas del modelo | Media | `osdo-sast` |
| LLM03 - Envenenamiento de la cadena de suministro | Compromiso de modelos, datos o dependencias | Media | `osdo-sca`, `osdo-llm-scan` |
| LLM04 - Denegación de servicio del modelo | Entradas diseñadas para consumir recursos excesivos | Baja | `osdo-fuzz` |
| LLM05 - Vulnerabilidades en la cadena de suministro | SDKs y dependencias vulnerables | Alta | `osdo-sca` |
| LLM06 - Divulgación de información sensible | Fuga de datos de entrenamiento o del sistema | Alta | `osdo-llm-scan`, `osdo-secrets-scan` |
| LLM07 - Diseño de plugin inseguro | Vulnerabilidades en plugins y herramientas del agente | Media | `osdo-sast`, `osdo-api-scan` |
| LLM08 - Acción excesiva del agente | Agentes LLM con permisos y capacidades excesivas | Parcial | `osdo-llm-scan` |
| LLM09 - Dependencia excesiva | Confianza sin validación en las salidas del modelo | Referencia | `osdo-compliance-report` |
| LLM10 - Robo del modelo | Acceso no autorizado o extracción del modelo | Baja | `osdo-cloud-scan` |

## Tipos de secretos específicos de LLM detectados

`osdo-secrets-scan` incluye reglas específicas para detectar:

- Claves de API de OpenAI (`sk-...`)
- Tokens de Hugging Face (`hf_...`)
- Claves de API de Anthropic (`sk-ant-...`)
- Claves de API de Cohere
- Credenciales de AWS Bedrock
- Tokens de acceso de Azure OpenAI

## Notas

- El análisis de datasets puede tardar considerablemente para datasets grandes. Se recomienda ejecutar este análisis de forma programada o solo cuando cambian los archivos de datos, no en cada pull request.
- Los prompts del sistema son vectores de ataque críticos; cualquier cambio en archivos de configuración de prompts debe desencadenar una revisión de seguridad con `osdo-llm-scan`.
- Para aplicaciones basadas en agentes LLM con acceso a herramientas externas, se recomienda revisar adicionalmente los permisos otorgados al agente siguiendo el principio de mínimo privilegio.
- Este dominio está en evolución activa; las herramientas y reglas se actualizan frecuentemente para cubrir los nuevos vectores de ataque que emergen en el ecosistema de IA generativa.
