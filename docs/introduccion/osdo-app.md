---
title: OSDO App - Generador de Pipelines
description: Aplicación web para crear pipelines de CI/CD personalizados
keywords:
    - OSDO App
    - Generador de pipelines
    - CI/CD
    - GitLab CI
    - GitHub Actions
    - Jenkins
---

# OSDO App - Generador de Pipelines CI/CD

OSDO App es una **aplicación web interactiva** que permite crear pipelines de CI/CD personalizados y seguros mediante formularios dinámicos, eliminando la complejidad de configurar manualmente herramientas de seguridad.

## 🎯 ¿Qué es OSDO App?

OSDO App complementa a [OSDO CLI](../../infra-cli/README.md) (que despliega infraestructura) al proporcionar una forma visual y guiada de **generar pipelines** que usen esa infraestructura.

```
┌─────────────────────────────────────────────────────────────┐
│                    Ecosistema OSDO                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  OSDO CLI                    OSDO App                       │
│  (Infraestructura)          (Pipelines)                     │
│                                                             │
│  osdo deploy                 https://app.opensecdevops.org  │
│  ↓                          ↓                               │
│  SonarQube                   Genera .gitlab-ci.yml          │
│  Harbor                      que usa SonarQube              │
│  DefectDojo     ←────────────────┘                          │
│  Prometheus                  Bloques modulares              │
│  Grafana                     Configuración visual           │
│                              Templates compartibles         │
└─────────────────────────────────────────────────────────────┘
```

## Acceso a OSDO App

### Opción 1: Aplicación Web (Recomendado)

```bash
# Acceder directamente
https://app.opensecdevops.org
```

**Ventajas:**
- ✅ Sin instalación local
- ✅ Siempre actualizado
- ✅ Compartir configuraciones fácilmente
- ✅ Paquetes de comunidad disponibles

### Opción 2: Generador CLI Local

```bash
# Instalar herramientas
npm install -g yo @opensecdevops/generator-osdo

# Generar pipeline
yo @opensecdevops/osdo
```

**Ventajas:**
- ✅ Funciona offline
- ✅ Integrable en scripts
- ✅ Automatización completa
- ✅ Control de versiones local

## Características Principales

### 1. Generación Visual de Pipelines

Crea pipelines mediante formularios intuitivos:

```
1. Seleccionar Plataforma CI/CD
   ○ GitLab CI
   ○ GitHub Actions
   ○ Jenkins
   ○ Bitbucket Pipelines

2. Elegir Tecnología
   ○ Node.js (Express, React, Vue, Angular)
   ○ Python (Django, Flask, FastAPI)
   ○ PHP (Laravel, Symfony)
   ○ Go
   ○ Java (Spring Boot, Maven)
   ○ .NET Core

3. Configurar Seguridad
   ☑ Secret Scanning (Gitleaks)
   ☑ SAST (SonarQube, Semgrep)
   ☑ SCA (Dependency Track, npm audit, pip audit)
   ☑ Container Scanning (Trivy)
   ☑ DAST (OWASP ZAP)
   ☑ Vulnerability Management (DefectDojo)

4. Configurar Deployment
   ○ Kubernetes
   ○ Docker
   ○ VM / Bare metal
   ○ Cloud (AWS, GCP, Azure)

5. Descargar Pipeline
   ✓ .gitlab-ci.yml
   ✓ Scripts auxiliares
   ✓ Documentación
```

### 2. Bloques Modulares

Los pipelines se construyen con **bloques reutilizables**:

#### Bloques de Seguridad Disponibles

**Secret Scanning:**
```yaml
# Bloque: Gitleaks
- Detecta secretos hardcodeados
- Previene fugas de credenciales
- Reporta a DefectDojo
- Configurable: allow_failure, artifacts
```

