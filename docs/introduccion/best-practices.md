---
title: Mejores Prácticas OSDO
description: Guía completa de mejores prácticas para implementar la metodología OSDO
keywords:
    - Best Practices
    - Mejores prácticas
    - SecDevOps
    - Seguridad
    - Cloud Native
---

# Mejores Prácticas de la Metodología OSDO

Esta guía recopila las mejores prácticas recomendadas para implementar exitosamente la metodología OSDO en tu organización.

## Principios Fundamentales

### 1. Shift-Left Security

**Concepto**: Integrar seguridad lo más temprano posible en el ciclo de desarrollo.

**Prácticas:**
```yaml
Diseño:
  - Threat modeling antes de codificar
  - Security requirements definidos
  - Arquitectura revisada por seguridad

Desarrollo:
  - IDE con plugins de seguridad
  - Pre-commit hooks (Gitleaks)
  - Peer review con security checklist

CI/CD:
  - SAST en cada commit
  - SCA en cada build
  - Quality gates obligatorios

Testing:
  - DAST automatizado
  - Security regression tests
  - Penetration testing regular
```

**Anti-patrones a evitar:**
- "Revisaremos la seguridad al final"
- Security como equipo separado
- Testing de seguridad solo manual
- "No tenemos tiempo para seguridad"

### 2. Automation First

**Concepto**: Automatizar todo lo automatizable para escalar y reducir errores.

**Prácticas:**
```yaml
Testing:
  - Automated security tests en CI/CD
  - Scheduled scans (nightly/weekly)
  - Continuous monitoring
  
Remediation:
  - Auto-fixing de issues simples
  - Automated patching cuando sea seguro
  - Pull requests automáticos para updates
  
Compliance:
  - Policy as Code (Kyverno)
  - Automated compliance checks
  - Continuous audit logging

Deployment:
  - GitOps con ArgoCD
  - Immutable infrastructure
  - Automated rollbacks
```

**Ejemplo de pipeline automatizado:**
```yaml
# .gitlab-ci.yml
stages:
  - security-scan
  - build
  - test
  - security-test
  - deploy

sast:
  stage: security-scan
  script:
    - sonar-scanner
  allow_failure: false

secret-scan:
  stage: security-scan
  script:
    - gitleaks detect
  allow_failure: false

container-scan:
  stage: test
  script:
    - trivy image $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  allow_failure: false

dast:
  stage: security-test
  script:
    - zap-baseline.py -t $TEST_URL
  allow_failure: true  # Al inicio
```

### 3. Defense in Depth

**Concepto**: Múltiples capas de seguridad para protección redundante.

**Capas de seguridad en OSDO:**
```
Layer 7: Application Security
  ├─ SAST (SonarQube)
  ├─ Secure coding practices
  └─ Input validation

Layer 6: Container Security
  ├─ Image scanning (Trivy)
  ├─ Minimal base images
  └─ Non-root containers

Layer 5: Kubernetes Security
  ├─ Network policies
  ├─ Pod Security Standards
  └─ RBAC estricto

Layer 4: Service Mesh
  ├─ mTLS (Istio)
  ├─ Authorization policies
  └─ Rate limiting

Layer 3: Network Security
  ├─ Ingress/Egress rules
  ├─ WAF (si aplica)
  └─ DDoS protection

Layer 2: Runtime Security
  ├─ Falco para detección
  ├─ SELinux/AppArmor
  └─ Seccomp profiles

Layer 1: Infrastructure
  ├─ Encrypted at rest
  ├─ Encrypted in transit
  └─ Hardened OS
```

### 4. Fail Secure

**Concepto**: En caso de error o falla, el sistema debe mantenerse seguro.

**Prácticas:**
```yaml
Pipeline Failures:
  - Security gates no deben ser bypasseable
  - Failures bloquean deployment
  - Requieren explicit override con justificación

Default Deny:
  - Network policies default deny
  - RBAC principle of least privilege
  - Secrets solo accesibles por quien los necesita

Error Handling:
  - No exponer stack traces
  - Generic error messages
  - Detailed logs solo en sistemas seguros

Rollback Automático:
  - Health checks comprehensive
  - Automated rollback on failure
  - State validation post-deployment
```

### 5. Visibility and Observability

**Concepto**: No puedes asegurar lo que no puedes ver.

