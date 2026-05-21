---
id: container-scan
title: "osdo-container-scan"
sidebar_label: "container-scan"
---

# osdo-container-scan

Acción para el análisis de seguridad de imágenes de contenedores. Utiliza Trivy y Grype para detectar vulnerabilidades en el sistema operativo base, las dependencias de la aplicación y los archivos de configuración embebidos en la imagen. Soporta imágenes publicadas en registros públicos y privados.

## Herramientas utilizadas

- **Trivy** — escáner de seguridad integral de Aqua Security para contenedores, sistemas de archivos y repositorios; detecta CVEs, secretos e IaC misconfigurations
- **Grype** — escáner de vulnerabilidades de Anchore para imágenes de contenedores y SBOMs, con amplia cobertura de bases de datos de CVEs

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `image` | `string` | Sí | — | Nombre y etiqueta de la imagen a escanear (ej. `myapp:latest`) |
| `fail-on-severity` | `string` | No | `high` | Severidad mínima para fallo del pipeline: `low`, `medium`, `high`, `critical` |
| `ignore-unfixed` | `boolean` | No | `false` | Ignorar vulnerabilidades sin parche disponible |
| `output-format` | `string` | No | `sarif` | Formato del informe: `sarif`, `json`, `table` |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-container-scan@v2
  with:
    image: 'myapp:${{ github.sha }}'
    fail-on-severity: 'high'
    ignore-unfixed: false
    output-format: 'sarif'
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `scan-report` | Ruta al informe consolidado de vulnerabilidades |
| `vulnerability-count` | Número total de vulnerabilidades encontradas |
| `critical-count` | Número de vulnerabilidades críticas |
| `trivy-report` | Ruta al informe específico de Trivy |
| `grype-report` | Ruta al informe específico de Grype |

## Notas

- Para escanear imágenes en registros privados, asegúrate de autenticarte previamente usando `docker/login-action` antes de ejecutar esta acción.
- Con `ignore-unfixed: true` se excluyen del conteo las vulnerabilidades para las que no existe un parche en los repositorios de paquetes, lo que reduce el ruido en proyectos con dependencias con ciclos de actualización largos.
- Se recomienda ejecutar esta acción inmediatamente después del paso de construcción de la imagen (`docker/build-push-action`) para garantizar que el análisis aplique a la imagen exacta que se desplegará.