**SAST (Static Analysis):**
```yaml
# Bloque: SonarQube
- Análisis de código estático
- Quality gates personalizables
- Coverage reports
- Integration con IDE

# Bloque: Semgrep
- Reglas personalizadas
- Búsqueda de patrones inseguros
- Rápido y ligero
```

**SCA (Software Composition Analysis):**
```yaml
# Bloque: Dependency Track
- Análisis de dependencias
- CVE database actualizada
- SBOM generation (CycloneDX)
- License compliance

# Bloque: npm audit / pip audit
- Escaneo específico del lenguaje
- Rápido feedback
- Fix automatizado disponible
```

**Container Security:**
```yaml
# Bloque: Trivy
- Escaneo de imágenes Docker
- OS packages vulnerabilities
- Application dependencies
- Config misconfigurations
- Secrets in layers
```

**DAST (Dynamic Analysis):**
```yaml
# Bloque: OWASP ZAP
- Baseline scan
- Full scan
- API scan
- Authenticated testing
```

**Vulnerability Management:**
```yaml
# Bloque: DefectDojo
- Centraliza todos los hallazgos
- Deduplica vulnerabilidades
- Tracking y lifecycle
- Métricas y reportes
```

#### Bloques de Build y Deploy

```yaml
# Build
- Docker multi-stage
- Cache optimization
- Artifact management

# Testing
- Unit tests
- Integration tests
- E2E tests
- Coverage reports

# Deploy
- Kubernetes (kubectl, Helm)
- ArgoCD (GitOps)
- Docker Compose
- Cloud providers
```

### 3. Sistema de Paquetes

OSDO App usa un **sistema de paquetes** para compartir y reutilizar configuraciones:

```
Paquete OSDO
├── README.md                 # Documentación
├── config.json              # Definición del formulario
└── templates/               # Plantillas Handlebars
    ├── main.hbs            # Template principal
    ├── gitleaks.hbs        # Bloque secret scanning
    ├── sonarqube.hbs       # Bloque SAST
    ├── trivy.hbs           # Bloque container scan
    └── deploy.hbs          # Bloque deployment
```

#### Estructura de config.json

```json
{
  "name": "Node.js Security Pipeline",
  "version": "1.0.0",
  "description": "Pipeline completo para aplicaciones Node.js",
  "homepage": "https://opensecdevops.com",
  "type": "pipeline",
  "license": "MIT",
  "author": "OSDO Community",
  "template": "main",
  "file": ".gitlab-ci.yml",
  "language": "yaml",
  
  "blocks": [
    {
      "template": "gitleaks",
      "name": "Secret Scanning",
      "description": "Detecta secretos en el código fuente",
      "info": "Previene fugas de credenciales y API keys",
      "fields": [
        {
          "type": "text",
          "name": "job_name",
          "label": "Nombre del Job",
          "default": "secret-scan",
          "rules": "required|min:3"
        },
        {
          "type": "switch",
          "name": "allow_failure",
          "label": "Permitir fallo en este stage",
          "default": false
        },
        {
          "type": "select",
          "name": "image",
          "label": "Versión de Gitleaks",
          "options": [
            {
              "id": 1,
              "label": "Latest",
              "value": "zricethezav/gitleaks:latest"
            },
            {
              "id": 2,
              "label": "v8.18.0 (Stable)",
              "value": "zricethezav/gitleaks:v8.18.0"
            }
          ],
          "default": 2
        }
      ]
    },
    {
      "template": "sonarqube",
      "name": "SAST Analysis",
      "description": "Análisis estático de código con SonarQube",
      "dependencies": ["gitleaks"],
      "fields": [
        {
          "type": "text",
          "name": "job_name",
          "label": "Nombre del Job",
          "default": "sast-sonarqube",
          "rules": "required"
        },
        {
          "type": "switch",
          "name": "quality_gate",
          "label": "Enforcar Quality Gate",
          "default": true
        },
        {
          "type": "select",
          "name": "scanner_version",
          "label": "Versión del Scanner",
          "options": [
            { "id": 1, "label": "Latest", "value": "latest" },
            { "id": 2, "label": "4.8", "value": "4.8" }
          ]
        }
      ],
      "extra": [
        {
          "file": "sonar-project.properties",
          "language": "properties",
          "template": "sonar-properties"
        }
      ]
    }
  ]
}
```

