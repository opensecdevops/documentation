---
id: llm-scan
title: "osdo-llm-scan"
sidebar_label: "llm-scan"
---

# osdo-llm-scan

Acción para el análisis de seguridad de aplicaciones basadas en modelos de lenguaje de gran escala (LLM). Evalúa configuraciones de modelos, datasets de entrenamiento y pipelines de inferencia para detectar riesgos como inyección de prompts, fuga de datos de entrenamiento, comportamientos inesperados ante entradas adversariales y exposición de información sensible en respuestas del modelo.

## Herramientas utilizadas

- **Análisis de configuración LLM** — evaluación estática de las configuraciones del modelo y los prompts del sistema para detectar vulnerabilidades del OWASP LLM Top 10
- **Análisis de datasets** — inspección de datasets de entrenamiento y fine-tuning para detectar datos sensibles, PII y patrones potencialmente peligrosos

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `model-config-path` | `string` | Sí | — | Ruta al archivo de configuración del modelo LLM (JSON/YAML) con prompts del sistema y parámetros |
| `dataset-path` | `string` | No | — | Ruta al dataset de entrenamiento o ejemplos de fine-tuning a analizar |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-llm-scan@v2
  with:
    model-config-path: './config/llm-config.yaml'
    dataset-path: './data/training-samples.jsonl'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `llm-report` | Ruta al informe de seguridad del análisis LLM |
| `risk-score` | Puntuación de riesgo global de la configuración LLM (0-10) |
| `prompt-injection-risks` | Número de vectores de inyección de prompts detectados en la configuración |
| `pii-detected` | Booleano indicando si se detectó información personal identificable en el dataset |
| `owasp-llm-findings` | Hallazgos mapeados al OWASP LLM Top 10 |

## Notas

- El análisis de `model-config-path` evalúa los prompts del sistema en busca de instrucciones que puedan ser vulnerables a inyección o que expongan lógica de negocio sensible.
- Para el análisis de datasets, la acción detecta PII (información personal identificable), credenciales, secretos y otros datos sensibles que no deberían estar en datos de entrenamiento.
- Los hallazgos se mapean al OWASP LLM Top 10 (LLM01-LLM10), incluyendo inyección de prompts (LLM01), fuga de datos de entrenamiento (LLM06) y envenenamiento de modelos (LLM03).
- Se recomienda ejecutar esta acción en todos los cambios a configuraciones de modelos, prompts del sistema o datasets para prevenir la introducción de riesgos de seguridad en aplicaciones GenAI.
