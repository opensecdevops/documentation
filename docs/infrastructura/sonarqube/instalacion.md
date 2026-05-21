---
title: Instalación
description: "Guía para la instalación de Sonarqube, incluyendo configuraciones para Docker Compose y Kubernetes."
slug: instalacion-sonarqube
---

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar SonarQube es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar SonarQube en Kubernetes
osdo deploy --platform kubernetes --components sonarqube

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components sonarqube

# Desplegar en K3s
osdo deploy --platform k3s --components sonarqube

# Desplegar con Docker Compose (desarrollo)
osdo deploy --platform docker-compose --components sonarqube
```

### Presets Predefinidos

```bash
# Stack de desarrollo con SonarQube incluido
osdo deploy --preset development --platform kind --kind-cluster dev

# Stack de staging con herramientas de seguridad
osdo deploy --preset staging --platform k3s --domain staging.miempresa.com

# Stack completo de producción
osdo deploy --preset production --platform kubernetes
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::
## Instalacion Manual

## Docker Compose

Sonarqube se puede desplegar fácilmente utilizando Docker Compose. A continuación se muestra un ejemplo de archivo `docker-compose.yml` que puedes utilizar:

Crea un archivo .env en la raíz del proyecto con el siguiente contenido, adaptando los valores a tus necesidades:

```env title=".env" showLineNumbers
POSTGRES_USER=sonarqube
POSTGRES_PASSWORD=sonarqube
POSTGRES_DB=sonarqube
POSTGRES_HOST=postgresql

SONAR_JDBC_URL=jdbc:postgresql://postgresql:5432/sonarqube
SONAR_JDBC_USERNAME=sonarqube
SONAR_JDBC_PASSWORD=sonarqube
```

Crear la red para conectar Dependency-Track con Traefik:

```bash
docker network create dtrack
```

A continuación, crea el archivo `docker-compose.yml` que define los servicios necesarios:

```yaml title="docker-compose.yml" showLineNumbers
services:
  postgresql:
    image: postgres:15
    container_name: sonarqube_postgresql
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ./postgresql/data:/var/lib/postgresql/data
    networks:
      - sonarqube_network
    restart: unless-stopped

  sonarqube:
    image: sonarqube:25.5.0.107428-community
    container_name: sonarqube
    depends_on:
      - postgresql
    environment:
      SONAR_JDBC_URL: ${SONAR_JDBC_URL}
      SONAR_JDBC_USERNAME: ${SONAR_JDBC_USERNAME}
      SONAR_JDBC_PASSWORD: ${SONAR_JDBC_PASSWORD}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.sonar.rule=Host(`sonar.opensecdevops.com`)"
      - "traefik.http.routers.sonar.entrypoints=websecure"
      - "traefik.http.routers.sonar.tls=true"
      - "traefik.http.routers.sonar.tls.certresolver=le"
      - "traefik.http.services.sonar.loadbalancer.server.port=9000"
    volumes:
      - ./sonarqube/data:/opt/sonarqube/data
      - ./sonarqube/logs:/opt/sonarqube/logs
      - ./sonarqube/extensions:/opt/sonarqube/extensions
    networks:
      - sonarqube_network
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
    restart: unless-stopped

networks:
  sonarqube_network:
    external: true
```

Iniciar los contenedores:

```bash
docker-compose up -d
```

## Kubernetes

Para proceder a la instalacion de Sonarqube en nuestra plataforma como con otras herramientas primero necesitamos clonar el repositorio del mismo, para asi poder ver los valores que deseamos utilizar en nuestro despliegue.

## Repo

[https://github.com/SonarSource/helm-chart-sonarqube.git](https://github.com/SonarSource/helm-chart-sonarqube.git)

Agregamos el repositorio de helm y actualizamos

```bash
helm repo add sonarqube https://SonarSource.github.io/helm-chart-sonarqube
helm repo update
```

Podemos clonarnos el git mencianado anteriormente y copoar el values.yaml que se encuentra en la siguiente ruta.

```bash
cd helm-chart-sonarqube/charts/sonarqube/
```

Y procederemos a copiar o modificar el values.yaml.
En el values.yaml debemos tener los siguientes parametros.

```yaml title="values.yaml" showLineNumbers
ingress:
    enabled: true
    hosts:
      - name: sonar.opensecdevops.com
        path: "/"
    # This property allows for reports up to a certain size to be uploaded to SonarQube
    annotations:
      kubernetes.io/ingress.class: appsec-nginx
      nginx.ingress.kubernetes.io/proxy-body-size: "64m"
  # Set the ingressClassName on the ingress record
    ingressClassName: appsec-nginx
    tls: 
  # Secrets must be manually created in the namespace. To generate a self-signed certificate (and private key) and then create the secret in the cluster please refer to official documentation available at https://kubernetes.github.io/ingress-nginx/user-guide/tls/#tls-secrets
    - secretName: SECRET_CERT
  #   hosts:
  #     - chart-example.local
prometheusExporter:
  enabled: false
  config:
    rules:
      - pattern: ".*"
postgresql:
  # Enable to deploy the bitnami PostgreSQL chart
  enabled: true
  persistence:
    enabled: true
    accessMode: ReadWriteOnce
    size: 10Gi
```

procedemos a la instalación con el helm

## Helm

```bash
helm upgrade --install -n sonar sonarqube -f values.yaml sonarqube/sonarqube --create-namespace
```

Detalles del comando anterior:

- `--install`: Instala si no existe, actualiza si ya está instalado.
- `--create-namespace`: Crea el namespace si no existe.
- `-f values.yaml`: Especifica el archivo de configuración personalizado.
- `-n sonar`: Indica el namespace de despliegue.
