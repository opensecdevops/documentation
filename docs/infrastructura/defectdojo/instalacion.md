# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar DefectDojo es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar DefectDojo en Kubernetes
osdo deploy --platform kubernetes --components defectdojo

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components defectdojo

# Desplegar en K3s
osdo deploy --platform k3s --components defectdojo

# Desplegar con Docker Compose
osdo deploy --platform docker-compose --components defectdojo
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > defectdojo-config.yaml << EOF
platform: kubernetes
namespace: defectdojo
domain: defectdojo.miempresa.com
components:
  - defectdojo
  - cert-manager
  - nginx-ingress
config:
  admin:
    user: admin
    password: secure-password
  storage: 50Gi
EOF

osdo deploy --config defectdojo-config.yaml

# Con preset de seguridad
osdo deploy --preset production --platform kubernetes \
  --components defectdojo --namespace security
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

Para instalar DefectDojo en la plataforma, al igual que con otras herramientas, primero es necesario clonar su repositorio para revisar y ajustar los valores que se utilizarán en el despliegue.

[https://github.com/DefectDojo/django-DefectDojo](https://github.com/DefectDojo/django-DefectDojo)

Clonar el repositorio:

```bash
git clone https://github.com/DefectDojo/django-DefectDojo
```

Acceder al directorio recién clonado:

```bash
cd django-DefectDojo
```

:::warning

Los valores por defecto de los contenedores de DefectDojo pueden ser elevados. Para pruebas o entornos con recursos limitados, se recomienda reducirlos, dejando al menos 4 GB de memoria y 2 CPU.

:::

## Docker-Compose

Crear la red para conectar DefectDojo con Traefik:

```bash
docker network create defectd
```

Modificar el archivo `docker-compose.yml` para conectarlo al balanceador. Para ello, eliminar los puertos expuestos y añadir la red a los contenedores. Dado que DefectDojo puede configurarse de varias formas, eliminar los contenedores innecesarios. En este ejemplo se utiliza MySQL junto con Redis.

Cambiar en el label de Traefik el Host `example.com` por el dominio correspondiente.

```yml
version: '3.8'
services:
  nginx:
    build:
      context: ./
      dockerfile: "Dockerfile.nginx-${DEFECT_DOJO_OS:-debian}"
    image: "defectdojo/defectdojo-nginx:${NGINX_VERSION:-latest}"
    depends_on:
      - uwsgi
    environment:
      NGINX_METRICS_ENABLED: "${NGINX_METRICS_ENABLED:-false}"
    volumes:
      - defectdojo_media:/usr/share/nginx/html/media
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.defectd.rule=Host(`example.com`)"
      - "traefik.http.routers.defectd.entrypoints=websecure"
      - "traefik.http.routers.defectd.tls=true"
      - "traefik.http.routers.defectd.tls.certresolver=le"
      - "traefik.http.services.defectd-service.loadbalancer.server.port=8080"
    networks:
      - defectd
  uwsgi:
    build:
      context: ./
      dockerfile: "Dockerfile.django-${DEFECT_DOJO_OS:-debian}"
      target: django
    image: "defectdojo/defectdojo-django:${DJANGO_VERSION:-latest}"
    depends_on:
      - mysql
    entrypoint: ['/wait-for-it.sh', '${DD_DATABASE_HOST}:${DD_DATABASE_PORT}', '-t', '30', '--', '/entrypoint-uwsgi.sh']
    environment:
      DD_DEBUG: 'False'
      DD_DJANGO_METRICS_ENABLED: "${DD_DJANGO_METRICS_ENABLED:-False}"
      DD_ALLOWED_HOSTS: "${DD_ALLOWED_HOSTS:-*}"
      DD_DATABASE_URL: ${DD_DATABASE_URL}
      DD_CELERY_BROKER_URL: ${DD_CELERY_BROKER_URL}
      DD_SECRET_KEY: "${DD_SECRET_KEY:-hhZCp@D28z!n@NED*yB!ROMt+WzsY*iq}"
      DD_CREDENTIAL_AES_256_KEY: "${DD_CREDENTIAL_AES_256_KEY:-&91a*agLqesc*0DJ+2*bAbsUZfR*4nLw}"
    volumes:
        - type: bind
          source: ./docker/extra_settings
          target: /app/docker/extra_settings
        - "defectdojo_media:${DD_MEDIA_ROOT:-/app/media}"
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
  celerybeat:
    image: "defectdojo/defectdojo-django:${DJANGO_VERSION:-latest}"
    depends_on:
      - mysql
      - redis
    entrypoint: ['/wait-for-it.sh', '${DD_DATABASE_HOST}:${DD_DATABASE_PORT}', '-t', '30', '--', '/entrypoint-celery-beat.sh']
    environment:
      DD_DATABASE_URL: ${DD_DATABASE_URL}
      DD_CELERY_BROKER_URL: ${DD_CELERY_BROKER_URL}
      DD_SECRET_KEY: "${DD_SECRET_KEY:-hhZCp@D28z!n@NED*yB!ROMt+WzsY*iq}"
      DD_CREDENTIAL_AES_256_KEY: "${DD_CREDENTIAL_AES_256_KEY:-&91a*agLqesc*0DJ+2*bAbsUZfR*4nLw}"
    volumes:
        - type: bind
          source: ./docker/extra_settings
          target: /app/docker/extra_settings
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
  celeryworker:
    image: "defectdojo/defectdojo-django:${DJANGO_VERSION:-latest}"
    depends_on:
      - mysql
      - redis
    entrypoint: ['/wait-for-it.sh', '${DD_DATABASE_HOST}:${DD_DATABASE_PORT}', '-t', '30', '--', '/entrypoint-celery-worker.sh']
    environment:
      DD_DATABASE_URL: ${DD_DATABASE_URL}
      DD_CELERY_BROKER_URL: ${DD_CELERY_BROKER_URL}
      DD_SECRET_KEY: "${DD_SECRET_KEY:-hhZCp@D28z!n@NED*yB!ROMt+WzsY*iq}"
      DD_CREDENTIAL_AES_256_KEY: "${DD_CREDENTIAL_AES_256_KEY:-&91a*agLqesc*0DJ+2*bAbsUZfR*4nLw}"
    volumes:
      - type: bind
        source: ./docker/extra_settings
        target: /app/docker/extra_settings
      - "defectdojo_media:${DD_MEDIA_ROOT:-/app/media}"
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
  initializer:
    image: "defectdojo/defectdojo-django:${DJANGO_VERSION:-latest}"
    depends_on:
      - mysql
    entrypoint: ['/wait-for-it.sh', '${DD_DATABASE_HOST}:${DD_DATABASE_PORT}', '--', '/entrypoint-initializer.sh']
    environment:
      DD_DATABASE_URL: ${DD_DATABASE_URL}
      DD_ADMIN_USER: "${DD_ADMIN_USER:-admin}"
      DD_ADMIN_MAIL: "${DD_ADMIN_USER:-admin@defectdojo.local}"
      DD_ADMIN_FIRST_NAME: "${DD_ADMIN_FIRST_NAME:-Admin}"
      DD_ADMIN_LAST_NAME: "${DD_ADMIN_LAST_NAME:-User}"
      DD_INITIALIZE: "${DD_INITIALIZE:-true}"
      DD_SECRET_KEY: "${DD_SECRET_KEY:-hhZCp@D28z!n@NED*yB!ROMt+WzsY*iq}"
      DD_CREDENTIAL_AES_256_KEY: "${DD_CREDENTIAL_AES_256_KEY:-&91a*agLqesc*0DJ+2*bAbsUZfR*4nLw}"
    volumes:
        - type: bind
          source: ./docker/extra_settings
          target: /app/docker/extra_settings
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
  mysql:
    image: mysql:5.7.44@sha256:4bc6bc963e6d8443453676cae56536f4b8156d78bae03c0145cbe47c2aad73bb
    environment:
      MYSQL_RANDOM_ROOT_PASSWORD: 'yes'
      MYSQL_DATABASE: ${DD_DATABASE_NAME}
      MYSQL_USER: ${DD_DATABASE_USER}
      MYSQL_PASSWORD: ${DD_DATABASE_PASSWORD}
    command: ['mysqld', '--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci']
    volumes:
      - defectdojo_data:/var/lib/mysql
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
  redis:
    image: redis:7.2.4-alpine@sha256:1b503bb77079ba644371969e06e1a6a1670bb34c2251107c0fc3a21ef9fdaeca
    volumes:
      - defectdojo_redis:/data
    networks:
      - defectd
    labels:
      - "traefik.enable=false"
volumes:
  defectdojo_data: {}
  defectdojo_media: {}
  defectdojo_redis: {}

networks:
  defectd:
    external: true
```

:::tip
Antes de iniciar los servicios, asegúrate de añadir la red en Traefik.
:::

Copiar las variables de entorno de mysql-redis a la carpeta raíz:

```bash
cp docker/environments/mysql-redis.env .env
```

Iniciar los contenedores. Este proceso puede tardar, ya que no hay imágenes oficiales disponibles en Docker Hub y se construyen a partir del código clonado.

```bash
docker-compose up -d
```

Para obtener la contraseña de administrador:

```bash
docker compose logs initializer | grep "Admin password:"
```

Si en algún momento se olvida la contraseña, se puede crear un nuevo superusuario:

```bash
docker compose exec uwsgi /bin/bash -c 'python manage.py createsuperuser'
```

## Kubernetes

Modificar el archivo `values.yaml` con los siguientes parámetros:

```yaml
# Crear secret específico para defectdojo
createSecret: true
# Crear secret de rabbitmq en defectdojo chart, fuera del chart de rabbitmq
createRabbitMqSecret: true
# Crear secret de postgresql en defectdojo chart, fuera del chart de postgresql
createPostgresqlSecret: true
# Host principal de la instancia
host: defectd.yourdomain.com

# URL completa de la instancia de defectdojo, depende del dominio donde se despliegue DD, también afecta a los enlaces en Jira
site_url: 'http://defectd.yourdomain.com'

# Usuario y contraseña de administración
admin:
  user: admin
  password: 123456

django:
  annotations: {}
  service:
    annotations: {}
  affinity: {}
  ingress:
    enabled: true
    ingressClassName: "appsec-nginx"
    activateTLS: true
    secretName: "SECRET_CERT"
    annotations:
      # Restringe el tipo de controlador de ingress que puede interactuar con el chart (nginx, traefik, ...)
      # kubernetes.io/ingress.class: nginx
      # Dependiendo del tamaño y complejidad de los análisis, puede ser necesario aumentar los timeouts por defecto si se observan errores 504 Gateway Timeout
      nginx.ingress.kubernetes.io/proxy-read-timeout: "1200s"
      nginx.ingress.kubernetes.io/proxy-send-timeout: "1200s"
      nginx.ingress.kubernetes.io/proxy-body-size: 200m
      nginx.ingress.kubernetes.io/proxy-connect-timeout: "1200s"
```

Los valores de **nginx.ingress** deben ajustarse para tolerar cargas mayores al subir o descargar reportes.

:::warning
En DefectDojo, al no existir un chart oficial de Helm, la instalación debe realizarse de la siguiente manera:
:::

```bash
helm upgrade --install defect-dojo helm/defectdojo -f helm/defectdojo/values.yaml -n defect-dojo --create-namespace
```

Detalles del comando anterior:

1. El contenido de Helm de DefectDojo está en 'helm/defectdojo'.
2. Se utiliza 'helm upgrade --install' para instalar si no existe o actualizar si ya está instalado.
3. Se usa '--create-namespace' para crear el namespace en Kubernetes si no existe.
4. Se usa '-n defect-dojo' para indicar el namespace donde se instalará la aplicación.

Una vez instalado DefectDojo, se puede extraer la contraseña inicial para conectarse:

```bash
echo "DefectDojo admin password: $(kubectl \
      get secret defectdojo \
      --namespace=defectd \
      --output jsonpath='{.data.DD_ADMIN_PASSWORD}' \
      | base64 --decode)"
```
