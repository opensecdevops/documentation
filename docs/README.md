---
title: Introducción
description: OSDO - Metodología y Marco de Trabajo Open SecDevOps para desarrollo seguro y Cloud Native
keywords:
    - SecDevOps
    - Open SecDevOps
    - OSDO
    - Metodología de desarrollo
    - Seguridad en el desarrollo
    - DevSecOps
    - CNCF
    - OWASP
    - Cloud Native
    - Marco de trabajo
---

# Open SecDevOps (OSDO)

## Metodología y Marco de Trabajo para Desarrollo Seguro

**OSDO** (Open SecDevOps) es una **metodología integral** y un **marco de trabajo** de código abierto que integra los principios de seguridad (Security), desarrollo (Development) y operaciones (Operations) en un enfoque cohesivo y automatizado. OSDO ha sido diseñado para responder a los desafíos actuales en la creación y gestión de software seguro, cumpliendo con los estándares de la industria y alineado con las mejores prácticas de **OWASP** y **Cloud Native Computing Foundation (CNCF)**.

:::info Certificaciones Objetivo
OSDO está en proceso de certificación con:
- **OWASP** - Cumplimiento de estándares de seguridad de aplicaciones
- **CNCF** - Alineación con prácticas Cloud Native y Kubernetes
:::

<div style={{textAlign: 'center'}}>
![Diagrama de trabajo](/img/work_diagram.webp)
</div>

## ¿Qué es OSDO?

OSDO no es solo un conjunto de herramientas, es una **metodología completa** que proporciona:

### Como Metodología
- **Proceso estructurado** para integrar seguridad en cada fase del SDLC
- **Prácticas estandarizadas** basadas en OWASP y NIST
- **Cultura de seguridad compartida** entre todos los equipos
- **Mejora continua** mediante métricas y feedback loops

### Como Marco de Trabajo
- **23+ herramientas integradas** de código abierto
- **Workflows automatizados** para CI/CD seguro
- **Infraestructura como código** para múltiples plataformas
- **CLI unificado** para gestión simplificada
- **Plantillas reutilizables** para diferentes escenarios

### Cloud Native Ready
- **Kubernetes-first** con soporte multi-plataforma
- **Contenedorización** de todos los componentes
- **Escalabilidad horizontal** y alta disponibilidad
- **Observabilidad integrada** con Prometheus y Grafana
- **Service Mesh ready** con Istio

### OWASP Aligned
- **OWASP Top 10** cubierto en análisis automáticos
- **SAST/DAST** integrado en pipelines
- **SCA (Software Composition Analysis)** con Dependency Track
- **Secret scanning** con detección de fugas
- **Security testing** automatizado

## Principios Fundamentales de OSDO

La metodología SecDevOps se fundamenta en la colaboración estrecha entre los equipos de desarrollo, operaciones y seguridad, promoviendo una cultura organizacional donde la seguridad es una responsabilidad compartida. A través de ciclos iterativos e incrementales, SecDevOps fomenta la mejora continua y la adaptación a nuevos retos tecnológicos y de negocio.

### 1. **Integración Continua de la Seguridad (Shift-Left Security)**

OSDO promueve la incorporación de controles y prácticas de seguridad desde las etapas iniciales del diseño hasta la puesta en producción:

- Revisión de requisitos de seguridad desde el diseño
- Análisis de riesgos y threat modeling
- Definición de políticas con Kyverno
- Aplicación de estándares de codificación segura
- Identificación proactiva de vulnerabilidades

**Herramientas OSDO**: SonarQube, Semgrep, ThreatModeling

### 2. **Automatización y Pruebas Continuas**

La automatización es un pilar fundamental en OSDO. Se emplean herramientas para:

- **SAST (Static Application Security Testing)**: SonarQube, Semgrep
- **DAST (Dynamic Application Security Testing)**: OWASP ZAP
- **SCA (Software Composition Analysis)**: Dependency Track
- **Container Scanning**: Harbor con Trivy
- **Secret Scanning**: Gitleaks
- **Quality Gates**: DefectDojo para gestión centralizada

Todas estas pruebas se integran en los pipelines de CI/CD mediante **OSDO Workflow Templates**.

### 3. **Despliegue Continuo y Observabilidad**

OSDO facilita la entrega continua controlada con:

- **GitOps**: ArgoCD para despliegues declarativos
- **Monitoreo**: Prometheus + Grafana + Jaeger
- **Alerting**: Alertmanager con notificaciones automáticas
- **Logging**: Loki para agregación de logs
- **Tracing**: Jaeger para rastreo distribuido
- **Runtime Security**: Falco para detección de amenazas

