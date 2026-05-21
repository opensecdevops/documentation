# Infastructura

## Instalación Rápida con OSDO CLI (Recomendado)

La forma más rápida y sencilla de desplegar toda la infraestructura OSDO es utilizando **OSDO CLI**, que automatiza el proceso completo de instalación y configuración.

### Instalación de OSDO CLI

```bash
# Descargar el binario
curl -L https://github.com/osdo/osdo-infra-cli/releases/latest/download/osdo-cli -o osdo
chmod +x osdo
sudo mv osdo /usr/local/bin/

# Verificar instalación
osdo --version
```

### Uso Básico

```bash
# Ver todos los componentes disponibles
osdo deploy --help

# Desplegar componente específico en Kubernetes
osdo deploy --platform kubernetes --components sonarqube

# Desplegar múltiples componentes
osdo deploy --platform kubernetes --components gitlab,jenkins,harbor,sonarqube

# Modo interactivo (recomendado para principiantes)
osdo deploy --interactive --platform kubernetes

# Usar presets predefinidos
osdo deploy --preset development --platform kind
osdo deploy --preset staging --platform k3s
osdo deploy --preset production --platform kubernetes
```

### Ejemplos por Escenario

#### Desarrollo Local
```bash
# Crear cluster Kind
osdo kind create dev-local

# Desplegar herramientas de desarrollo
osdo deploy --platform kind --kind-cluster dev-local \
  --components prometheus,grafana,sonarqube,gitlab
```

#### Staging
```bash
# Desplegar stack completo en K3s
osdo deploy --platform k3s --preset staging \
  --domain staging.miempresa.com
```

#### Producción
```bash
# Stack completo de producción
osdo deploy --platform kubernetes --preset production \
  --domain prod.miempresa.com \
  --namespace production
```

:::tip
 **Documentación Completa**: [OSDO CLI Docs (v2.0)](./osdo-cli.md)

Cada componente en esta documentación incluye una sección de instalación con OSDO CLI con ejemplos específicos.
:::

---

## Componentes Disponibles

### Infraestructura Core (3 componentes)
- [cert-manager](./certmanager/README.md) - Gestión de certificados SSL/TLS
- [nginx-ingress](./nginx/README.md) - Controlador de ingress
- [traefik](./traefik/README.md) - Proxy reverso y balanceador

### CI/CD (4 componentes)
- [GitLab](./gitlab/README.md) - Plataforma Git + CI/CD completa
- [Jenkins](./jenkins/README.md) - Servidor de automatización
- [ArgoCD](./argocd/README.md) - GitOps para Kubernetes
- [GitHub Actions Runner](./github/README.md) - Runner auto-hospedado

### Registros y Artefactos (2 componentes)
- [Harbor](./harbor/README.md) - Registro de contenedores con seguridad
- Nexus - Gestor de repositorio de artefactos

### Seguridad y Análisis (4 componentes)
- [SonarQube](./sonarqube/README.md) - Análisis de calidad y seguridad de código
- [DefectDojo](./defectdojo/README.md) - Plataforma de gestión de vulnerabilidades
- [Dependency Track](./dependency-track/README.md) - Análisis de composición de software
- [OpenAppSec](./appsec/README.md) - Protección de aplicaciones web

### Monitoreo y Observabilidad (3 componentes)
- [Prometheus](./prometheus/README.md) - Sistema de monitoreo y alertas
- [Grafana](./grafana/README.md) - Plataforma de visualización
- [GlitchTip](./glitchtip/README.md) - Seguimiento y gestión de errores

### Bases de Datos (1 componente)
- [MariaDB](./mariadb/README.md) - Base de datos SQL

### Gestión de Aplicaciones (1 componente)
- [Dokploy](./dokploy/README.md) - Plataforma de gestión y despliegue

**Total: 23+ componentes DevSecOps disponibles**

---

## Métodos de Instalación

Para configurar la infraestructura necesaria para llevar a cabo el ciclo completo o solo una parte, se utilizarán contenedores Docker. Se presentan múltiples métodos para configurar estos contenedores:

### 1. OSDO CLI (Automatizado)
- **Automatización completa**: Un solo comando para desplegar
- **23+ componentes disponibles**: Stack completo DevSecOps
- **6 plataformas soportadas**: Kubernetes, K3s, Kind, Docker Compose, Docker Swarm, Helm
- **Presets inteligentes**: Configuraciones predefinidas para desarrollo, staging, producción
- **Modo interactivo**: Selección visual de componentes

### 2. Kubernetes (K8s) Instalacion Manual
- Todos los componentes disponibles (23+)
- Producción enterprise-ready
- Complejidad alta

### 3. K3s Instalacion Manual
- Todos los componentes disponibles (23+)
- Ideal para edge/IoT
- Menor footprint que K8s

### 4. Kind (Kubernetes in Docker) Instalacion Manual
- Todos los componentes disponibles (23+)
- Perfecto para desarrollo local
- Clusters desechables

### 5. Docker Compose Instalacion Manual
- Subconjunto de componentes (12)
- Ideal para desarrollo simple
- Limitado a un solo host

### 6. Docker Swarm Instalacion Manual
- Conjunto básico (8 componentes)
- Orquestación Docker nativa
- Funcionalidades limitadas

