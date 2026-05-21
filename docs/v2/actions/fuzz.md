---
id: fuzz
title: "osdo-fuzz"
sidebar_label: "fuzz"
---

# osdo-fuzz

Acción para la realización de pruebas de fuzzing automatizadas. Ejecuta pruebas de fuzzing sobre los objetivos especificados usando OSS-Fuzz e atheris para descubrir vulnerabilidades de seguridad como desbordamientos de búfer, condiciones de carrera y comportamientos inesperados ante entradas malformadas o inusuales.

## Herramientas utilizadas

- **OSS-Fuzz** — plataforma de fuzzing continuo de Google para proyectos de código abierto; integra libFuzzer y AFL++ para fuzzing eficiente
- **atheris** — motor de fuzzing para Python de Google basado en libFuzzer; permite descubrir bugs en código Python nativo y extensiones C

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del código fuente que contiene los fuzz targets |
| `fuzz-time` | `string` | No | `60` | Tiempo máximo de fuzzing en segundos por objetivo |
| `targets` | `string` | No | `auto` | Lista de objetivos de fuzzing separados por comas, o `auto` para detectarlos automáticamente |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-fuzz@v2
  with:
    path: './fuzz'
    fuzz-time: '120'
    targets: 'fuzz_parse_input,fuzz_process_request'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `fuzz-report` | Ruta al informe de resultados del fuzzing |
| `crashes-found` | Número de crashes o comportamientos anómalos descubiertos |
| `corpus-path` | Ruta al corpus de entradas generado durante el fuzzing |
| `coverage-report` | Ruta al informe de cobertura de código alcanzada durante el fuzzing |

## Notas

- Para lenguajes compilados (C/C++), los fuzz targets deben compilarse con `AddressSanitizer` y `UndefinedBehaviorSanitizer` habilitados para maximizar la detección de errores de memoria.
- En Python, los fuzz targets deben implementar la función `TestOneInput(data: bytes)` requerida por atheris.
- Los crashes encontrados se almacenan junto con las entradas que los causaron, facilitando la reproducción y el análisis del bug.
- Para proyectos a largo plazo, se recomienda integrar con OSS-Fuzz directamente para fuzzing continuo 24/7; esta acción es ideal para ejecuciones en CI como verificación de regresiones.
