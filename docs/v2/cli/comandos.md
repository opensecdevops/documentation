---
id: comandos
title: "Referencia de Comandos"
sidebar_label: "Referencia de Comandos"
---

# Referencia Completa de Comandos — OSDO CLI v2

Todos los comandos comparten las siguientes opciones globales:

| Flag | Alias | Env | Descripción |
|------|-------|-----|-------------|
| `--verbose` | `-v` | `OSDO_VERBOSE` | Mostrar salida detallada |
| `--dry-run` | — | `OSDO_DRY_RUN` | Simular sin ejecutar |
| `--output` | `-o` | `OSDO_OUTPUT` | Formato: `table` · `json` · `yaml` |
| `--kubeconfig` | — | `KUBECONFIG` | Ruta al kubeconfig de Kubernetes |
| `--config` | — | `OSDO_CONFIG` | Ruta a la configuración OSDO |

---

## `osdo init`

Inicializa OSDO en el proyecto actual. Crea el esqueleto de archivos recomendado.

```bash
osdo init
osdo init --platform kubernetes --project-type web-app
```

**Archivos generados:**
- `.osdo/config.yaml` — configuración del proyecto (JSON Schema v2)
- `.github/workflows/osdo-security.yml` — pipeline de seguridad con osdo-actions@v2
- `.pre-commit-config.yaml` — hooks de pre-commit (secrets, lint, IaC)
- `SECURITY.md` — política de seguridad del proyecto

---

## `osdo scan`

Ejecuta escaneos de seguridad sobre el código fuente del proyecto actual.

```bash
osdo scan                           # Todos los tipos
osdo scan --type sast               # Solo análisis estático (Semgrep)
osdo scan --type sca                # Solo análisis de dependencias (OSV-Scanner)
osdo scan --type secrets            # Solo detección de secretos (Gitleaks)
osdo scan --type container          # Solo linting de Dockerfiles (Hadolint)
osdo scan --path ./src --output json
```

| Flag | Descripción | Por defecto |
|------|-------------|-------------|
| `--type` | Tipo de scan: `all` · `sast` · `sca` · `secrets` · `container` | `all` |
| `--path` | Directorio a escanear | `.` |
| `--fail-on` | Severidad mínima para fallo: `CRITICAL` · `HIGH` · `MEDIUM` | `HIGH` |
| `--output-dir` | Directorio para resultados JSON | `.osdo/results/` |

**Exit codes:** `0` ok · `2` security gate failure

---

## `osdo certify`

Genera un reporte de certificación a partir de los resultados almacenados en `.osdo/results/`.

```bash
osdo certify
osdo certify --output-file docs/security-cert.md
osdo certify --format html
```

Mapea automáticamente los hallazgos a controles de **OWASP Top 10**, **SLSA Level 3** y **OpenSSF Scorecard**.

**Exit codes:** `0` ok · `2` controles críticos sin cubrir

---

## `osdo deploy`

Despliega componentes de infraestructura DevSecOps.

```bash
# Seleccionar componentes
osdo deploy --components prometheus grafana --platform kubernetes
osdo deploy --components vault sonarqube --platform helm --namespace security

# Desde preset guardado
osdo deploy --preset production

# Selección interactiva
osdo deploy --interactive

# Desde paquete OSDO (descargado con osdo app pull)
osdo deploy --package .osdo/packages/42 --platform kubernetes

# Modo simulación
osdo deploy --dry-run --components grafana
```

**Plataformas:** `kubernetes` · `k3s` · `helm` · `docker-compose` · `docker-swarm`

---

## `osdo pipeline`

### `osdo pipeline generate`

Genera un pipeline CI/CD para el proyecto actual.

```bash
osdo pipeline generate --platform github --type ci
osdo pipeline generate --platform gitlab --type security
osdo pipeline generate --platform azure --type cd --output-file .azure-pipelines.yml
```

**Plataformas:** `github` · `gitlab` · `azure`
**Tipos:** `ci` · `cd` · `security` · `full`

### `osdo pipeline validate`

Valida que el pipeline existente use las versiones correctas de osdo-actions.

```bash
osdo pipeline validate
osdo pipeline validate --file .github/workflows/ci.yml
```

Detecta: versiones sin pinnear (`@main`), `@v0`/`@v1` desactualizadas, permisos faltantes.

### `osdo pipeline sync`

Actualiza referencias de acciones `@v0`/`@v1` a `@v2` en los workflows existentes.

```bash
osdo pipeline sync
osdo pipeline sync --dry-run      # Ver cambios sin aplicar
osdo pipeline sync --target-version v2
```

---

## `osdo catalog`

### `osdo catalog list`

Lista todas las actions y workflows disponibles.

```bash
osdo catalog list
osdo catalog list --type actions
osdo catalog list --type workflows
osdo catalog list --output json
```