#### Plantillas Handlebars

```handlebars
{{!-- templates/main.hbs --}}
stages:
  - security-scan
  - build
  - test
  - container-security
  - deploy

variables:
  DOCKER_DRIVER: overlay2

{{!-- Include secret scanning --}}
{{> gitleaks}}

{{!-- Include SAST --}}
{{> sonarqube}}

{{!-- Include container scanning --}}
{{> trivy}}

{{!-- templates/gitleaks.hbs --}}
{{#if gitleaks}}
{{gitleaks.job_name}}:
  stage: security-scan
  image: {{gitleaks.image_value}}
  script:
    - gitleaks detect --verbose --no-git
  {{#if gitleaks.allow_failure}}
  allow_failure: true
  {{/if}}
  {{#if gitleaks.artifacts}}
  artifacts:
    reports:
      gitleaks: gl-secret-detection-report.json
  {{/if}}
{{/if}}
```

## Flujo de Trabajo

### Caso de Uso: Nueva Aplicación Node.js

**Paso 1: Acceder a OSDO App**
```
https://app.opensecdevops.org
```

**Paso 2: Configurar Proyecto**

```
📝 Formulario de Configuración

Información General:
├─ Plataforma CI/CD: GitLab CI
├─ Proyecto: e-commerce-api
└─ Descripción: API REST para e-commerce

Stack Tecnológico:
├─ Lenguaje: Node.js
├─ Framework: Express
└─ Package Manager: npm

Herramientas de Seguridad:
├─ ☑ Gitleaks
│   ├─ Job name: secret-scan
│   ├─ Allow failure: No
│   └─ Version: v8.18.0
│
├─ ☑ SonarQube
│   ├─ Job name: sast-analysis
│   ├─ Quality gate: Yes
│   ├─ Coverage minimum: 75%
│   └─ Security rating: A
│
├─ ☑ npm audit
│   ├─ Job name: dependency-scan
│   ├─ Audit level: high
│   └─ Production only: Yes
│
├─ ☑ Trivy
│   ├─ Job name: container-scan
│   ├─ Severity: HIGH,CRITICAL
│   └─ Exit code: 1 on findings
│
└─ ☑ DefectDojo
    ├─ Engagement name: e-commerce-api
    ├─ Product: E-commerce Platform
    └─ Auto-create: Yes

Build & Test:
├─ Node version: 18
├─ Run tests: Yes
├─ Generate coverage: Yes
└─ Cache dependencies: Yes

Container:
├─ Base image: node:18-alpine
├─ Multi-stage build: Yes
├─ Registry: Harbor
└─ Tag strategy: semver

Deployment:
├─ Target: Kubernetes
├─ Namespace: staging
├─ Strategy: Rolling update
├─ Health check: /health
└─ Replicas: 3
```

**Paso 3: Preview del Pipeline**