**Prácticas:**
```yaml
Metrics (Prometheus):
  - Security events count
  - Vulnerability trends
  - Compliance score
  - Failed authentication attempts

Logs (Loki):
  - Centralized logging
  - Structured logging (JSON)
  - Log retention policies
  - SIEM integration

Traces (Jaeger):
  - Request tracing
  - Performance bottlenecks
  - Error propagation
  - Security event correlation

Dashboards (Grafana):
  - Security posture dashboard
  - Vulnerability trends
  - Compliance status
  - Incident timeline
```

## Prácticas de Seguridad por Fase

### Fase 1: Design & Planning

**Threat Modeling:**
```markdown
1. Identificar assets
   - Datos sensibles
   - APIs críticos
   - Componentes clave

2. Identificar amenazas (STRIDE)
   - Spoofing
   - Tampering
   - Repudiation
   - Information Disclosure
   - Denial of Service
   - Elevation of Privilege

3. Identificar contramedidas
   - Controles técnicos
   - Controles de proceso
   - Monitoreo

4. Validar mitigación
   - Security tests
   - Penetration testing
   - Red team exercises
```

**Security Requirements:**
```yaml
Authentication:
  - MFA obligatorio
  - Password complexity
  - Session management
  - Token expiration

Authorization:
  - RBAC/ABAC
  - Least privilege
  - Segregation of duties
  - Audit trail

Data Protection:
  - Encryption at rest
  - Encryption in transit
  - Data classification
  - PII handling

Monitoring:
  - Security logging
  - Anomaly detection
  - Alert thresholds
  - Incident response
```

### Fase 2: Development

**Secure Coding:**
```python
# BUENO: Input validation
from pydantic import BaseModel, validator

class UserInput(BaseModel):
    email: str
    age: int
    
    @validator('email')
    def email_must_be_valid(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v

# MALO: SQL Injection vulnerable
query = f"SELECT * FROM users WHERE email = '{user_input}'"

# BUENO: Parameterized query
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (user_input,))

# MALO: Secret hardcoded
API_KEY = "sk-1234567890abcdef"

# BUENO: Secret from env/vault
API_KEY = os.getenv('API_KEY')
```

**Pre-commit Hooks:**
```bash
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/zricethezav/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-yaml
      - id: check-json
      - id: detect-private-key
      
  - repo: local
    hooks:
      - id: security-check
        name: Security check
        entry: bandit
        language: system
        types: [python]
```

### Fase 3: Build & Test

**Container Best Practices:**
```dockerfile
# BUENO: Multi-stage build
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o app

FROM gcr.io/distroless/base-debian12
COPY --from=builder /app/app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]

# MALO: Imagen grande con vulnerabilidades
FROM ubuntu:latest
RUN apt-get update && apt-get install -y ...
COPY app /app
CMD ["/app"]
```

**Testing Security:**
```yaml
Unit Tests:
  - Security-focused unit tests
  - Edge cases y error handling
  - Cryptographic functions
  - Access control logic

Integration Tests:
  - API security tests
  - Authentication flows
  - Authorization checks
  - Data validation

Security Tests:
  - SAST (SonarQube)
  - Dependency check (Dependency Track)
  - Container scan (Trivy)
  - Secret scan (Gitleaks)

E2E Tests:
  - DAST (OWASP ZAP)
  - Pentest automation
  - Compliance validation
```

### Fase 4: Deploy

**GitOps Best Practices:**
```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  destination:
    namespace: production
    server: https://kubernetes.default.svc
  source:
    repoURL: https://github.com/org/repo
    targetRevision: main
    path: k8s/overlays/production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=false  # Namespace debe existir
      - RespectIgnoreDifferences=true
  # Validar antes de aplicar
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas  # Ignorar HPA changes
```

**Deployment Checklist:**
```markdown
Pre-deployment:
  - [ ] Security scans passed
  - [ ] Quality gates passed
  - [ ] Peer review approved
  - [ ] Change management approval
  - [ ] Backup created
  - [ ] Rollback plan ready

Deployment:
  - [ ] Blue-green or canary strategy
  - [ ] Health checks configured
  - [ ] Monitoring active
  - [ ] Alerts configured

Post-deployment:
  - [ ] Smoke tests passed
  - [ ] Performance validated
  - [ ] Security posture checked
  - [ ] Documentation updated
```

### Fase 5: Operate & Monitor

