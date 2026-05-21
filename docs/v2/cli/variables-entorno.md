---
id: variables-entorno
title: "Variables de Entorno"
sidebar_label: "Variables de Entorno"
---

# Variables de Entorno del CLI OSDO v2

El CLI respeta las siguientes variables de entorno. Úsalas en CI/CD para evitar pasar flags en cada comando.

---

## Variables de configuración global

| Variable           | Flag equivalente   | Descripción                                      | Valor por defecto |
|--------------------|--------------------|--------------------------------------------------|-------------------|
| `OSDO_VERBOSE`     | `--verbose` / `-v` | Activar salida detallada                         | `false`           |
| `OSDO_DRY_RUN`     | `--dry-run`        | Simular operaciones sin ejecutarlas              | `false`           |
| `OSDO_OUTPUT`      | `--output` / `-o`  | Formato de salida (`table`, `json`, `yaml`)      | `table`           |
| `KUBECONFIG`       | `--kubeconfig`     | Ruta al archivo kubeconfig de Kubernetes         | `~/.kube/config`  |
| `OSDO_CONFIG`      | `--config`         | Ruta al directorio de configuración OSDO         | `~/.config/osdo`  |

---

## Variables de integración con OSDO App

| Variable           | Descripción                                              |
|--------------------|----------------------------------------------------------|
| `OSDO_APP_URL`     | URL base de la instancia de OSDO App (ej: `https://app.osdo.dev`) |
| `OSDO_APP_TOKEN`   | Token de autenticación Sanctum para la app               |

Alternativa al token por variable de entorno — autenticarse una vez con:

```bash
osdo app login --url https://app.osdo.dev
# Introduce email y contraseña interactivamente
# El token se guarda en ~/.config/osdo/config.json
```

---

## Variables de monitoreo

| Variable                 | Descripción                              | Valor por defecto           |
|--------------------------|------------------------------------------|-----------------------------|
| `OSDO_PROMETHEUS_URL`    | URL de Prometheus                        | `http://localhost:9090`     |
| `OSDO_ALERTMANAGER_URL`  | URL de Alertmanager                      | `http://localhost:9093`     |
| `OSDO_GRAFANA_URL`       | URL de Grafana                           | `http://localhost:3000`     |

---

## Variables de seguridad y escaneo

| Variable               | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| `OSDO_PLATFORM`        | Plataforma de deployment (`kubernetes`, `helm`, `docker-compose`...) |
| `SEMGREP_APP_TOKEN`    | Token para Semgrep Cloud Platform (opcional)                         |
| `OSDO_FAIL_ON`         | Severidad mínima para fallo en `osdo scan` (`CRITICAL`, `HIGH`...)   |

---

## Ejemplo de configuración en GitHub Actions

```yaml
# .github/workflows/osdo-security.yml
name: OSDO Security

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm install -g @osdo/cli

      - name: Ejecutar scan de seguridad
        run: osdo scan --type all --output json
        env:
          OSDO_VERBOSE: 'true'
          OSDO_FAIL_ON: 'HIGH'
          OSDO_DRY_RUN: 'false'

      - name: Generar reporte de certificación
        run: osdo certify --output-file osdo-cert-report.md
        env:
          OSDO_OUTPUT: 'table'
```

---

## Ejemplo de configuración en GitLab CI

```yaml
# .gitlab-ci.yml
variables:
  OSDO_VERBOSE: "false"
  OSDO_OUTPUT: "json"
  OSDO_FAIL_ON: "CRITICAL"

osdo-scan:
  image: node:20-slim
  script:
    - npm install -g @osdo/cli
    - osdo scan --type all
  artifacts:
    paths:
      - .osdo/results/
    expire_in: 7 days
```

---

## Precedencia de configuración

El CLI aplica la configuración en el siguiente orden (mayor prioridad primero):

1. **Flags CLI** (`--verbose`, `--output`, etc.)
2. **Variables de entorno** (`OSDO_VERBOSE`, `OSDO_OUTPUT`, etc.)
3. **Config persistida** (`~/.config/osdo/config.json` vía `osdo preset`)
4. **Config del proyecto** (`.osdo/config.yaml`)
5. **Valores por defecto** del código

---

## Limpiar tokens almacenados

```bash
# Cerrar sesión de la App y borrar token
osdo app logout

# Limpiar toda la configuración
rm -rf ~/.config/osdo/config.json
```
