# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar Dependency Track es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar Dependency Track en Kubernetes
osdo deploy --platform kubernetes --components dependency-track

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components dependency-track

# Desplegar en K3s
osdo deploy --platform k3s --components dependency-track

# Desplegar con Docker Compose
osdo deploy --platform docker-compose --components dependency-track
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > dependency-track-config.yaml << EOF
platform: kubernetes
namespace: dependency-track
domain: dtrack.miempresa.com
components:
  - dependency-track
  - cert-manager
  - nginx-ingress
config:
  database:
    storage: 20Gi
  apiserver:
    replicas: 2
EOF

osdo deploy --config dependency-track-config.yaml

# Con preset predefinido
osdo deploy --preset production --platform kubernetes \
  --components dependency-track --namespace security
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::
## Instalacion Manual

## Docker-Compose

Dependency-Track dispone de imágenes de Docker ya preparadas, por lo que solo es necesario realizar algunas configuraciones básicas.

Crea un archivo .env en la raíz del proyecto con el siguiente contenido, adaptando los valores a tus necesidades:

```env title=".env" showLineNumbers
USERDB=dtrackOSDO
PASSWORDDB=dtrackPassword
DTRACKDB=dtrack
```

Crear la red para conectar Dependency-Track con Traefik:

```bash
docker network create dtrack
```

A continuación, crea el archivo `docker-compose.yml` que define los servicios necesarios:

- Base de datos PostgreSQL
- API
- Frontal

La base de datos es opcional para pruebas, ya que la propia API puede utilizar una base de datos interna si se eliminan las líneas de configuración `ALPINE_DATABASE`.

Es necesario cambiar en el label de Traefik el Host `example.com` por el dominio correspondiente.

```yaml title="docker-compose.yml" showLineNumbers
services:
  dtrack-postgres:
    image: postgres@sha256:f1314058032e52cce689f2daf3fffe7c136775e3fdd1af3fb36ae5cdc61c7891
    container_name: dtrack-postgres
    environment:
      - POSTGRES_USER=${USERDB}
      - POSTGRES_PASSWORD=${PASSWORDDB}
      - POSTGRES_DB=${DTRACKDB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - dtrack
    labels:
      - "traefik.enable=false"

  dtrack-apiserver:
    image: dependencytrack/apiserver@sha256:bffd457f60dd4aed9a005d20b2a42b7307930518c2a081d1c28baa2c319f391d
    container_name: dtrack-api
    environment:
      - ALPINE_DATABASE_MODE=external
      - ALPINE_DATABASE_URL=jdbc:postgresql://dtrack-postgres:5432/${DTRACKDB}
      - ALPINE_DATABASE_DRIVER=org.postgresql.Driver
      - ALPINE_DATABASE_USERNAME=${USERDB}
      - ALPINE_DATABASE_PASSWORD=${PASSWORDDB}
    deploy:
      resources:
        limits:
          memory: 12288m
        reservations:
          memory: 8192m
      restart_policy:
        condition: on-failure
    volumes:
      - 'dependency-track:/data'
    restart: unless-stopped
    depends_on:
      - dtrack-postgres
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dtrackapi.rule=Host(`dtrack-api.example.com`)"
      - "traefik.http.routers.dtrackapi.entrypoints=websecure"
      - "traefik.http.routers.dtrackapi.tls=true"
      - "traefik.http.routers.dtrackapi.tls.certresolver=le"
    networks:
      - dtrack

  dtrack-frontend:
    image: dependencytrack/frontend@sha256:63d6a6cc9f4cab15a056d4ec1ba9f8a87203415e8f1f73741fadee7f93bc191e
    container_name: dtrack
    depends_on:
      - dtrack-apiserver
    environment:
      - API_BASE_URL=https://dtrack-api.example.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dtrack.rule=Host(`dtrack.example.com`)"
      - "traefik.http.routers.dtrack.entrypoints=websecure"
      - "traefik.http.routers.dtrack.tls=true"
      - "traefik.http.routers.dtrack.tls.certresolver=le"
    restart: unless-stopped
    networks:
      - dtrack

networks:
  dtrack:
    external: true

volumes:
  postgres_data:
  dependency-track:
```

:::tip
Antes de iniciar los servicios, asegúrate de añadir la red en Traefik.

Se recomienda disponer de al menos 4 GB de RAM en el host para que el contenedor funcione correctamente.
:::

Iniciar los contenedores:

```bash
docker-compose up -d
```

## Kubernetes

Para instalar Dependency-Track en la plataforma, primero es necesario clonar su repositorio para revisar los valores que se utilizarán en el despliegue.

[https://github.com/DependencyTrack/dependency-track](https://github.com/DependencyTrack/dependency-track)

Clonar el repositorio:

```bash
git clone https://github.com/DependencyTrack/dependency-track
```

Esto permite ubicar el chart de Helm y validar las configuraciones necesarias. Luego, agregar el repositorio de Helm:

```bash
helm repo add evryfs-oss https://evryfs.github.io/helm-charts/
```

Existen dos opciones: copiar y modificar el archivo `values.yaml` disponible en la [ruta oficial](https://github.com/evryfs/helm-charts/tree/master/charts/dependency-track) o crear uno nuevo. Si se clona el repositorio, acceder al directorio correspondiente:

```bash
cd charts/dependency-track/
```

En el archivo `values.yaml` se deben definir los siguientes parámetros:

```yaml title="values.yaml" showLineNumbers
frontend:
  enabled: true
  annotations: {}
  replicaCount: 2
  image:
    repository: dependencytrack/frontend
    tag: 4.6.1
    pullPolicy: IfNotPresent
  env:
    - name: API_BASE_URL
      value: "https://dtrack.yourdomain.com"
ingress:
  enabled: true
  tls:
    enabled: true
    secretName: "osdo-certs"
  annotations: {}
  host: dtrack.opensecdevops.com
  ingressClassName: appsec-nginx
```

Instalar con Helm:

```bash
helm upgrade --install dependency-track evryfs-oss/dependency-track -f values.yaml -n dependency-track --create-namespace
```

Detalles del comando anterior:

- `--install`: Instala la aplicación si no está instalada.
- `--create-namespace`: Crea el namespace si no existe.
- `-f values.yaml`: Especifica el archivo de configuración personalizado.
- `-n dependency-track`: Indica el namespace donde se instalará la aplicación.