```yaml
# Vista previa generada automáticamente

stages:
  - security-scan
  - build
  - test
  - container-security
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_REGISTRY: "harbor.empresa.com"
  SONARQUBE_URL: "https://sonarqube.empresa.com"

secret-scan:
  stage: security-scan
  image: zricethezav/gitleaks:v8.18.0
  script:
    - gitleaks detect --verbose --no-git
  artifacts:
    reports:
      gitleaks: gl-secret-detection-report.json

sast-analysis:
  stage: security-scan
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
      -Dsonar.projectKey=e-commerce-api
      -Dsonar.sources=.
      -Dsonar.host.url=$SONARQUBE_URL
      -Dsonar.login=$SONARQUBE_TOKEN
      -Dsonar.qualitygate.wait=true
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'

dependency-scan:
  stage: security-scan
  image: node:18-alpine
  script:
    - npm audit --audit-level=high --production

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  cache:
    paths:
      - node_modules/

test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm test -- --coverage
  coverage: '/All files\s*\|\s*(\d+\.?\d*)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

container-scan:
  stage: container-security
  image: aquasec/trivy:latest
  script:
    - trivy image
      --severity HIGH,CRITICAL
      --exit-code 1
      $DOCKER_REGISTRY/e-commerce-api:$CI_COMMIT_SHA

deploy-staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/e-commerce-api
      app=$DOCKER_REGISTRY/e-commerce-api:$CI_COMMIT_SHA
      -n staging
    - kubectl rollout status deployment/e-commerce-api -n staging
  environment:
    name: staging
    url: https://api-staging.empresa.com
  only:
    - develop
```

**Paso 4: Descargar Archivos**

OSDO App genera múltiples archivos:

```
📦 e-commerce-api-pipeline.zip
├── .gitlab-ci.yml              # Pipeline principal
├── sonar-project.properties    # Config SonarQube
├── Dockerfile                  # Multi-stage optimizado
├── .dockerignore              # Exclusiones
├── scripts/
│   ├── defectdojo-import.sh   # Import findings
│   └── quality-gate-check.sh  # Verificar quality gate
└── README.md                   # Documentación del pipeline
```

**Paso 5: Integrar en Proyecto**

```bash
# Descomprimir archivos
unzip e-commerce-api-pipeline.zip -d /tmp/osdo-pipeline

# Copiar a proyecto
cd ~/projects/e-commerce-api
cp /tmp/osdo-pipeline/.gitlab-ci.yml .
cp /tmp/osdo-pipeline/sonar-project.properties .
cp /tmp/osdo-pipeline/Dockerfile .
cp -r /tmp/osdo-pipeline/scripts .

# Configurar variables en GitLab
# Settings > CI/CD > Variables
#   SONARQUBE_TOKEN
#   HARBOR_USER
#   HARBOR_PASSWORD
#   DEFECTDOJO_TOKEN
#   KUBECONFIG

# Commit y push
git add .
git commit -m "Add OSDO security pipeline"
git push origin develop
```

**Paso 6: Verificar Ejecución**

```bash
# Ver pipeline en GitLab
open https://gitlab.empresa.com/ecommerce/api/-/pipelines

# Revisar resultados
# 1. Secret scan: ✓ No secrets found
# 2. SAST: ✓ Quality gate passed (A rating)
# 3. Dependencies: ✓ 0 vulnerabilities
# 4. Container: ✓ No critical vulnerabilities
# 5. Deploy: ✓ Deployed to staging
```

## Crear Paquetes Personalizados

### Caso: Paquete Corporativo

Tu empresa quiere estandarizar pipelines:

**Paso 1: Crear con Generador**

```bash
npm install -g yo @opensecdevops/generator-osdo
yo @opensecdevops/osdo

? Package name: empresa-sa-nodejs
? Description: Pipeline estándar Node.js para Empresa SA
? Version: 1.0.0
? Author: Security Team <security@empresa.com>
? License: MIT
? CI/CD Platform: GitLab CI
? Include tests: Yes

✔ Created package structure
✔ Generated config.json
✔ Generated templates
✔ Configured testing
```

**Paso 2: Customizar config.json**