**Monitoring Best Practices:**
```yaml
# prometheus-rules.yaml
groups:
  - name: security
    interval: 30s
    rules:
      # High rate of failed logins
      - alert: HighFailedLoginRate
        expr: rate(login_failures_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High failed login rate detected"
          
      # Vulnerability scan found criticals
      - alert: CriticalVulnerabilities
        expr: vulnerability_critical_count > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Critical vulnerabilities found"
          
      # Suspicious network activity
      - alert: SuspiciousNetworkActivity
        expr: rate(egress_bytes_total[5m]) > 1e9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Unusual egress traffic detected"
```

**Incident Response:**
```markdown
## Proceso de Respuesta a Incidentes

### 1. Detection
- Alert triggered
- Log analysis
- User report

### 2. Analysis
- Determine severity
- Identify scope
- Assess impact

### 3. Containment
- Isolate affected systems
- Block malicious IPs
- Revoke compromised credentials

### 4. Eradication
- Remove malware
- Patch vulnerabilities
- Update configurations

### 5. Recovery
- Restore from backup
- Validate integrity
- Resume operations

### 6. Lessons Learned
- Post-mortem meeting
- Document timeline
- Update runbooks
- Improve detection
```

## Cloud Native Best Practices

### Kubernetes Security

**Pod Security:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: app
      image: my-app:1.0.0
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
        capabilities:
          drop:
            - ALL
      resources:
        limits:
          cpu: 500m
          memory: 512Mi
        requests:
          cpu: 250m
          memory: 256Mi
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
```

**Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
```

**Kyverno Policies:**
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-non-root
spec:
  validationFailureAction: enforce
  rules:
    - name: check-runAsNonRoot
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: "Running as root is not allowed"
        pattern:
          spec:
            securityContext:
              runAsNonRoot: true
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  validationFailureAction: enforce
  rules:
    - name: check-limits
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: "Resource limits are required"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"
```

### Service Mesh Security

**Istio mTLS:**
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-only-frontend
  namespace: production
spec:
  selector:
    matchLabels:
      app: backend
  action: ALLOW
  rules:
    - from:
        - source:
            principals:
              - cluster.local/ns/production/sa/frontend
```

## Uso de Herramientas OSDO

### OSDO CLI - Gestión de Infraestructura

**Best practices para despliegue:**

```bash
# BUENO: Usar presets para consistencia
osdo deploy --preset production

# MALO: Instalar componentes uno por uno sin planificación
osdo component install sonarqube
osdo component install harbor
# (sin coordinación ni configuración coherente)

# BUENO: Validar antes de aplicar
osdo config validate
osdo deploy --dry-run
osdo deploy --apply

# MALO: Deploy directo sin validación
osdo deploy --force

# BUENO: Backup antes de upgrades
osdo backup create --description "Pre-upgrade 2.0"
osdo upgrade --component sonarqube --version 10.0

# MALO: Upgrade sin backup
osdo upgrade --component sonarqube --latest
```

**Gestión de ambientes:**
```bash
# BUENO: Separar ambientes
osdo kind create dev-team-a
osdo k3s create staging-team-a
osdo kubernetes create prod-team-a

# Usar configuraciones por ambiente
osdo deploy --env dev --config dev-config.yaml
osdo deploy --env staging --config staging-config.yaml
osdo deploy --env prod --config prod-config.yaml

# MALO: Mismo ambiente para todo
osdo kind create shared
# (mezclar dev y staging en mismo cluster)
```

### OSDO App - Generación de Pipelines

**Best practices para crear pipelines:**

#### 1. Usar Bloques Modulares

```yaml
# BUENO: Pipeline modular y reutilizable
# Configurar en OSDO App:

Bloques seleccionados:
  ✓ Secret Scanning (Gitleaks)
  ✓ SAST (SonarQube)
  ✓ Dependency Scanning (npm audit)
  ✓ Build & Test
  ✓ Container Scan (Trivy)
  ✓ Deploy (Kubernetes)

# Resultado: .gitlab-ci.yml limpio y mantenible
stages:
  - security-scan
  - build
  - test
  - container-security
  - deploy

# MALO: Pipeline monolítico todo en un stage
stages:
  - everything
  
everything:
  script:
    - gitleaks detect
    - sonar-scanner
    - npm audit
    - docker build
    - trivy scan
    - kubectl apply
  # Difícil de mantener, depurar y reutilizar
```

#### 2. Configurar Quality Gates Apropiados

