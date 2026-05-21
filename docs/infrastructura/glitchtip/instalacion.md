# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar GlitchTip es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar GlitchTip en Kubernetes
osdo deploy --platform kubernetes --components glitchtip

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components glitchtip

# Desplegar en K3s
osdo deploy --platform k3s --components glitchtip

# Desplegar con Docker Compose
osdo deploy --platform docker-compose --components glitchtip
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > glitchtip-config.yaml << EOF
platform: kubernetes
namespace: glitchtip
domain: glitchtip.miempresa.com
components:
  - glitchtip
  - cert-manager
  - nginx-ingress
config:
  glitchtip:
    email: admin@miempresa.com
    registration: false
    database_storage: 20Gi
EOF

osdo deploy --config glitchtip-config.yaml
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::
## Instalación Manual

## Docker-Compose

Glitchtip dispone de imágenes de Docker ya preparadas, por lo que solo es necesario realizar algunas configuraciones básicas. El primer paso es crear un archivo `.env` con los datos de configuración de la base de datos.

```env
POSTGRES_DB=glitchtip
POSTGRES_USER=glitchtipOSDO
POSTGRES_PASS=glitchtipPASS
SECRET_KEY=change_mi_random_key # best to run openssl rand -hex 32
DOMAIN=glitchtip.example.com # Change this to your domain
DEFAULT_FROM_EMAIL=email@example.com # Change this to your email
EMAIL_URL=smtp://email:password@smtp_url:port # Example smtp://email:password@smtp_url:port https://glitchtip.com/documentation/install#configuration
ENABLE_USER_REGISTRATION=true # Set to false if you want to disable user registration
```

Crear la red para conectar Glitchtip con Traefik:

```bash
docker network create glitchtip
```

Generar el `SECRET_KEY` necesario para la aplicación y sustituirlo en las variables de entorno del `docker-compose.yml`:

```bash
openssl rand -hex 32
```

Es necesario cambiar en el label de Traefik el Host y la variable `GLITCHTIP_DOMAIN` de `example.com` por el dominio correspondiente.

:::warning
En la configuración actual el sistema **no** envía correos electrónicos.

Para habilitar el envío de correos, es necesario [configurar](https://glitchtip.com/documentation/install#configuration) un servidor SMTP, [Mailgun](https://www.mailgun.com/) o [SendGrid](https://sendgrid.com/).
:::

```yaml title="docker-compose.yml" showLineNumbers
x-environment: &default-environment
  DATABASE_URL: postgres://${USERDB:-dtrackOSDO}:${PASSWORDDB:-dtrackPassword}@postgres:${PORTDB:-5432}/${DTRACKDB:-dtrack}
  SECRET_KEY: ${SECRET_KEY:-change_mi_random_key} # best to run openssl rand -hex 32
  PORT: 8000 # If changing, change the web service port too
  EMAIL_URL: ${EMAIL_URL:-consolemail://} # Example smtp://email:password@smtp_url:port https://glitchtip.com/documentation/install#configuration
  GLITCHTIP_DOMAIN: ${DOMAIN:-https://glitchtip.example.com} # Change this to your domain
  DEFAULT_FROM_EMAIL: ${FROM_EMAIL:-email@example.com} # Change this to your email
  CELERY_WORKER_AUTOSCALE: "1,3" # Scale between 1 and 3 to prevent excessive memory usage. Change it or remove to set it to the number of cpu cores.

x-depends_on: &default-depends_on
  - postgres
  - redis

services:
  postgres:
    image: postgres:17
    environment:
      environment:
      - POSTGRES_USER=${USERDB:-dtrackOSDO}
      - POSTGRES_PASSWORD=${PASSWORDDB:-dtrackPassword}
      - POSTGRES_DB=${DTRACKDB:-dtrack}
    restart: unless-stopped
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - glitchtip
  redis:
    image: valkey/valkey
    restart: unless-stopped
    networks:
        - glitchtip
  web:
    image: glitchtip/glitchtip
    depends_on: *default-depends_on
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.glitchtip.rule=Host(`glitchtip.example.com`)"
      - "traefik.http.routers.glitchtip.entrypoints=websecure"
      - "traefik.http.routers.glitchtip.tls=true"
      - "traefik.http.routers.glitchtip.tls.certresolver=le"
      - "traefik.http.services.glitchtip-service.loadbalancer.server.port=8000"
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads
    networks:
      - glitchtip
  worker:
    image: glitchtip/glitchtip
    command: ./bin/run-celery-with-beat.sh
    depends_on: *default-depends_on
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads
    networks:
      - glitchtip
  migrate:
    image: glitchtip/glitchtip
    depends_on: *default-depends_on
    command: ./bin/run-migrate.sh
    environment: *default-environment
    networks:
      - glitchtip

networks:
  glitchtip:
    external: true

volumes:
  pg-data:
  uploads:
```

:::tip
Antes de iniciar los servicios, asegúrate de añadir la red en Traefik.
:::

Iniciar los contenedores:

```bash
docker-compose up -d
```

## Registro de usuarios

Una vez que los contenedores estén en funcionamiento, accede a la interfaz web de Glitchtip a través de tu navegador en `https://glitchtip.example.com`. Si has puesto `ENABLE_USER_REGISTRATION` a `true` cualquier usuario podrá registrarse. Si lo has puesto a `false`, solo podras registrar desde el login al primer usuario, los siguientes tendran que ser desde la interfaz de administración.

![Glitchtip registro](/img/glitchtip/register.png)