```json
{
  "name": "Empresa SA - Node.js Standard Pipeline",
  "version": "1.0.0",
  "description": "Pipeline estandarizado con políticas de seguridad de Empresa SA",
  "homepage": "https://gitlab.empresa.com/osdo/empresa-nodejs",
  "repository": {
    "type": "git",
    "url": "https://gitlab.empresa.com/osdo/empresa-nodejs.git"
  },
  "type": "pipeline",
  "license": "Proprietary",
  "author": "Security Team",
  "template": "gitlab-ci-empresasa",
  "file": ".gitlab-ci.yml",
  "language": "yaml",
  
  "blocks": [
    {
      "template": "empresasa-header",
      "name": "Header Corporativo",
      "description": "Variables y configuración estándar",
      "fields": []
    },
    {
      "template": "gitleaks",
      "name": "Secret Scanning (Obligatorio)",
      "description": "No se puede desactivar por política corporativa",
      "fields": [
        {
          "type": "text",
          "name": "job_name",
          "label": "Nombre del Job",
          "default": "secret-scan-empresasa",
          "rules": "required"
        }
      ]
    },
    {
      "template": "sonarqube-empresasa",
      "name": "SAST (SonarQube Empresarial)",
      "description": "Conectado a SonarQube corporativo",
      "fields": [
        {
          "type": "select",
          "name": "profile",
          "label": "Perfil de calidad",
          "options": [
            { "id": 1, "label": "Estándar", "value": "empresasa-standard" },
            { "id": 2, "label": "Crítico", "value": "empresasa-critical" },
            { "id": 3, "label": "Legacy", "value": "empresasa-legacy" }
          ],
          "default": 1
        },
        {
          "type": "switch",
          "name": "block_on_fail",
          "label": "Bloquear si quality gate falla",
          "default": true
        }
      ]
    },
    {
      "template": "trivy-empresasa",
      "name": "Container Scan (Harbor)",
      "description": "Escaneo con Trivy integrado con Harbor corporativo",
      "dependencies": ["gitleaks", "sonarqube-empresasa"],
      "fields": [
        {
          "type": "select",
          "name": "severity_level",
          "label": "Nivel de severidad mínimo",
          "options": [
            { "id": 1, "label": "CRITICAL", "value": "CRITICAL" },
            { "id": 2, "label": "HIGH,CRITICAL", "value": "HIGH,CRITICAL" },
            { "id": 3, "label": "MEDIUM,HIGH,CRITICAL", "value": "MEDIUM,HIGH,CRITICAL" }
          ],
          "default": 2
        }
      ]
    },
    {
      "template": "defectdojo-empresasa",
      "name": "Vulnerability Management",
      "description": "Integración con DefectDojo corporativo",
      "dependencies": ["sonarqube-empresasa", "trivy-empresasa"],
      "fields": [
        {
          "type": "select",
          "name": "product_type",
          "label": "Tipo de producto",
          "options": [
            { "id": 1, "label": "Web Application", "value": "web" },
            { "id": 2, "label": "API", "value": "api" },
            { "id": 3, "label": "Mobile Backend", "value": "mobile" }
          ]
        }
      ],
      "extra": [
        {
          "file": "defectdojo-import.sh",
          "language": "bash",
          "route": ".osdo/",
          "template": "defectdojo-script-empresasa"
        }
      ]
    }
  ]
}
```

**Paso 3: Crear Templates**

```handlebars
{{!-- templates/gitlab-ci-empresasa.hbs --}}
# Generado por OSDO App - Empresa SA
# Versión: {{version}}
# Fecha: {{date}}
# IMPORTANTE: Este pipeline cumple con políticas de seguridad corporativas

{{> empresasa-header}}

stages:
  - security-scan
  - build
  - test
  - container-security
  - vulnerability-management
  - deploy

{{> gitleaks}}

{{> sonarqube-empresasa}}

{{> trivy-empresasa}}

{{> defectdojo-empresasa}}

{{!-- templates/empresasa-header.hbs --}}
# Variables corporativas
variables:
  # Empresa SA - Configuration
  EMPRESASA_ENVIRONMENT: $CI_COMMIT_BRANCH
  EMPRESASA_PROJECT: $CI_PROJECT_NAME
  
  # Herramientas corporativas
  SONARQUBE_URL: "https://sonarqube.empresasa.com"
  HARBOR_REGISTRY: "harbor.empresasa.com"
  DEFECTDOJO_URL: "https://defectdojo.empresasa.com"
  
  # Políticas
  MIN_COVERAGE: "75"
  MAX_CRITICAL_VULNS: "0"
  MAX_HIGH_VULNS: "5"

# Jobs corporativos obligatorios
before_script:
  - echo "Empresa SA - Security Pipeline"
  - echo "Project: $EMPRESASA_PROJECT"
  - echo "Branch: $CI_COMMIT_BRANCH"
```