### 4. **Gestión de Configuración y Cumplimiento**

OSDO incluye gestión automatizada de configuraciones seguras:

- **Gestión de Secretos**: HashiCorp Vault
- **Políticas como Código**: Kyverno para Kubernetes
- **Backup y DR**: Velero para recuperación ante desastres
- **Compliance Automation**: Verificación continua de estándares
- **Auditoría**: Registro completo de cambios y accesos

### 5. **Cultura y Formación en Seguridad**

La adopción de OSDO implica:

- Sensibilización y capacitación continua
- Comunicación abierta entre equipos
- Colaboración interdisciplinar
- Documentación y conocimiento compartido
- Formación en OWASP y Cloud Native

## Componentes del Marco OSDO

OSDO proporciona un ecosistema completo que incluye:

### Herramientas OSDO

#### OSDO CLI - Gestión de Infraestructura
Herramienta de línea de comandos para desplegar y gestionar la infraestructura DevSecOps:

```bash
# Desplegar infraestructura completa
osdo kind create dev
osdo deploy --platform kind --preset development

# Gestionar componentes individuales
osdo component install sonarqube
osdo component status harbor
```

**Gestiona 23+ componentes:**
- **Infraestructura (3):** cert-manager, nginx-ingress, Istio
- **CI/CD (4):** GitLab, Jenkins, ArgoCD, GitHub Actions Runner
- **Registros (2):** Harbor, Nexus
- **Seguridad (7):** SonarQube, DefectDojo, OWASP ZAP, Semgrep, Dependency Track, Falco, Kyverno
- **Observabilidad (4):** Prometheus, Alertmanager, Grafana, Loki, Jaeger
- **Datos y Backup (2):** Vault, Velero
- **Platform Engineering:** Templates integrados para Mobile, Web3, y GenAI (v2.0)

[Ver OSDO CLI en detalle →](./infrastructura/osdo-cli.md)

#### OSDO App - Generador de Pipelines
Aplicación web interactiva para crear pipelines de CI/CD personalizados mediante formularios dinámicos:

```bash
# Acceder a OSDO App
https://app.opensecdevops.org

# O usar el generador CLI
npm install -g yo @opensecdevops/generator-osdo
yo @opensecdevops/osdo
```

**Características:**
- Generación de pipelines para GitLab CI, GitHub Actions, Jenkins
- Formularios dinámicos con validación
- Paquetes reutilizables y compartibles
- Soporta múltiples tecnologías: Laravel, Node.js, Python, Go, etc.
- Bloques modulares: SAST, DAST, SCA, Container Scanning, etc.
- Comunidad de paquetes compartidos

**Flujo de trabajo:**
```mermaid
Usuario → OSDO App → Formulario → Pipeline personalizado (.gitlab-ci.yml, .github/workflows/*, Jenkinsfile)
```

[Ver OSDO App en detalle →](../app/README.md)

### Cómo Trabajan Juntos

```
1. OSDO CLI despliega infraestructura
   ↓
2. OSDO App genera pipelines configurados para usar esa infraestructura
   ↓
3. Pipelines ejecutan análisis de seguridad en herramientas desplegadas
   ↓
4. Resultados centralizados en DefectDojo y Grafana
```

**Ejemplo completo:**
```bash
# Paso 1: Desplegar infraestructura con OSDO CLI
osdo k3s create staging
osdo deploy --platform k3s --components sonarqube,harbor,defectdojo

# Paso 2: Generar pipeline con OSDO App
# Visitar https://app.opensecdevops.org
# Seleccionar: Node.js + SonarQube + Trivy + DefectDojo
# Descargar .gitlab-ci.yml

# Paso 3: El pipeline automáticamente usa la infraestructura desplegada
git add .gitlab-ci.yml
git commit -m "Add OSDO pipeline"
git push
```

[Ver documentación completa de componentes →](./infrastructura/README.md)

## Arquitectura Cloud Native

OSDO está diseñado para ser **Cloud Native** desde su concepción:

```
┌─────────────────────────────────────────────────────────┐
│                    OSDO Framework                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Security   │  │  Development │  │  Operations  │   │
│  │              │  │              │  │              │   │
│  │ • SAST/DAST  │  │ • CI/CD      │  │ • Monitoring │   │
│  │ • SCA        │  │ • GitOps     │  │ • Logging    │   │
│  │ • Secrets    │  │ • Testing    │  │ • Alerting   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              Kubernetes / Cloud Native                  │
│  • Multi-cluster  • Service Mesh  • Observability       │
└─────────────────────────────────────────────────────────┘
```