---

## Plataformas de Infraestructura
### Docker-compose

Docker-compose es una herramienta que permite definir y ejecutar aplicaciones multi-contenedor con Docker. Utiliza un archivo YAML para configurar los servicios, redes y volúmenes necesarios para cada contenedor de la aplicación.

#### Ventajas de Docker-compose

1. **Simplicidad:** Facilita la gestión de aplicaciones multi-contenedor al definir todos los servicios en un solo archivo YAML.
2. **Entorno de desarrollo aislado:** Permite crear entornos de desarrollo aislados con todas las dependencias necesarias para ejecutar una aplicación.
3. **Despliegue rápido:** Facilita el despliegue ágil de aplicaciones en cualquier entorno compatible con Docker.
4. **Flexibilidad:** Es fácil de configurar y permite la personalización de cada contenedor según las necesidades del proyecto.

#### Inconvenientes de Docker-compose

1. **Limitado a un solo host:** Está diseñado para desplegar aplicaciones en un único host, lo que limita su capacidad para implementaciones más complejas.
2. **Sin escalabilidad automática:** No ofrece herramientas integradas para escalar automáticamente los contenedores en respuesta a la demanda.
3. **Gestión manual:** Requiere gestión manual para operaciones avanzadas, como el balanceo de carga o la alta disponibilidad.
4. **Dependencia de Docker:** Su funcionalidad está ligada a Docker, lo que puede limitar las opciones en entornos donde Docker no sea la opción preferida.

### Kubernetes (K8s)

Kubernetes es una plataforma de código abierto diseñada para automatizar la implementación, el escalado y la gestión de aplicaciones en contenedores. Proporciona un entorno de orquestación de contenedores altamente escalable y flexible.

#### Ventajas de Kubernetes

1. **Escalabilidad automática:** Permite aumentar o disminuir el número de réplicas de un contenedor según la carga de trabajo.
2. **Alta disponibilidad:** Ofrece características para garantizar la alta disponibilidad de las aplicaciones, incluyendo la distribución de cargas de trabajo y la tolerancia a fallos.
3. **Orquestación completa:** Gestiona redes, almacenamiento, monitoreo y balanceo de carga de manera integral.
4. **Multi-cloud y multi-entorno:** Es compatible con entornos multi-nube y multi-entorno, lo que facilita la portabilidad de las aplicaciones entre diferentes proveedores de nube y entornos locales.

#### Inconvenientes de Kubernetes

1. **Curva de aprendizaje:** Requiere tiempo y dedicación para familiarizarse con sus conceptos y arquitectura.
2. **Complejidad:** Puede ser complejo de configurar y mantener, especialmente para aplicaciones que no requieren todas sus funcionalidades.
3. **Infraestructura necesaria:** Demanda una infraestructura adecuada para su implementación, incluyendo servidores y recursos de red.
4. **Consumo de recursos:** Puede requerir una cantidad significativa de recursos de hardware, especialmente en despliegues a gran escala.

### Comparativa entre Docker-compose y Kubernetes

#### Escalabilidad

- **Docker-compose:** Está limitado a un solo host, lo que restringe la escalabilidad automática de los contenedores.
- **Kubernetes:** Permite la escalabilidad automática, ajustando el número de réplicas según la carga de trabajo, lo que resulta adecuado para aplicaciones que requieren alta escalabilidad.

#### Complejidad y curva de aprendizaje

- **Docker-compose:** Es sencillo de aprender y utilizar, facilitando la gestión de aplicaciones multi-contenedor mediante un archivo YAML.
- **Kubernetes:** Presenta una curva de aprendizaje más pronunciada debido a su arquitectura y a la variedad de conceptos involucrados.

### Orquestación y gestión de contenedores

- **Docker-compose:** Ofrece una gestión básica de contenedores y servicios, adecuada para aplicaciones simples o entornos de desarrollo.
- **Kubernetes:** Proporciona una orquestación avanzada, incluyendo gestión de redes, almacenamiento, monitoreo y balanceo de carga, siendo más adecuado para aplicaciones complejas y entornos de producción.

#### Portabilidad y multi-entorno

- **Docker-compose:** Es portátil y puede ejecutarse en cualquier entorno compatible con Docker, aunque limitado a un solo host.
- **Kubernetes:** Facilita la portabilidad entre diferentes proveedores de nube y entornos locales, ofreciendo mayor flexibilidad.

#### Uso de recursos

- **Docker-compose:** Es más ligero en cuanto a consumo de recursos, ya que está orientado a despliegues en un solo host.
- **Kubernetes:** Puede requerir más recursos de hardware debido a su arquitectura distribuida y funcionalidades avanzadas.

En resumen, Docker-compose es adecuado para entornos de desarrollo, pruebas o aplicaciones simples, mientras que Kubernetes es más apropiado para entornos de producción y aplicaciones que requieren escalabilidad, alta disponibilidad y gestión avanzada de contenedores. La elección entre ambos dependerá de los requisitos específicos del proyecto y del nivel de complejidad deseado para la infraestructura.

:::warning
No todas las aplicaciones están disponibles para ambos tipos de infraestructura.

Si una aplicación solo está disponible para una arquitectura, se mostrará un aviso durante su instalación.
:::