```javascript
// En OSDO App configurar:

// BUENO: Quality gates graduales
Development:
  SAST: Allow failures, report only
  Coverage: > 60%
  Vulnerabilities: Report all

Staging:
  SAST: Block on critical issues
  Coverage: > 70%
  Vulnerabilities: Block critical

Production:
  SAST: Block on high+ issues
  Coverage: > 80%
  Vulnerabilities: Block high+, track medium

// MALO: Same strict rules everywhere
All environments:
  SAST: Block on any issue
  Coverage: > 90%
  Vulnerabilities: Block all
  // Demasiado restrictivo para desarrollo
```

#### 3. Nombrar Jobs Descriptivamente

```yaml
# BUENO: Nombres claros en OSDO App form
Job names:
  secret-scan-gitleaks
  sast-sonarqube
  sca-npm-audit
  container-scan-trivy
  deploy-staging-k8s

# MALO: Nombres genéricos
Job names:
  scan1
  scan2
  test
  deploy
```

#### 4. Usar Variables de Entorno Correctamente

```yaml
# OSDO App genera:

# BUENO: Variables en GitLab CI/CD settings
# No hardcodear en pipeline
variables:
  SONAR_HOST_URL: $SONARQUBE_URL
  SONAR_TOKEN: $SONARQUBE_TOKEN
  DEFECTDOJO_URL: $DEFECTDOJO_URL
  DEFECTDOJO_TOKEN: $DEFECTDOJO_API_KEY

# MALO: Secretos hardcodeados
variables:
  SONAR_TOKEN: "squ_1234567890abcdef"
  DATABASE_PASSWORD: "super_secret_123"
```

#### 5. Compartir y Reutilizar Paquetes

```bash
# BUENO: Crear paquetes corporativos

# 1. Crear paquete base de la empresa
yo @opensecdevops/osdo

# Configurar:
# Name: empresa-nodejs-standard
# Description: Pipeline estándar Node.js para Empresa SA
# Blocks: Gitleaks, SonarQube, npm audit, Trivy, DefectDojo

# 2. Publicar en GitLab
git push gitlab.empresa.com/osdo/empresa-nodejs-standard

# 3. Importar en OSDO App
# Settings > Import Package
# URL: https://gitlab.empresa.com/osdo/empresa-nodejs-standard

# 4. Todos los equipos usan el mismo paquete
# Consistencia garantizada

# MALO: Cada equipo crea su propio pipeline
# Sin estándares, difícil de mantener
```

#### 6. Testing de Paquetes

```javascript
// BUENO: Test tus paquetes personalizados
// test/pipeline.test.js

const config = require("../config.json");
const fs = require("fs");

test('validate config structure', () => {
    expect(config).toBeStructure();
});

test('render correct gitlab-ci', () => {
    const data = {
        gitleaks: {
            job_name: "secret-scan",
            allow_failure: false
        },
        sonarqube: {
            job_name: "sast-analysis",
            quality_gate: true
        }
    };
    
    const expected = fs.readFileSync(
        './fixtures/.gitlab-ci.yml',
        'utf8'
    );
    
    expect([{
        file: '.gitlab-ci.yml',
        view: expected,
        language: 'yaml'
    }]).toBeRender(data);
});

// MALO: No testear paquetes
// Publicar sin validar
// Errores en producción
```

#### 7. Documentar Configuraciones

```markdown
# BUENO: README en paquete

## Pipeline de Seguridad Node.js

### Herramientas incluidas
- Gitleaks: Detección de secretos
- SonarQube: SAST
- npm audit: SCA
- Trivy: Container scanning
- DefectDojo: Gestión de vulnerabilidades

### Configuración requerida
Variables en GitLab CI/CD:
- `SONARQUBE_URL`
- `SONARQUBE_TOKEN`
- `DEFECTDOJO_URL`
- `DEFECTDOJO_API_KEY`

### Uso
1. Generar pipeline en OSDO App
2. Seleccionar este paquete
3. Configurar variables
4. Descargar .gitlab-ci.yml

# MALO: Sin documentación
# Usuarios no saben cómo usar el paquete
```

#### 8. Versionado de Paquetes

```json
// BUENO: Versiones semánticas

// config.json
{
  "name": "nodejs-security-pipeline",
  "version": "2.1.0",  // Major.Minor.Patch
  "changelog": {
    "2.1.0": "Added DefectDojo integration",
    "2.0.0": "Breaking: Changed SonarQube config format",
    "1.2.1": "Fixed Trivy severity levels"
  }
}

// Tag en git
git tag v2.1.0
git push --tags

// MALO: Sin versionado
{
  "version": "latest"
}
// No se puede rastrear cambios
// Difícil hacer rollback
```

