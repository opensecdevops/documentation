# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar Traefik es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar Traefik en Docker Compose
osdo deploy --platform docker-compose --components traefik

# Desplegar en Docker Swarm
osdo deploy --platform docker-swarm --components traefik

# Desplegar en Kubernetes
osdo deploy --platform kubernetes --components traefik

# Desplegar en K3s
osdo deploy --platform k3s --components traefik
```



### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > traefik-config.yaml << EOF
platform: docker-compose
components:
  - traefik
  - prometheus
  - grafana
config:
  traefik:
    email: admin@miempresa.com
    letsencrypt: true
    dashboard: true
EOF

osdo deploy --config traefik-config.yaml
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

:::warning
Lo usaremos si desplegamos la infrascturcutra con **Docker compose**

En **Kubernetes (k8s)** se usa [cert-manager](../certmanager/README.md)
:::

Vamos a usar traefik para que nos genere y gesione certificados con [Let's Encrypt](https://letsencrypt.org/es/) para que esto funcione lo primero que tenemos que crear el el fichero `acme.json`

```bash
touch acme.json
chmod 600 acme.json
```

Creamos la red principal de traefik

```bash
docker network create web
```

Traefik se configura mediante una estructura de archivos TOML o mediante etiquetas en los contenedores que lo necesitan. Nosotros vamos a usar las etiquetas porque esto nos ahorra mantener más archivos disgregados en nuestro sistema.

A continación vamos a ver las configuraciónes que aplicamos a nuestro balanceador.

- **--entrypoints.web.address=:80** Define un punto de entrada llamado "web" que escucha en el puerto 80 del contenedor.
- **--entrypoints.websecure.address=:443** Define un punto de entrada llamado "websecure" que escucha en el puerto 443 del contenedor (utilizado para conexiones HTTPS).
- **--providers.docker** Habilita el proveedor de Docker para que Traefik detecte automáticamente los contenedores que se ejecutan en su sistema Docker.
- **--providers.docker.exposedByDefault=false** Indica a Traefik que no exponga automáticamente los puertos de los contenedores descubiertos a través de Docker.
- **--api** Habilita la API web de Traefik para la administración y monitoreo.
- **`--certificatesresolvers.le.acme.email=info@example.com`** Define la dirección de correo electrónico utilizada para obtener certificados SSL gratuitos de Let's Encrypt.
- **--certificatesresolvers.le.acme.storage=./acme.json** Especifica la ubicación del archivo que almacena los certificados emitidos por Let's Encrypt.
- **--certificatesresolvers.le.acme.tlschallenge=true** Habilita el desafío HTTP para la validación de dominio de Let's Encrypt.
- **--log.level=DEBUG** Establece el nivel de registro de Traefik en DEBUG para proporcionar información detallada en los logs.
- **traefik.http.routers.traefik.rule=Host(\`dashboard.example.com\`)** Esta etiqueta define una ruta para el dashboard de administración de Traefik. Solo el tráfico proveniente del host `dashboard.example.com` accederá al dashboard.
- **traefik.http.routers.traefik.service=api@internal** Esta etiqueta especifica el servicio interno (definido como api) al que se dirigirá el tráfico del dashboard. @internal indica que el servicio se ejecuta dentro del mismo swarm o red interna.
- **traefik.http.routers.traefik.tls=true** Esta etiqueta habilita el cifrado SSL/TLS para el acceso al dashboard.
- **traefik.http.routers.traefik.tls.certresolver=le** Esta etiqueta indica a Traefik que use el solucionador de certificados Let's Encrypt para obtener el certificado SSL/TLS del dashboard.
- **traefik.http.routers.traefik.entrypoints=websecure** Esta etiqueta especifica que el tráfico del dashboard debe usar el punto de entrada websecure definido en el comando --entrypoints.websecure.address=:443 (puerto 443).
- **traefik.http.routers.traefik.middlewares=authtraefik** Esta etiqueta indica que el tráfico del dashboard debe pasar por el middleware authtraefik que esta configurado para requerir autenticación básica.
- **traefik.http.middlewares.authtraefik.basicauth.users=admin:$$2y$$10$$86tihy4eRLWLTExtMBEzKOHdh0hv8SbtaZVg3RwobqBGnK9WToa9q** Esta etiqueta define las credenciales de autenticación básica para acceder al dashboard. Para crear el usuario y la contraseña usaremos htpasswd de la siguiente manera htpasswd -nBC 10 admin
- **traefik.http.routers.http-catchall.rule=hostregexp(\`\{host:.+\}\`)** Esta etiqueta define una ruta catch-all que coincide con cualquier host.
- **traefik.http.routers.http-catchall.entrypoints=web** Esta etiqueta indica que el tráfico catch-all debe usar el punto de entrada web definido en el comando --entrypoints.web.address=:80 (puerto 80).
- **traefik.http.routers.http-catchall.middlewares=redirect-to-https** Esta etiqueta indica que el tráfico catch-all debe pasar por el middleware redirect-to-https que esta configurado para redirigir el tráfico HTTP al equivalente HTTPS.
- **traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https** Esta etiqueta define el esquema de redirección para el middleware redirect-to-https, en este caso, redirigirá a HTTPS.

```yml title="docker-compose.yml"
services:
  traefik:
    image: traefik@sha256:00cefa1183ba9d8972b24cca4f53f52cad38599ac01f225d11da004ac907c2db
    container_name: traefik
    hostname: traefik
    command:
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker
      - --providers.docker.exposedByDefault=false
      - --api
      - --certificatesresolvers.le.acme.email=info@example.com
      - --certificatesresolvers.le.acme.storage=./acme.json
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --log.level=INFO
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./acme.json:/acme.json"
    labels:
      - "traefik.enable=true"
      # Dashboard
      - "traefik.http.routers.traefik.rule=Host(`dashboard.example.com`)"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.routers.traefik.tls=true"
      - "traefik.http.routers.traefik.tls.certresolver=le"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.middlewares=authtraefik"
      - "traefik.http.middlewares.authtraefik.basicauth.users=admin:$$2y$$10$$86tihy4eRLWLTExtMBEzKOHdh0hv8SbtaZVg3RwobqBGnK9WToa9q" #admin:demo_
        # global redirect to https
      - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
      - "traefik.http.routers.http-catchall.entrypoints=web"
      - "traefik.http.routers.http-catchall.middlewares=redirect-to-https"
      # middleware redirect
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"
    restart: unless-stopped
    networks:
      - web

