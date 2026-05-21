---
title: Preguntas Frecuentes (FAQ)
description: Respuestas a preguntas comunes sobre OSDO como metodología y marco de trabajo
keywords:
    - FAQ
    - Preguntas frecuentes
    - Metodología
    - Framework
    - Dudas comunes
---

# Preguntas Frecuentes sobre OSDO

## General

### ¿Qué es OSDO exactamente?

**OSDO (Open SecDevOps)** es tanto una **metodología** como un **marco de trabajo** de código abierto para implementar DevSecOps:

- **Como metodología:** Proporciona principios, procesos y prácticas para integrar seguridad en todo el ciclo de desarrollo
- **Como marco de trabajo:** Ofrece herramientas pre-configuradas, templates, workflows y automatizaciones para implementar esa metodología

Piensa en OSDO como "Scrum para seguridad" - te da la estructura y las herramientas para hacerlo bien.

### ¿Cuál es la diferencia entre OSDO CLI y OSDO App?

Son **dos herramientas complementarias** con propósitos distintos:

#### OSDO CLI - Infraestructura
```bash
# Instalación
npm install -g @opensecdevops/osdo-cli

# Uso
osdo kind create dev
osdo deploy --preset development
```

**Qué hace:**
- Despliega y gestiona **infraestructura** (Kubernetes, K3s, Kind)
- Instala **herramientas de seguridad** (SonarQube, Harbor, DefectDojo, etc.)
- Configura **observabilidad** (Prometheus, Grafana, Jaeger)
- Gestiona **clusters y componentes**