#### 9. Plantillas Handlebars Limpias

```handlebars
{{!-- BUENO: Template con comentarios y estructura clara --}}

{{!-- Secret Scanning Stage --}}
{{#if gitleaks}}
gitleaks:
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

{{!-- MALO: Template sin estructura --}}
{{#if gitleaks}}gitleaks:
stage:security-scan
image:{{gitleaks.image_value}}
script:
-gitleaks detect{{#if gitleaks.allow_failure}}
allow_failure:true{{/if}}{{/if}}
```

### Workflow Completo: CLI + App

**Escenario: Nueva aplicación Node.js**

```bash
# Fase 1: Preparación de Infraestructura (DevOps/SRE)
# Tiempo: ~1 hora

# 1. Crear cluster staging
osdo k3s create staging-app-nueva

# 2. Desplegar stack de seguridad
osdo deploy --platform k3s \
  --components \
    sonarqube,\
    harbor,\
    defectdojo,\
    prometheus,\
    grafana \
  --env staging

# 3. Configurar accesos
osdo config export --env staging > staging-urls.txt
# Compartir con equipo de desarrollo

# Fase 2: Configuración de Pipeline (Developer/Security)
# Tiempo: ~15 minutos

# 1. Acceder a OSDO App
open https://app.opensecdevops.org

# 2. Seleccionar configuración en formulario:
#    Plataforma: GitLab CI
#    Lenguaje: Node.js
#    Framework: Express
#    Package Manager: npm
#
#    Security Tools:
#    ✓ Gitleaks (Secrets)
#    ✓ SonarQube (SAST)  
#    ✓ npm audit (SCA)
#    ✓ Trivy (Container)
#    ✓ DefectDojo (Management)
#
#    Quality Gates:
#    - Code Coverage: 75%
#    - Security Rating: A
#    - Vulnerabilities: 0 critical, < 5 high
#
#    Deployment:
#    - Target: Kubernetes
#    - Strategy: Rolling update
#    - Namespace: staging-app-nueva

# 3. Descargar archivos generados
#    - .gitlab-ci.yml
#    - scripts/defectdojo-import.sh

# Fase 3: Integración en Proyecto (Developer)
# Tiempo: ~5 minutos

cd app-nueva

# 1. Copiar pipeline generado
cp ~/Downloads/.gitlab-ci.yml .
cp -r ~/Downloads/scripts .

# 2. Configurar variables en GitLab
# Settings > CI/CD > Variables:
#   SONARQUBE_URL: https://sonarqube.staging.empresa.com
#   SONARQUBE_TOKEN: [from secret manager]
#   HARBOR_URL: harbor.staging.empresa.com
#   HARBOR_USER: robot$app-nueva
#   HARBOR_PASSWORD: [from secret manager]
#   DEFECTDOJO_URL: https://defectdojo.staging.empresa.com
#   DEFECTDOJO_TOKEN: [from secret manager]

# 3. Commit y push
git add .gitlab-ci.yml scripts/
git commit -m "Add OSDO security pipeline"
git push

# 4. Verificar pipeline
# GitLab > CI/CD > Pipelines
# Ver ejecución en tiempo real

# Fase 4: Monitoreo y Ajuste (Todo el equipo)
# Tiempo: Continuo

# 1. Revisar resultados
# - SonarQube: Quality gate passed/failed
# - DefectDojo: Vulnerabilities centralizadas
# - Grafana: Métricas de seguridad

# 2. Ajustar según feedback
# Si quality gate falla:
# - Revisar issues en SonarQube
# - Corregir código
# - Re-push

# 3. Iterar pipeline si necesario
# - Volver a OSDO App
# - Ajustar configuración
# - Regenerar pipeline
# - Actualizar en proyecto
```

**Resultado:**
- Infraestructura lista y mantenible
- Pipeline estandarizado y probado
- Seguridad integrada desde día 1
- Visibilidad completa en dashboards
- Proceso reproducible para nuevos proyectos

## Métricas y KPIs

### Security Metrics

```yaml
Vulnerability Management:
  - Mean Time to Detect (MTTD): < 24h
  - Mean Time to Remediate (MTTR): < 7d for critical
  - Vulnerability density: < 1 per KLOC
  - False positive rate: < 10%

Code Quality:
  - Security rating: A
  - Code coverage: > 80%
  - Duplications: < 3%
  - Technical debt: < 5%

Compliance:
  - Policy compliance: > 95%
  - Audit success rate: 100%
  - Security training completion: 100%
  - Incidents with RCA: 100%

Deployment:
  - Deployment frequency: > 1/day
  - Lead time: < 1 day
  - MTTR: < 1 hour
  - Change failure rate: < 5%
```

