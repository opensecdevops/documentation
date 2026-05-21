---
id: license-scan
title: "osdo-license-scan"
sidebar_label: "license-scan"
---

# osdo-license-scan

Acción para el análisis y verificación de licencias de software en dependencias de terceros. Utiliza FOSSA y license-checker para identificar las licencias de todos los componentes del proyecto, verificar su compatibilidad con la política de licencias de la organización y detectar el uso de licencias restrictivas que puedan generar obligaciones legales no deseadas.

## Herramientas utilizadas

- **FOSSA** — plataforma de gestión de cumplimiento de licencias de código abierto; analiza dependencias, identifica licencias y verifica el cumplimiento de políticas de uso
- **license-checker** — herramienta de Node.js para inspeccionar y verificar las licencias de los paquetes npm del proyecto

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `path` | `string` | No | `.` | Ruta del proyecto a analizar en busca de dependencias y sus licencias |
| `allowed-licenses` | `string` | No | `MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC` | Lista separada por comas de licencias permitidas por la organización |
| `fail-on-violation` | `boolean` | No | `true` | Falla el pipeline si se detecta alguna dependencia con licencia no permitida |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-license-scan@v2
  with:
    path: '.'
    allowed-licenses: 'MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause'
    fail-on-violation: true
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `license-report` | Ruta al informe completo de licencias detectadas |
| `violations-count` | Número de dependencias con licencias no permitidas |
| `license-summary` | Resumen de tipos de licencias encontrados en el proyecto |
| `dependencies-scanned` | Número total de dependencias analizadas |

## Notas

- Las licencias copyleft como GPL-2.0, GPL-3.0 y AGPL-3.0 deben evaluarse cuidadosamente antes de incluirlas en proyectos propietarios, ya que pueden requerir la liberación del código fuente del producto.
- La lista `allowed-licenses` debe ser definida y aprobada por el equipo legal de la organización antes de configurarla en los pipelines.
- license-checker es especialmente eficaz para proyectos JavaScript/TypeScript; para proyectos Python se usa `pip-licenses` y para Java se analiza el archivo `pom.xml` o `build.gradle`.
- El informe generado incluye la licencia SPDX identificada, la URL del texto de la licencia y si la licencia está dentro de la lista permitida, facilitando las revisiones de cumplimiento legal.