**Paso 4: Testing**

```javascript
// test/config.test.js
const config = require('../config.json');

describe('Empresa SA Package', () => {
  test('config structure is valid', () => {
    expect(config).toBeStructure();
  });
  
  test('renders correct gitlab-ci for standard profile', () => {
    const data = {
      'gitleaks': {
        job_name: 'secret-scan-empresasa'
      },
      'sonarqube-empresasa': {
        profile: 'empresasa-standard',
        block_on_fail: true
      },
      'trivy-empresasa': {
        severity_level: 'HIGH,CRITICAL'
      }
    };
    
    const expected = require('./fixtures/gitlab-ci-standard.yml');
    expect([{
      file: '.gitlab-ci.yml',
      view: expected,
      language: 'yaml'
    }]).toBeRender(data);
  });
});

// Ejecutar tests
npm test
```

**Paso 5: Publicar en GitLab**

```bash
git init
git add .
git commit -m "Initial package: Empresa SA Node.js Standard"
git remote add origin https://gitlab.empresa.com/osdo/empresa-nodejs.git
git push -u origin main

# Crear versión
git tag v1.0.0
git push --tags
```

**Paso 6: Importar en OSDO App**

```
1. Ir a OSDO App
2. Login con cuenta Empresa SA
3. Settings > Import Package
4. Package URL: https://gitlab.empresa.com/osdo/empresa-nodejs
5. Autenticar con GitLab token
6. Seleccionar tag: v1.0.0
7. Import

✓ Package "Empresa SA - Node.js Standard Pipeline" imported
✓ Available for all users in organization
```

**Paso 7: Uso por Equipos**

```
Ahora todos los equipos de Empresa SA pueden:

1. Ir a OSDO App
2. Select Package: "Empresa SA - Node.js Standard Pipeline"
3. Configurar opciones mínimas (profile, severity, etc.)
4. Descargar pipeline corporativo estandarizado

Beneficios:
✓ Cumplimiento garantizado con políticas
✓ Mantenimiento centralizado
✓ Actualización fácil (nuevo tag en GitLab)
✓ Visibilidad y control
```

## Testing y Validación

OSDO App incluye framework de testing:

```bash
npm install --save-dev @opensecdevops/jest-osdo

# jest.config.js
module.exports = {
  setupFilesAfterEnv: ['@opensecdevops/jest-osdo']
};
```

**Tests disponibles:**

```javascript
// 1. Validar estructura config.json
test('config structure', () => {
  expect(config).toBeStructure();
});

// 2. Validar render de templates
test('render pipeline', () => {
  expect(render).toBeRender(data);
});

// 3. Validar reglas de validación
test('validation rules', () => {
  const data = { npm: { job_name: 'npm' } };
  expect(true).toBeRules(data);
});
```

## Recursos Adicionales

- [Documentación completa de paquetes](../../app/package.mdx)
- [Testing de paquetes](../../app/testing.mdx)
- [Comunidad OSDO App](https://github.com/opensecdevops/osdo-app/discussions)
- [Paquetes de la comunidad](https://app.opensecdevops.org/packages)

---

**¿Necesitas ayuda con OSDO App?**  
- [GitHub Issues](https://github.com/opensecdevops/osdo-app/issues)
- [Email: app@opensecdevops.org](mailto:app@opensecdevops.org)