### Dashboards Recomendados

**Security Posture Dashboard:**
- Vulnerabilities by severity
- Trends over time
- Top vulnerable components
- Remediation progress
- Compliance score

**Operational Dashboard:**
- Deployment frequency
- Success rate
- Rollback rate
- Performance metrics
- Error rate

**Incident Dashboard:**
- Open incidents
- Response time
- Resolution time
- Incident trends
- Security events

## Training y Cultura

### Security Champions Program

**Estructura:**
```markdown
1. Identificar champions
   - 1 por equipo/proyecto
   - Rotación cada 6-12 meses
   - Voluntarios preferidos

2. Training
   - OWASP Top 10
   - Secure coding
   - OSDO tools
   - Incident response

3. Responsabilidades
   - Peer review de seguridad
   - Training a equipo
   - Feedback a security team
   - Mejoras en procesos

4. Reconocimiento
   - Certificaciones
   - Badges
   - Career path
   - Bonus/incentivos
```

### Continuous Learning

**Recursos:**
- Weekly security tips
- Monthly lunch & learns
- Quarterly CTFs
- Annual security conference
- Certification sponsorship

**Hands-on:**
```bash
# OSDO Lab Environment
osdo kind create training
osdo deploy --platform kind --preset vulnerable

# Practice exercises:
1. Find and fix OWASP Top 10
2. Implement security controls
3. Create Kyverno policies
4. Respond to simulated incidents
5. Red team vs Blue team
```

## Checklists

### Code Review Security Checklist

```markdown
Authentication & Authorization:
  - [ ] No hardcoded credentials
  - [ ] Proper authentication checks
  - [ ] Authorization enforced
  - [ ] Session management secure

Input Validation:
  - [ ] All inputs validated
  - [ ] SQL injection prevented
  - [ ] XSS prevented
  - [ ] Command injection prevented

Data Protection:
  - [ ] Sensitive data encrypted
  - [ ] PII properly handled
  - [ ] Secrets in Vault
  - [ ] Data minimization

Error Handling:
  - [ ] No sensitive data in errors
  - [ ] Generic error messages
  - [ ] Proper logging
  - [ ] No stack traces exposed

Dependencies:
  - [ ] No known vulnerabilities
  - [ ] License compliance
  - [ ] Minimal dependencies
  - [ ] Regularly updated
```

### Deployment Security Checklist

```markdown
Pre-deployment:
  - [ ] Security scans passed
  - [ ] Penetration tests done
  - [ ] Secrets rotated
  - [ ] Backup created
  - [ ] Runbook updated

Configuration:
  - [ ] TLS enabled
  - [ ] Strong ciphers only
  - [ ] Security headers set
  - [ ] CORS configured
  - [ ] Rate limiting enabled

Kubernetes:
  - [ ] Non-root containers
  - [ ] Resource limits set
  - [ ] Network policies applied
  - [ ] RBAC configured
  - [ ] Pod security enforced

Monitoring:
  - [ ] Metrics collected
  - [ ] Logs aggregated
  - [ ] Alerts configured
  - [ ] Dashboards created
  - [ ] On-call rotation set
```

## Continuous Improvement

### Retrospectivas de Seguridad

**Frecuencia:** Mensual o post-incident

**Agenda:**
```markdown
1. Review de métricas (15 min)
   - Vulnerabilities found/fixed
   - Incidents occurred
   - KPIs status

2. What went well (15 min)
   - Éxitos y logros
   - Detecciones tempranas
   - Mejoras implementadas

3. What didn't go well (15 min)
   - Incidentes
   - Fallos de proceso
   - Gaps identificados

4. Action items (15 min)
   - Mejoras a implementar
   - Owners asignados
   - Deadlines definidos

5. Learning (15 min)
   - New techniques
   - Industry trends
   - Tool updates
```

### Innovation Time

**Práctica:** 20% del tiempo para innovación

**Ejemplos:**
- Investigar nuevas herramientas
- Automatizar tareas manuales
- Crear PoCs de soluciones
- Contribuir a open source
- Escribir blog posts
- Dar charlas

---

**¿Tienes más best practices?**  
Contribuye a [OSDO en GitHub](https://github.com/opensecdevops) o comparte en [Discussions](https://github.com/opensecdevops/discussions).