## Roadmap de Certificaciones

### OWASP Compliance
- ✅ Cobertura completa de OWASP Top 10
- ✅ SAST/DAST integrado
- ✅ Gestión de vulnerabilidades con DefectDojo
- 🔄 En proceso: Certificación formal OWASP

### CNCF Alignment
- ✅ Kubernetes-native
- ✅ Cloud Native herramientas (Prometheus, Jaeger, etc.)
- ✅ Service Mesh ready (Istio)
- 🔄 En proceso: CNCF Landscape inclusion

## Beneficios de Adoptar OSDO

### Para Desarrollo
- **Desarrollo más rápido** con pipelines automatizados
- **Feedback inmediato** sobre seguridad y calidad
- **Herramientas integradas** sin configuración compleja

### Para Seguridad
- **Seguridad desde el diseño** (Shift-Left)
- **Visibilidad completa** de vulnerabilidades
- **Remediación automatizada** cuando es posible

### Para Operaciones
- **Despliegues confiables** con GitOps
- **Observabilidad completa** del sistema
- **Recuperación rápida** ante fallos

### Para la Organización
- **Reducción de costos** por incidentes de seguridad
- **Cumplimiento** de estándares y regulaciones
- **Cultura de seguridad** mejorada

## Casos de Uso

OSDO es ideal para:

- **Empresas** que buscan implementar DevSecOps
- **Instituciones educativas** que enseñan desarrollo seguro
- **Equipos de investigación** en seguridad de aplicaciones
- **Startups** que quieren seguridad desde día 1
- **Organizaciones** con requerimientos de compliance

## Comenzar con OSDO

### Instalación Rápida

```bash
# 1. Instalar OSDO CLI (gestión de infraestructura)
curl -L https://github.com/osdo/osdo-infra-cli/releases/latest/download/osdo-cli -o osdo
chmod +x osdo && sudo mv osdo /usr/local/bin/

# 2. Desplegar infraestructura con stack de desarrollo
osdo kind create dev
osdo deploy --platform kind --preset development

# 3. Generar pipeline con OSDO App
# Opción A: Usar la web app
open https://app.opensecdevops.org

# Opción B: Usar el generador CLI
npm install -g yo @opensecdevops/generator-osdo
yo @opensecdevops/osdo

# 4. O usar workflow templates pre-configurados
gh repo create mi-proyecto --template osdo/osdo-workflow-template
```

### Flujo Completo de Trabajo

```bash
# Paso 1: Infraestructura (OSDO CLI)
osdo k3s create production
osdo deploy --platform k3s \
  --components sonarqube,harbor,defectdojo,prometheus,grafana

# Paso 2: Pipeline personalizado (OSDO App)
# Visitar https://app.opensecdevops.org
# Configurar:
#   - Plataforma CI/CD: GitLab CI
#   - Lenguaje: Node.js
#   - Herramientas: SonarQube, Trivy, DefectDojo
#   - Despliegue: Kubernetes
# Descargar pipeline generado

# Paso 3: Integrar en proyecto
cd mi-proyecto
# Copiar el .gitlab-ci.yml generado
git add .gitlab-ci.yml
git commit -m "Add OSDO security pipeline"
git push

# Paso 4: ¡El pipeline ejecuta automáticamente!
# - Análisis SAST con SonarQube
# - Escaneo de contenedor con Trivy
# - Reporte a DefectDojo
# - Métricas en Grafana
```

### Documentación Completa

- [Guía de Introducción](./introduccion/README.md)
- [Integración Continua (CI)](./ci/index.mdx)
- [Entrega Continua (CD)](./cd/index.md)
- [Infraestructura](./infrastructura/README.md)
- [Análisis de Ataques](../attacks/README.md)

## Comunidad y Contribución

OSDO es un proyecto de código abierto que busca la participación de la comunidad:

- [Discusiones en GitHub](https://github.com/opensecdevops/discussions)
- [Reportar Issues](https://github.com/opensecdevops/issues)
- [Contribuir](./contributing.md)
- Contacto: info@opensecdevops.com

---

En conjunto, **OSDO como metodología y marco de trabajo** proporciona una base sólida para el desarrollo de aplicaciones seguras, resilientes y alineadas con los estándares de la industria (**OWASP** y **CNCF**), facilitando la adaptación a un entorno tecnológico en constante evolución y preparado para obtener certificaciones formales de ambas organizaciones.