networks:
  web:
    external: true
```

Arrancamos los contenedores.

```bash
docker-compose up -d
```

Los contenedores que queramos hacer salir mediante traefik tenemos que agregar los siguientes labels en dichos contendores.

- **traefik.enable=true** Esta etiqueta habilita Traefik en el contenedor, permitiendo que Traefik lo gestione y configure su enrutamiento y balanceo de carga.
- **traefik.http.routers.container.rule=Host(container.example.com)** Esta etiqueta define una regla de enrutamiento para el tráfico dirigido al dominio container.example.com. Esta regla indica a Traefik que debe enrutar el tráfico a este contenedor cuando la solicitud se dirija a ese nombre de dominio específico.
- **traefik.http.routers.container.entrypoints=websecure** Esta etiqueta especifica que el tráfico del contenedor debe usar el punto de entrada websecure. Esto indica que el tráfico solo se aceptará a través de conexiones HTTPS seguras.
- **traefik.http.routers.container.tls=true** Esta etiqueta habilita el cifrado TLS/SSL para el tráfico del contenedor, garantizando la seguridad de las comunicaciones.
- **traefik.http.routers.container.tls.certresolver=le** Esta etiqueta indica a Traefik que utilice Let's Encrypt para obtener los certificados TLS/SSL necesarios para el cifrado del contenedor, automatizando la gestión de certificados.
- **traefik.http.services.container-service.loadbalancer.server.port=XXXX** Esta etiqueta define el puerto interno del contenedor al que Traefik debe redirigir el tráfico. En este caso, el contenedor está escuchando en un puerto que no sea el 80.

:::note
Recordar agregar al fichero `docker-compose.yml` de trafik las redes creadas en los contenedores que se quieran conectar.

```yml title="docker-compose.yml" showLineNumbers="true"
    networks:
      - web
      - extra

networks:
  web:
    external: true
  extra:
    extenral: true
```

:::