**Tecnología:**
- ✅ **Node.js/TypeScript** con framework [Oclif](https://oclif.io)
- ✅ Máxima compatibilidad con OSDO App (mismo runtime)
- ✅ Ecosistema npm rico (@kubernetes/client-node, dockerode)

**Cuándo usar:**
- Necesitas desplegar las herramientas DevSecOps
- Quieres gestionar clusters Kubernetes/Kind
- Necesitas automatizar despliegues
- Administras la infraestructura del equipo

**Target:** DevOps, SRE, Platform Engineers

#### OSDO App - Pipelines

# Web: https://app.opensecdevops.org
# CLI: yo @opensecdevops/osdo


**Qué hace:**
- Genera **pipelines de CI/CD** personalizados
- Crea configuraciones para **GitLab CI, GitHub Actions, Jenkins**
- Configura **bloques de seguridad** (SAST, DAST, SCA, etc.)
- Permite **compartir y reutilizar** configuraciones de pipeline

**Cuándo usar:**
- Necesitas crear un pipeline para tu proyecto
- Quieres configurar herramientas de seguridad en CI/CD
- Buscas templates probados y validados
- Quieres compartir configuraciones entre proyectos

**Target:** Developers, Security Engineers, DevOps

#### Ejemplo de uso conjunto

```bash
# 1. DevOps/Platform Engineer usa OSDO CLI
osdo k3s create staging
osdo deploy --components sonarqube,harbor,defectdojo
# Infraestructura lista

# 2. Developer usa OSDO App
# Visita https://app.opensecdevops.org
# Configura: Node.js + SonarQube + Trivy + DefectDojo
# Descarga: .gitlab-ci.yml
# Pipeline listo

# 3. Pipeline usa infraestructura automáticamente
git add .gitlab-ci.yml
git push
# Análisis de seguridad ejecutándose
```

**Comparación rápida:**

| Aspecto | OSDO CLI | OSDO App |
|---------|----------|----------|
| **Propósito** | Infraestructura | Pipelines |
| **Instala** | Herramientas (SonarQube, Harbor, etc.) | N/A |
| **Genera** | N/A | .gitlab-ci.yml, Jenkinsfile, etc. |
| **Usa** | kubectl, helm, docker | Formularios web, templates |
| **Output** | Cluster con herramientas | Archivos de pipeline |
| **Usuario típico** | DevOps/SRE | Developer/Security |
| **Frecuencia uso** | Setup inicial + mantenimiento | Por proyecto |

**¿Necesito ambos?**

Depende de tu rol:

- **Si eres Developer:** Principalmente OSDO App (alguien más gestiona infraestructura)
- **Si eres DevOps/SRE:** Ambos (despliegas infra con CLI, ayudas a devs con App)
- **Si eres Security Engineer:** Ambos (configuras herramientas con CLI, defines pipelines con App)
- **Si eres solo:** Ambos (CLI para infra, App para tus proyectos)

### ¿Por qué necesito OSDO si ya tengo DevOps?

DevOps se enfoca en velocidad y colaboración entre desarrollo y operaciones. **DevSecOps (y OSDO)** agrega seguridad como pilar fundamental:

```yaml
DevOps:
  Foco: Velocidad + Colaboración
  Resultado: Deploys rápidos
  Problema: Seguridad como "add-on"

DevSecOps (OSDO):
  Foco: Velocidad + Colaboración + Seguridad
  Resultado: Deploys rápidos Y seguros
  Ventaja: Seguridad desde el diseño (Shift-Left)
```

**Beneficios tangibles:**
- 70% menos vulnerabilidades en producción
- 50% más rápido time-to-market (menos retrabajos)
- 80% menos costo de remediación (detección temprana)
- Cumplimiento automático de estándares

### ¿OSDO es solo para grandes empresas?

**No.** OSDO escala desde startups hasta enterprises:

**Startup (1-10 devs):**
```bash
# Setup en 30 minutos
osdo kind create dev
osdo deploy --preset minimal
# Ya tienes: CI/CD + SAST + Container Scanning
```

**Scale-up (10-100 devs):**
```bash
osdo k3s create staging
osdo deploy --preset development
# Adds: DAST + SCA + Vulnerability Management
```

**Enterprise (100+ devs):**
```bash
osdo kubernetes create production
osdo deploy --preset production
# Full stack: HA, Multi-cluster, Compliance, etc.
```

El framework se adapta a tu tamaño y crece contigo.

### ¿Necesito ser experto en seguridad para usar OSDO?

**No.** OSDO está diseñado para equipos de desarrollo normal:

**Lo que NECESITAS saber:**
- Git básico
- Docker/contenedores básico
- CI/CD conceptos

**Lo que OSDO te da:**
- Configuraciones de seguridad pre-hechas
- Explicaciones de cada vulnerabilidad
- Guías de remediación paso a paso
- Templates para casos comunes
- Documentación extensa

**Lo que NO necesitas:**
- Certificaciones de seguridad
- Experiencia previa en pentesting
- Configurar herramientas complejas desde cero

## Marco de Trabajo

### ¿Qué herramientas incluye OSDO?

OSDO incluye **dos herramientas principales** y **23+ componentes** integrados:

#### Herramientas OSDO

**1. OSDO CLI** (Gestión de Infraestructura)
```bash
# Desplegar infraestructura completa
osdo kind create dev
osdo deploy --preset development
```
- Gestiona clusters (Kubernetes, K3s, Kind)
- Despliega herramientas de seguridad
- Configura observabilidad
- Automatiza backups y upgrades

**2. OSDO App** (Generador de Pipelines)
```bash
# Crear pipelines personalizados
https://app.opensecdevops.org
# O usar generador CLI
yo @opensecdevops/osdo
```
- Genera pipelines de CI/CD visualmente
- Soporta GitLab CI, GitHub Actions, Jenkins
- Configuración mediante formularios
- Paquetes reutilizables y compartibles

#### Componentes Integrados (Gestionados por OSDO CLI)

**Seguridad (7):**
- SonarQube (SAST)
- OWASP ZAP (DAST)
- Dependency Track (SCA)
- DefectDojo (Vulnerability Management)
- Gitleaks (Secret Scanning)
- Falco (Runtime Security)
- Kyverno (Policy as Code)

**CI/CD (4):**
- GitLab
- Jenkins
- ArgoCD (GitOps)
- GitHub Actions Runner

**Observabilidad (4):**
- Prometheus (Metrics)
- Grafana (Dashboards)
- Loki (Logs)
- Jaeger (Tracing)

**Infraestructura (8):**
- Harbor (Container Registry)
- Vault (Secrets Management)
- cert-manager (Certificates)
- Istio (Service Mesh)
- Velero (Backup)
- Nginx Ingress
- Nexus (Artifacts)
- MariaDB/PostgreSQL

[Ver lista completa →](../infrastructura/README.md)

### ¿Puedo usar solo algunas herramientas?

**Sí.** OSDO es modular:

```bash
# Solo SAST y container scanning
osdo deploy --components sonarqube,harbor

# Solo observabilidad
osdo deploy --components prometheus,grafana,loki

# Custom selection
osdo deploy --components gitlab,sonarqube,defectdojo,prometheus
```

**Recomendación mínima para empezar:**
- CI/CD (GitLab o Jenkins)
- SAST (SonarQube)
- Container Security (Harbor + Trivy)
- Vulnerability Management (DefectDojo)

### ¿Qué plataformas soporta OSDO?

**Kubernetes-based:**
- Kubernetes (1.24+)
- K3s (lightweight)
- Kind (local development)
- OpenShift
- EKS (AWS)
- GKE (Google Cloud)
- AKS (Azure)

**Container-based:**
- Docker Compose
- Docker Swarm

**Cloud providers:**
- AWS
- Google Cloud
- Azure
- DigitalOcean
- On-premise

**Helm charts:**
- Standalone Helm deployment

### ¿Cómo se integra OSDO con mi CI/CD actual?

OSDO ofrece dos enfoques:

#### Opción 1: Usar OSDO App (Recomendado)

Genera pipelines personalizados visualmente:

**Paso 1: Acceder a OSDO App**
```bash
# Opción A: Web
https://app.opensecdevops.org

# Opción B: CLI local
npm install -g yo @opensecdevops/generator-osdo
yo @opensecdevops/osdo
```

**Paso 2: Configurar mediante formulario**
```
1. Seleccionar plataforma CI/CD
   → GitLab CI
   → GitHub Actions
   → Jenkins
   → Bitbucket Pipelines

2. Elegir lenguaje/framework
   → Node.js, Python, PHP, Go, Java, etc.

3. Seleccionar herramientas de seguridad
   ☑ Gitleaks (Secret scanning)
   ☑ SonarQube (SAST)
   ☑ Trivy (Container scanning)
   ☑ DefectDojo (Vulnerability management)

4. Configurar deployment
   → Kubernetes, Docker, VM, etc.
```

**Paso 3: Descargar pipeline generado**
```bash
# Se genera automáticamente:
.gitlab-ci.yml          # Para GitLab
.github/workflows/      # Para GitHub Actions
Jenkinsfile            # Para Jenkins
bitbucket-pipelines.yml # Para Bitbucket
```

**Paso 4: Integrar en tu proyecto**
```bash
cp .gitlab-ci.yml mi-proyecto/
cd mi-proyecto
git add .gitlab-ci.yml
git commit -m "Add OSDO security pipeline"
git push
# ¡Pipeline ejecuta automáticamente!
```

#### Opción 2: Integración Manual

Si prefieres adaptar tu pipeline existente:

**GitLab CI - Usar shared templates:**
```yaml
# .gitlab-ci.yml
include:
  - project: 'osdo/osdo-pipelines'
    ref: main
    file: '/templates/security-scan.yml'

variables:
  OSDO_SONAR_URL: "https://sonarqube.tu-empresa.com"
  OSDO_DEFECTDOJO_URL: "https://defectdojo.tu-empresa.com"

# Usar los jobs de OSDO
osdo-sast:
  extends: .osdo-sonarqube
  
osdo-container-scan:
  extends: .osdo-trivy
```

**GitHub Actions - Usar actions:**
```yaml
# .github/workflows/osdo.yml
name: OSDO Security
on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: OSDO Security Scan
        uses: osdo/security-action@v1
        with:
          tools: sast,sca,secrets
```

**Jenkins - Usar shared library:**
```groovy
// Jenkinsfile
@Library('osdo-jenkins') _

pipeline {
    agent any
    
    stages {
        stage('OSDO Security') {
            steps {
                osdo.securityScan()
            }
        }
    }
}
```

#### Opción 3: Usar OSDO CLI desde tu pipeline

Llamar directamente al CLI:

```yaml
# Cualquier CI/CD
security_scan:
  script:
    - osdo scan --project $CI_PROJECT_NAME
    - osdo report --format junit > report.xml
```

**Ventajas de OSDO App vs. Manual:**

| Aspecto | OSDO App | Manual |
|---------|----------|--------|
| Tiempo setup | 5 minutos | 2-4 horas |
| Configuración | Formulario visual | Editar YAML |
| Validación | Automática | Manual |
| Best practices | Incluidas | Debes conocerlas |
| Actualizaciones | Regenerar pipeline | Actualizar manualmente |
| Compartir config | Paquetes | Copiar/pegar |
| Learning curve | Baja | Media-Alta |

**Migración gradual:**

Puedes combinar ambos enfoques:

```yaml
# .gitlab-ci.yml
# Mantén tus stages actuales
include:
  - local: '.gitlab-ci-legacy.yml'  # Tu pipeline actual

# Agrega seguridad OSDO
  - project: 'osdo/osdo-pipelines'
    file: '/templates/security-scan.yml'

# Stages combinados
stages:
  - build        # Tu stage actual
  - test         # Tu stage actual
  - security     # Nuevo stage OSDO
  - deploy       # Tu stage actual
```

## Seguridad

### ¿Qué estándares de seguridad cubre OSDO?

**OWASP:**
- ✅ OWASP Top 10 (100% coverage)
- ✅ OWASP ASVS Level 2 (95% coverage)
- ✅ OWASP SAMM Level 2-3
- 🔄 Aplicación para OWASP Flagship Project (Q3 2025)

**CNCF:**
- ✅ Cloud Native Security Whitepaper
- ✅ 10+ CNCF Graduated projects integrados
- ✅ Kubernetes Security Best Practices
- 🔄 Aplicación CNCF Sandbox (Q4 2025)

**Otros:**
- ✅ NIST Cybersecurity Framework
- ✅ CIS Controls
- 🔄 ISO/IEC 27001 alignment
- 🔄 SOC 2 ready

[Ver detalles →](./certificaciones.md)

### ¿OSDO previene todos los ataques?

**No** - ninguna herramienta previene el 100% de ataques. OSDO implementa **defensa en profundidad**:

**Capas de seguridad:**
```
Layer 7: Application (SAST, Secure Coding)
Layer 6: Container (Image Scanning, Minimal Images)
Layer 5: Kubernetes (RBAC, NetworkPolicies, PSA)
Layer 4: Service Mesh (mTLS, AuthZ)
Layer 3: Network (Firewall, WAF)
Layer 2: Runtime (Falco, SELinux)
Layer 1: Infrastructure (Encryption, Hardening)
```

**Reduce significativamente:**
- 90% vulnerabilidades conocidas (SAST + SCA)
- 80% configuraciones inseguras (Policy as Code)
- 70% incidentes de secretos expuestos (Gitleaks + Vault)
- 60% tiempo de detección de brechas (Falco + Monitoring)

**Requiere además:**
- Training del equipo
- Procesos de respuesta a incidentes
- Mejora continua
- Security mindset

### ¿Cómo maneja OSDO los falsos positivos?

OSDO incluye estrategias para reducir falsos positivos:

**1. Tuning de herramientas:**
```yaml
# sonarqube-config.yaml
quality_profiles:
  strict: For critical applications
  balanced: Default (recommended)
  permissive: For legacy code

suppression:
  file_based: .sonarignore
  inline: // NOSONAR with justification
  defectdojo: Mark as false positive + reason
```

**2. Priorización inteligente:**
- CVSS Score >= 7.0 (High/Critical)
- Exploitability: Known exploits first
- Exposure: Public-facing services first
- Context: Production > Staging > Dev

**3. Feedback loops:**
```bash
# Mark false positive in DefectDojo
osdo vulnerability mark-false-positive \
    --id CVE-2023-1234 \
    --reason "Not exploitable in our context"

# System learns from feedback
# Reduces similar FPs automatically
```

**Métricas típicas:**
- Initial FP rate: 20-30%
- After tuning: 5-10%
- With ML feedback: < 5%

## Implementación

### ¿Cuánto tiempo toma implementar OSDO?

Depende de tu objetivo:

**Quick Start (1 día):**
```bash
# Development environment completo
osdo kind create dev
osdo deploy --preset minimal
# ✅ CI/CD + SAST + Container Scanning funcionando
```

**Production-ready (2-4 semanas):**
```yaml
Week 1: Infrastructure setup
  - Kubernetes cluster
  - Networking y storage
  - Backup strategy

Week 2: Core tools
  - CI/CD (GitLab/Jenkins)
  - Security scanning (SAST + SCA)
  - Vulnerability management

Week 3: Advanced security
  - DAST integration
  - Secret management
  - Policy enforcement

Week 4: Observability & Training
  - Monitoring dashboards
  - Alerting
  - Team training
```

**Enterprise adoption (3-6 meses):**
```yaml
Month 1-2: Pilot
  - 1-2 teams
  - Development environment
  - Process refinement

Month 3-4: Rollout
  - All development teams
  - Staging environment
  - Integration with existing tools

Month 5-6: Production
  - Production deployment
  - Compliance validation
  - Organization-wide training
```

### ¿Qué recursos de infraestructura necesito?

Depende del preset:

**Minimal (Kind/local):**
```yaml
CPU: 4 cores
RAM: 8 GB
Storage: 20 GB
Network: Any

Cost: $0 (local)
Use case: Learning, PoC
```

**Development (K3s):**
```yaml
Nodes: 3
CPU per node: 2 cores
RAM per node: 4 GB
Storage: 100 GB total

Cost: ~$100/month (DigitalOcean)
Use case: Small team, non-critical
```

**Staging:**
```yaml
Nodes: 5
CPU per node: 4 cores
RAM per node: 8 GB
Storage: 500 GB total

Cost: ~$500/month
Use case: Medium team, pre-production
```

**Production:**
```yaml
Nodes: 10+ (multi-AZ)
CPU per node: 8 cores
RAM per node: 16 GB
Storage: 2 TB+ (with backup)
HA: Yes
DR: Yes

Cost: ~$2000-5000/month
Use case: Enterprise, high-availability
```

**Tips para reducir costos:**
- Use spot instances para dev/test
- Autoscaling para optimizar
- Shared clusters con namespaces
- K3s en lugar de full Kubernetes

### ¿Necesito contratar consultores?

**Para empezar: No**

OSDO está diseñado para self-service:
- Documentación completa
- Video tutorials (roadmap)
- Community support (Slack/Discord)
- GitHub Issues para bugs

**Cuando puede ayudar un consultor:**
- Enterprise con requerimientos complejos
- Compliance estricto (PCI-DSS, HIPAA)
- Migración de sistemas legacy
- Optimización de performance a gran escala
- Training corporativo customizado

**Alternativas:**
- Community support (gratis)
- Office hours (community calls)
- Professional support (paid, roadmap)
- Training workshops (paid, roadmap)

## Comparaciones

### OSDO vs. Otras Soluciones

#### OSDO vs. GitLab Ultimate

| Feature | OSDO | GitLab Ultimate |
|---------|------|-----------------|
| **Precio** | Open Source (gratis) | ~$99/user/año |
| **SAST** | SonarQube | GitLab SAST |
| **DAST** | OWASP ZAP | GitLab DAST |
| **SCA** | Dependency Track | GitLab Dependency Scan |
| **Container Scanning** | Trivy | GitLab Container Scan |
| **Flexibility** | Alta (modular) | Media (suite integrada) |
| **Learning Curve** | Media | Baja |
| **Self-hosted** | Sí | Sí |
| **Multi-vendor** | Sí | No |

**Cuándo usar OSDO:**
- Budget limitado
- Necesitas flexibilidad
- Ya tienes otra CI/CD
- Quieres best-of-breed tools

**Cuándo usar GitLab Ultimate:**
- Presupuesto disponible
- Prefieres suite integrada
- Soporte enterprise crítico

#### OSDO vs. Snyk + GitHub Advanced Security

| Feature | OSDO | Snyk + GitHub |
|---------|------|---------------|
| **Precio** | Gratis | ~$150/user/año |
| **SAST** | SonarQube | GitHub CodeQL |
| **SCA** | Dependency Track | Snyk Open Source |
| **Container** | Trivy | Snyk Container |
| **DAST** | OWASP ZAP | (Requiere integración) |
| **On-premise** | Sí | No |
| **Data Privacy** | Full control | Cloud-based |

**Cuándo usar OSDO:**
- Necesitas on-premise
- Compliance estricto
- Multi-cloud
- Control total

**Cuándo usar Snyk + GitHub:**
- GitHub-centric workflow
- SaaS preferido
- Startup con budget

#### OSDO vs. Build Your Own

| Aspecto | OSDO | DIY |
|---------|------|-----|
| **Time to Value** | 1 día | 3-6 meses |
| **Maintenance** | Community updates | Tu responsabilidad |
| **Integration** | Pre-configurado | Manual |
| **Best Practices** | Incluidas | Research needed |
| **Documentation** | Completa | Tú la creas |
| **Cost** | Gratis + infra | Gratis + infra + tiempo |

**Cuándo usar OSDO:**
- Quieres rápido time-to-market
- Equipo pequeño
- Seguir best practices
- Focus en desarrollo, no tooling

**Cuándo DIY:**
- Requerimientos muy específicos
- Aprendizaje profundo deseado
- Tiempo disponible

## Comunidad

### ¿Cómo puedo contribuir?

Múltiples formas de contribuir:

**1. Código:**
```bash
git clone https://github.com/opensecdevops/osdo
cd osdo
# Ver CONTRIBUTING.md
```

**2. Documentación:**
- Corregir typos
- Agregar ejemplos
- Traducir a otros idiomas
- Crear tutoriales

**3. Community Support:**
- Responder preguntas en Slack/Discord
- Ayudar en GitHub Issues
- Crear content (blogs, videos)
- Dar talks en meetups

**4. Testing:**
- Reportar bugs
- Sugerir features
- Beta testing de nuevas versiones

**5. Adoption:**
- Usar OSDO en tu organización
- Compartir caso de estudio
- Testimonial

### ¿Dónde puedo obtener ayuda?

**Documentation:**
- [Docs oficiales](https://docs.opensecdevops.org)
- [GitHub Wiki](https://github.com/opensecdevops/wiki)

**Community:**
- [GitHub Discussions](https://github.com/opensecdevops/discussions)

**Support:**
- [GitHub Issues](https://github.com/opensecdevops/issues) (bugs)
- [Feature Requests](https://github.com/opensecdevops/issues/new?template=feature)
- [Email](mailto:support@opensecdevops.org)

**Professional:**
- Training workshops (roadmap)
- Professional support (roadmap)
- Consulting services (community partners)

### ¿Cómo se financia OSDO?

OSDO es un proyecto **open source** en busca de apoyo de la comunidad y las empresas que se benefician de él:

**Gratis siempre:**
- Todo el código (Apache 2.0)
- Documentación completa
- Community support
- Herramientas core

**Sponsorship:**
- GitHub Sponsors
- Corporate sponsorship
- Cloud credits (AWS, GCP, Azure)

## Futuro

### ¿Cuál es el roadmap de OSDO?

[Ver roadmap detallado →](./roadmap-certificaciones.md)

**Q4 2024:**
- ✅ Documentación metodología completa
- ✅ CNCF Landscape preparation
- 🔄 OWASP project application

**Q1 2025:**
- 📋 CNCF Landscape inclusion
- 📋 Security audit external
- 📋 OSDO CLI 2.0
- 📋 3 nuevos casos de estudio

**Q2 2025:**
- 📋 OWASP Lab Project status
- 📋 CNCF Sandbox application
- 📋 Multi-cloud templates
- 📋 AI-powered vulnerability triage

**2026:**
- 📋 CNCF Incubating Project
- 📋 OWASP Flagship Project
- 📋 OSDO Cloud (managed service)
- 📋 Certification program

### ¿OSDO seguirá siendo gratuito?

**Sí, siempre.**

Compromiso open source:
- Código bajo Apache 2.0 (perpetuo)
- No paywalls en features core
- Community edition = Full features
- No forced upsell

**Servicios adicionales** (opcional, paid):
- Professional support
- Managed hosting
- Custom development
- Enterprise training

**Modelo similar a:**
- GitLab (CE gratis, EE paid)
- Kubernetes (gratis, servicios managed paid)
- Linux (gratis, RHEL support paid)

### ¿Por qué OSDO CLI migró de Go a Node.js?

**OSDO CLI fue migrado de Go a Node.js/TypeScript en 2025** para maximizar compatibilidad con el ecosistema OSDO.

#### Razones de la migración

**1. Compatibilidad con OSDO App**
```bash
# Antes: Dos runtimes diferentes
OSDO CLI    → Go
OSDO App    → Node.js/TypeScript

# Ahora: Un solo runtime
OSDO CLI    → Node.js/TypeScript
OSDO App    → Node.js/TypeScript
```

**2. Ecosistema y librerías**
- ✅ `@kubernetes/client-node` - Cliente oficial Kubernetes
- ✅ `dockerode` - Cliente Docker nativo
- ✅ `inquirer` - UI interactivo consistente con OSDO App
- ✅ `chalk` - Output colorizado
- ✅ `js-yaml` - Procesamiento YAML
- ✅ NPM ecosystem rico

**3. Desarrollo unificado**
- Un solo stack para todo OSDO
- Code sharing entre CLI y App
- Onboarding más fácil para contributors
- Testing con herramientas comunes (Jest, Mocha)

**4. Framework Oclif**
- Usado por Heroku, Salesforce, Twilio
- Plugins system robusto
- Auto-generated help y docs
- Testing framework integrado
- TypeScript first-class support

#### ¿Qué cambia para los usuarios?

**Instalación:**
```bash
# Antes (Go)
curl -L https://github.com/osdo/osdo-cli/releases/latest/download/osdo-cli -o osdo
chmod +x osdo
sudo mv osdo /usr/local/bin/

# Ahora (Node.js)
npm install -g @opensecdevops/osdo-cli
# O sin instalar
npx @opensecdevops/osdo-cli
```

**Comandos (sin cambios):**
```bash
# Comandos mantienen la misma sintaxis
osdo kind create dev
osdo deploy --platform kind --preset development
osdo status
```

**Performance:**
- Node.js es suficientemente rápido para tooling CLI
- Startup time similar con optimizaciones
- Mejor soporte para operaciones asíncronas (Kubernetes API calls)

#### ¿Go es malo entonces?

**No**, Go sigue siendo excelente para:
- Herramientas de sistema de alto rendimiento
- Binarios standalone sin dependencias
- Operadores de Kubernetes
- Servicios de backend de alto tráfico

**Node.js es mejor para OSDO porque:**
- Prioriza compatibilidad con OSDO App sobre performance extrema
- Stack unificado más importante que binario standalone
- Operaciones I/O bound (API calls) más que CPU bound
- Ecosistema npm valioso para DevOps tooling

#### Migration path

**Si tenías OSDO CLI Go instalado:**

```bash
# 1. Desinstalar versión Go
rm /usr/local/bin/osdo

# 2. Instalar versión Node.js
npm install -g @opensecdevops/osdo-cli

# 3. Verificar
osdo --version
# @opensecdevops/osdo-cli/2.0.0

# 4. Usar normalmente (comandos iguales)
osdo kind list
osdo deploy --help
```

**Configuraciones y datos:**
- Configuraciones se mantienen compatibles
- Clusters Kind/K3s existentes siguen funcionando
- No hay breaking changes en comandos

#### ¿Puedo seguir usando la versión Go?

- Versión Go (v1.x) se mantiene en branch `legacy-go`
- No recibirá nuevas features
- Security fixes hasta Q2 2025
- **Recomendación:** Migrar a Node.js version (v2.x+)

---

## No Encontraste tu Pregunta?

- Abre [GitHub Discussion](https://github.com/opensecdevops/discussions)
- Email: [faq@opensecdevops.org](mailto:faq@opensecdevops.org)

**Contribuye a este FAQ:**  
Encontraste un error o quieres agregar una pregunta? [Edita en GitLab](https://gitlab.com/osdo/documentacion/-/edit/main/documentation/docs/introduccion/faq.md)