### `osdo catalog describe`

Muestra la referencia detallada de una action o workflow específica.

```bash
osdo catalog describe osdo-sast
osdo catalog describe osdo-container-security
```

### `osdo catalog add`

Añade una action de OSDO a un workflow YAML existente.

```bash
osdo catalog add osdo-sast --workflow .github/workflows/ci.yml
osdo catalog add osdo-sbom --workflow .github/workflows/ci.yml --job build
```

---

## `osdo preset`

### `osdo preset list`

Lista los presets de componentes guardados.

```bash
osdo preset list
osdo preset list --output json
```

### `osdo preset show`

Muestra el detalle de un preset específico.

```bash
osdo preset show production
```

### `osdo preset create`

Crea un nuevo preset de forma interactiva.

```bash
osdo preset create
osdo preset create --name staging --components prometheus grafana vault
```

---

## `osdo app`

### `osdo app login`

Autentica el CLI con una instancia de OSDO App.

```bash
osdo app login
osdo app login --url https://app.empresa.com
osdo app login --url https://app.empresa.com --email admin@empresa.com
```

### `osdo app logout`

Cierra la sesión y revoca el token actual.

```bash
osdo app logout
```

### `osdo app pull`

Descarga y renderiza un paquete de la App.

```bash
osdo app pull                      # Selección interactiva
osdo app pull 42                   # Por ID
osdo app pull 42 --dir ./infra
osdo app pull 42 --skip-prompts    # Usa valores por defecto (CI)
osdo app pull 42 --overwrite       # Sobreescribe archivos existentes
```

### `osdo app push`

Actualiza el estado de un deployment en la App.

```bash
osdo app push --deployment-id 15 --status deployed
osdo app push --deployment-id 15 --status failed --message "Namespace no encontrado"
```

### `osdo app status`

Consulta los deployments registrados en la App.

```bash
osdo app status
osdo app status --status pending
osdo app status --output json
```

---

## `osdo monitor`

### `osdo monitor setup`

Configura las URLs de Prometheus, Alertmanager y Grafana.

```bash
osdo monitor setup
osdo monitor setup --prometheus-url http://prometheus:9090 --grafana-url http://grafana:3000
```

### `osdo monitor metrics`

Consulta métricas en tiempo real desde Prometheus.

```bash
osdo monitor metrics
osdo monitor metrics --query "up"
osdo monitor metrics --query 'rate(http_requests_total[5m])' --output json
osdo monitor metrics --prometheus-url http://prometheus:9090
```

### `osdo monitor alerts`

Consulta alertas activas desde Alertmanager.

```bash
osdo monitor alerts
osdo monitor alerts --severity critical
osdo monitor alerts --alertmanager-url http://alertmanager:9093
```

---

## `osdo security`

### `osdo security scan`

Escanea infraestructura con Trivy y Grype.

```bash
osdo security scan
osdo security scan --type container --target nginx:latest
osdo security scan --type filesystem --target ./dist
osdo security scan --fail-on HIGH
```

### `osdo security policies`

Evalúa policies con Kyverno o OPA Conftest.

```bash
osdo security policies
osdo security policies --engine kyverno --namespace production
osdo security policies --engine conftest --policies-dir ./opa
```

### `osdo security secrets`

Detecta secretos expuestos con Gitleaks.

```bash
osdo security secrets
osdo security secrets --mode git         # Historial de commits
osdo security secrets --mode filesystem  # Solo archivos actuales
osdo security secrets --format sarif     # Salida SARIF para Code Scanning
```

### `osdo security compliance`

Genera mapa de cobertura contra OWASP Top 10, SLSA, OpenSSF.

```bash
osdo security compliance
osdo security compliance --framework owasp-top10
osdo security compliance --framework slsa --level 3
```

### `osdo security report`

Genera reporte consolidado de todos los scans.

```bash
osdo security report
osdo security report --format html --output-file docs/sec-report.html
osdo security report --format json
```

---

## `osdo status`

Verifica el estado de los componentes OSDO desplegados.

```bash
osdo status
osdo status --platform kubernetes --namespace osdo
osdo status --component prometheus
osdo status --watch --interval 30    # Refresco continuo
osdo status --detailed               # Info de pods
osdo status --output json
```

---

## Códigos de salida

| Código | Significado                                              |
|--------|----------------------------------------------------------|
| `0`    | Éxito                                                    |
| `1`    | Error general / configuración inválida                   |
| `2`    | Security gate failure (hallazgos sobre el umbral)        |
| `3`    | Policy violation (Kyverno/OPA)                           |
| `4`    | Error de autenticación (App no disponible)               |
| `5`    | Herramienta externa no encontrada (Semgrep, Trivy, etc.) |
| `64`   | Usage error de oclif (flags inválidos)                   |
