---
title: Instalación
description: Instalación de Jenkins
---

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar Jenkins es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar Jenkins en Kubernetes
osdo deploy --platform kubernetes --components jenkins

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components jenkins

# Desplegar en K3s
osdo deploy --platform k3s --components jenkins

# Desplegar con Docker Compose
osdo deploy --platform docker-compose --components jenkins

# Desplegar con Docker Swarm
osdo deploy --platform docker-swarm --components jenkins
```

### Stack Completo de CI/CD

```bash
# Desplegar Jenkins junto con herramientas de CI/CD
osdo deploy --platform kubernetes \
  --components jenkins,gitlab,harbor,sonarqube \
  --namespace ci-cd \
  --domain ci.miempresa.com

# Verificar el estado del despliegue
osdo status --platform kubernetes --namespace ci-cd

# Modo interactivo
osdo deploy --interactive --platform kubernetes
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > jenkins-config.yaml << EOF
platform: kubernetes
namespace: jenkins
domain: jenkins.miempresa.com
components:
  - jenkins
  - cert-manager
  - nginx-ingress
  - harbor
config:
  jenkins:
    agents: 3
    storage: 50Gi
  registry: registry.miempresa.com
EOF

osdo deploy --config jenkins-config.yaml

# Con preset predefinido para CI/CD
osdo deploy --preset production --platform kubernetes \
  --components jenkins,gitlab,harbor --namespace ci-cd
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::
## instalaicion manual

## docker compose

En esta sección veremos cómo desplegar un **Jenkins Master**, un **Jenkins Agent** conectado por SSH y un servicio **Docker-in-Docker** (DinD) usando `docker-compose`. La estructura usa un script `setup.sh` para generar las claves SSH del agente, un `Dockerfile-agent` para preparar el contenedor del agente y un `docker-compose.yml` que orquesta los tres servicios.

### Estructura de carpetas y ficheros

Dentro de tu proyecto crea la siguiente jerarquía:

```md
 ├── Dockerfiles/
 │└── Dockerfile-agent
 ├── docker-certs/
 ├── workspace/ 
 ├── jenkins_agent_keys/ 
 ├── docker-compose.yml
 └── setup.sh
```

- **Dockerfiles/Dockerfile-agent**  
  Dockerfile que prepara la imagen del Jenkins Agent con SSH y cliente Docker.

- **workspace/**  
  Carpeta local que se montará como workspace compartido entre agent y DinD.

- **jenkins_agent_keys/**  
  Directorio donde `setup.sh` generará los ficheros para comunicar Jenkins con el Jenkins agents

- **docker-certs/**  
  Directorio donde `setup.sh` generará los certificados ssl para proteger las comunicaciones con el DinD

- **docker-compose.yml**  
  Orquestación de los 3 contenedores: `jenkins-master`, `jenkins-agent` y `docker-dind`.

- **setup.sh**  
  Script Bash para crear y configurar las claves SSH del agente y generar los certificados TLS necesarios para la comunicación segura entre el runner y el servicio Docker-in-Docker (DinD).

### setup.sh

Este script realiza las siguientes tareas:

- Genera un par de claves RSA de 4096 bits para el agente y copia la clave pública a authorized_keys.
- Crea la autoridad de certificación (CA) y genera los certificados TLS para DinD y para el Jenkins Agent.

```bash title="setup.sh" showLineNumbers
#!/bin/bash
# Exit script on error
set -e

echo "Preparing environment for Jenkins deployment..."

# --- 1) SSH keys for Jenkins Agent ---

# Define SSH keys directory
JENKINS_AGENT_KEYS_DIR="./jenkins_agent_keys"

echo "Creating SSH keys directory for Jenkins Agent..."
mkdir -p "$JENKINS_AGENT_KEYS_DIR"

echo "Generating SSH keys for Jenkins Agent..."
if [ ! -f "$JENKINS_AGENT_KEYS_DIR/id_rsa" ]; then
  ssh-keygen -t rsa -b 4096 -f "$JENKINS_AGENT_KEYS_DIR/id_rsa" -N ""
  chmod 600 "$JENKINS_AGENT_KEYS_DIR/id_rsa"
  chmod 644 "$JENKINS_AGENT_KEYS_DIR/id_rsa.pub"
else
  echo "SSH keys already exist. Skipping key generation."
fi

echo "Configuring authorized_keys for Jenkins Agent..."
cp "$JENKINS_AGENT_KEYS_DIR/id_rsa.pub" "$JENKINS_AGENT_KEYS_DIR/authorized_keys"
chmod 644 "$JENKINS_AGENT_KEYS_DIR/authorized_keys"

chmod -R 700 "$JENKINS_AGENT_KEYS_DIR"

# --- 2) TLS certificates for Docker-in-Docker and Jenkins Agent ---

# Base directory for certs
CERT_DIR="./docker-certs"
CA_DIR="$CERT_DIR/ca"
SERVER_DIR="$CERT_DIR/server"
CLIENT_DIR="$CERT_DIR/client"

echo "Creating directory structure for TLS certificates..."
mkdir -p "$CA_DIR" "$SERVER_DIR" "$CLIENT_DIR"

# 2.1 Generate CA
echo "Generating CA (if not exists)..."
if [ ! -f "$CA_DIR/ca.pem" ]; then
  openssl genrsa -out "$CA_DIR/ca-key.pem" 4096
  chmod 600 "$CA_DIR/ca-key.pem"
  openssl req -x509 -new -nodes \
    -key "$CA_DIR/ca-key.pem" \
    -sha256 -days 3650 \
    -subj "/CN=OpenSecDevOps-CA" \
    -out "$CA_DIR/ca.pem"
else
  echo "CA certificate already exists. Skipping CA generation."
fi

# 2.2 Generate and sign server cert for DinD
echo "Generating server certificate for DinD (if not exists)..."
if [ ! -f "$SERVER_DIR/server-cert.pem" ]; then
  openssl genrsa -out "$SERVER_DIR/server-key.pem" 4096
  chmod 600 "$SERVER_DIR/server-key.pem"
  openssl req -new \
    -key "$SERVER_DIR/server-key.pem" \
    -subj "/CN=docker-dind" \
    -out "$SERVER_DIR/server.csr"

cat > "$SERVER_DIR/server-ext.cnf" <<EOF
[ v3_ext ]
subjectAltName = DNS:docker-dind
EOF

  openssl x509 -req \
    -in "$SERVER_DIR/server.csr" \
    -CA "$CA_DIR/ca.pem" \
    -CAkey "$CA_DIR/ca-key.pem" \
    -CAcreateserial \
    -sha256 -days 3650 \
    -out "$SERVER_DIR/server-cert.pem" \
    -extfile "$SERVER_DIR/server-ext.cnf" \
    -extensions v3_ext
  rm -f "$SERVER_DIR/server.csr" "$CA_DIR/ca.srl" "$SERVER_DIR/server-ext.cnf"
else
  echo "Server certificate already exists. Skipping server cert generation."
fi

# 2.3 Generate and sign client cert for Jenkins Agent
echo "Generating client certificate for Jenkins Agent (if not exists)..."
if [ ! -f "$CLIENT_DIR/cert.pem" ]; then
  openssl genrsa -out "$CLIENT_DIR/key.pem" 4096
  chmod 600 "$CLIENT_DIR/key.pem"
  openssl req -new \
    -key "$CLIENT_DIR/key.pem" \
    -subj "/CN=jenkins-agent" \
    -out "$CLIENT_DIR/client.csr"
  openssl x509 -req \
    -in "$CLIENT_DIR/client.csr" \
    -CA "$CA_DIR/ca.pem" \
    -CAkey "$CA_DIR/ca-key.pem" \
    -CAcreateserial \
    -sha256 -days 3650 \
    -out "$CLIENT_DIR/cert.pem"
  rm -f "$CLIENT_DIR/client.csr"
  chmod 644 "$CLIENT_DIR/cert.pem"
else
  echo "Client certificate already exists. Skipping client cert generation."
fi

echo "Linking CA to client directory (for TLS)…"
if [ ! -L "$CLIENT_DIR/ca.pem" ]; then
  (cd "$CLIENT_DIR" && ln -s ../ca/ca.pem ca.pem)
else
  echo "symlink ca.pem already exists. Skipping."
fi

# Final permissions
chmod -R 600 "$CA_DIR"/*.pem
chmod -R 600 "$SERVER_DIR"/*.pem
chmod -R 600 "$CLIENT_DIR"/*.pem

echo "Environment setup is complete!"
echo "You can now run 'docker-compose up -d' to start Jenkins with TLS enabled."
```

### Dockerfile

Personalización de la imagen de Jenkins Agent con SSH y cliente Docker

```Dockerfile title="Dockerfiles/Dockerfile-agent" showLineNumbers
FROM jenkins/ssh-agent:latest

RUN apt-get update && apt-get install -y \
    apt-transport-https ca-certificates curl gnupg lsb-release jq unzip expect

RUN install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
    -o /etc/apt/keyrings/docker.asc \
 && chmod a+r /etc/apt/keyrings/docker.asc \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN LATEST_VERSION=$(curl https://api.github.com/repos/sigstore/cosign/releases/latest | grep tag_name | cut -d : -f2 | tr -d "v\", ") \
&& curl -O -L "https://github.com/sigstore/cosign/releases/latest/download/cosign_${LATEST_VERSION}_amd64.deb" \
&& dpkg -i cosign_${LATEST_VERSION}_amd64.deb

RUN apt-get update && apt-get install -y docker-ce docker-ce-cli

RUN usermod -aG docker jenkins
```

### docker-compose.yml

El archivo docker-compose.yml define dos servicios principales:

- **jenkins-master**: Contenedor principal de Jenkins que gestiona la interfaz web, la configuración y los trabajos. Se configura para usar un volumen persistente para los datos de Jenkins y se asegura de que se ejecute con permisos limitados.
- **jenkins-agent**: Contenedor que actúa como agente de Jenkins, conectado por SSH al master. Se configura para usar los certificados TLS generados y se monta un volumen para el workspace compartido.
- **docker-dind**: Servicio Docker-in-Docker que permite la construcción y gestión de contenedores de forma aislada y segura, utilizando los certificados generados.

```yml title="docker-compose.yml" showLineNumbers
services:
  jenkins-master:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    restart: unless-stopped
    user: 1000:1000 
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.jenkins.rule=Host(`jenkins.opensecdevops.com`)"
      - "traefik.http.routers.jenkins.entrypoints=websecure"
      - "traefik.http.routers.jenkins.tls=true"
      - "traefik.http.routers.jenkins.tls.certresolver=le"
      - "traefik.http.services.jenkins.loadbalancer.server.port=8080"
    volumes:
      - jenkins_home:/var/jenkins_home:rw
    environment:
      - JAVA_OPTS=-Dhudson.security.csrf.GlobalCrumbIssuerStrategy=true -Djenkins.security.SystemReadPermission=true
    networks:
      - jenkins_network
    security_opt:
      - no-new-privileges:true
        read_only: true
    tmpfs:
      - /tmp:exec,size=2G 
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/login || exit 1"]
      interval: 1m30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
  jenkins-agent:
    build:
      context: .
      dockerfile: Dockerfiles/Dockerfile-agent
    container_name: jenkins-agent
    restart: unless-stopped
    labels:
      - "traefik.enable=false"
    expose:
      - "22"
    volumes:
      - ./docker-certs/client:/home/jenkins/.docker:ro
      - ./docker-certs/ca:/home/jenkins/ca:ro
      - jenkins_agent:/home/jenkins/agent:rw
      - jenkins_workspace:/home/jenkins/agent/workspace 
      - type: bind
        source: ./jenkins_agent_keys
        target: /home/jenkins/.ssh
        read_only: true
    environment:
      - DOCKER_HOST=tcp://docker-dind:2376
      - DOCKER_TLS_VERIFY=1
      - DOCKER_CERT_PATH=/home/jenkins/.docker
      - SSH_PUBLIC_KEY_DIR=/home/jenkins/.ssh
    networks:
      - jenkins_network
    tmpfs:
      - /tmp:exec,size=2G 
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
  docker-dind:
    image: docker:dind
    container_name: docker-dind
    privileged: true
    restart: unless-stopped
    environment:
      - DOCKER_TLS_CERTDIR=
      - DOCKER_TLS_VERIFY=1
      - DOCKER_CERT_PATH=/certs/client
    ports:
      - "2376:2376"
    labels:
      - "traefik.enable=false"
    volumes:
      - ./docker-certs/ca:/certs/ca:ro
      - ./docker-certs/server:/certs/server:ro
      - ./docker-certs/client:/certs/client:ro
      - docker_dind_data:/var/lib/docker
      - jenkins_workspace:/workspace
    networks:
      - jenkins_network
    command: >
      dockerd
        --host=tcp://0.0.0.0:2376
        --tlsverify
        --tlscacert=/certs/ca/ca.pem
        --tlscert=/certs/server/server-cert.pem
        --tlskey=/certs/server/server-key.pem

networks:
  jenkins_network:
    driver: bridge
volumes:
  docker_dind_data:
    driver: local
  jenkins_home:
    driver: local
  jenkins_agent:
    driver: local
  jenkins_workspace:
    driver: local
    driver_opts:
      type: none
      o: bind,uid=1000,gid=1000
      device: ${PWD}/workspace
```

## Puesta en marcha

### Generación de certificados

Una vez copiados los archivos en la carpeta del proyecto, ejecuta el script de generación de certificados

```sh
oepnsecdevops@vulns:~/jenkins$ ./setup.sh
Preparing environment for Jenkins deployment...
Creating SSH keys directory for Jenkins Agent...
Generating SSH keys for Jenkins Agent...
Generating public/private rsa key pair.
Your identification has been saved in ./jenkins_agent_keys/id_rsa
Your public key has been saved in ./jenkins_agent_keys/id_rsa.pub
The key fingerprint is:
SHA256:16IbGfn7OaRHQhEUlv4ZdB4hYefLACdY1Pqa9I8FIsI oepnsecdevops@vulns
The key\'s randomart image is:
+---[RSA 4096]----+
|         =X==.o. |
|        ..o=o+o  |
|         . +.o.. |
|     .   .+..o.. |
|      E S.+oooo  |
|       . Boo*.   |
|        +..O  .  |
|         o+.++   |
|        . .o+o.  |
+----[SHA256]-----+
Configuring authorized_keys for Jenkins Agent...
Creating directory structure for TLS certificates...
Generating CA (if not exists)...
Generating server certificate for DinD (if not exists)...
Certificate request self-signature ok
subject=CN = docker-dind
Generating client certificate for Jenkins Agent (if not exists)...
Certificate request self-signature ok
subject=CN = jenkins-agent
Linking CA to client directory (for TLS)…
Environment setup is complete!
You can now run 'docker-compose up -d' to start Jenkins with TLS enabled.
```

### Aranque de entorno

Inicia los contenedores y obtén la contraseña inicial de administrador de Jenkins

```sh
docker compose up --build -d

goldrak@vulns:~/jenkins$ docker compose up --build -d
Compose can now delegate builds to bake for better performance.
 To do so, set COMPOSE_BAKE=true.
[+] Building 1.0s (13/13) FINISHED                                                                                                                                                                                                           docker:default
 => [jenkins-agent internal] load build definition from Dockerfile-agent                                                                                                                                                                               0.1s
 => => transferring dockerfile: 1.15kB                                                                                                                                                                                                                 0.0s
 => [jenkins-agent internal] load metadata for docker.io/jenkins/ssh-agent:latest                                                                                                                                                                      0.0s
 => [jenkins-agent internal] load .dockerignore                                                                                                                                                                                                        0.1s
 => => transferring context: 2B                                                                                                                                                                                                                        0.0s
 => [jenkins-agent 1/8] FROM docker.io/jenkins/ssh-agent:latest                                                                                                                                                                                        0.0s
 => CACHED [jenkins-agent 2/8] RUN apt-get update && apt-get install -y     apt-transport-https     ca-certificates     curl     gnupg     lsb-release                                                                                                 0.0s
 => CACHED [jenkins-agent 3/8] RUN install -m 0755 -d /etc/apt/keyrings                                                                                                                                                                                0.0s
 => CACHED [jenkins-agent 4/8] RUN curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc                                                                                                                             0.0s
 => CACHED [jenkins-agent 5/8] RUN chmod a+r /etc/apt/keyrings/docker.asc                                                                                                                                                                              0.0s
 => CACHED [jenkins-agent 6/8] RUN echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian   $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |   tee /etc/apt/source  0.0s
 => CACHED [jenkins-agent 7/8] RUN apt-get update && apt-get install -y docker-ce docker-ce-cli jq curl unzip                                                                                                                                          0.0s
 => CACHED [jenkins-agent 8/8] RUN usermod -aG docker jenkins                                                                                                                                                                                          0.0s
 => [jenkins-agent] exporting to image                                                                                                                                                                                                                 0.1s
 => => exporting layers                                                                                                                                                                                                                                0.0s
 => => writing image sha256:c7e2efa9f44f2ad8ab9b623495dd15446c59dec3f1ccf6a7fe7598b988992fb6                                                                                                                                                           0.0s
 => => naming to docker.io/library/jenkins-jenkins-agent                                                                                                                                                                                               0.1s
 => [jenkins-agent] resolving provenance for metadata file                                                                                                                                                                                             0.0s
[+] Running 9/9
 ✔ jenkins-agent                       Built                                                                                                                                                                                                           0.0s
 ✔ Network jenkins_jenkins_network     Created                                                                                                                                                                                                         0.2s
 ✔ Volume "jenkins_jenkins_agent"      Created                                                                                                                                                                                                         0.1s
 ✔ Volume "jenkins_docker_dind_data"   Created                                                                                                                                                                                                         0.0s
 ✔ Volume "jenkins_jenkins_workspace"  Created                                                                                                                                                                                                         0.1s
 ✔ Volume "jenkins_jenkins_home"       Created                                                                                                                                                                                                         0.0s
 ✔ Container jenkins-agent             Started                                                                                                                                                                                                         3.6s
 ✔ Container docker-dind               Started                                                                                                                                                                                                         3.9s
 ✔ Container jenkins                   Started                                                                                                                                                                                                         3.7s
```

```sh
opensecdevops@vulns:~/jenkins$  docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
4d3167d9dd9e4ffaafdad5044ab852dc
```

A continuación, accede desde el navegador al dominio configurado de Jenkins y utiliza la contraseña inicial

<div style={{textAlign: 'center'}}>
![Jenkins Unlock](/img/jenkins/jenkins-unlock.png)
</div>

Selecciona los plugins recomendados y espera a que se instalen

<div style={{textAlign: 'center'}}>
![Jenkis install plugins](/img/jenkins/jenkis-install-plugins.png)
</div>

<div style={{textAlign: 'center'}}>
![Jenkins installing plugin](/img/jenkins/jenkins-installing-plugin.png)
</div>

Crea un usuario con permisos de administrador

<div style={{textAlign: 'center'}}>
![Jenkins create user](/img/jenkins/jenkins-create-user.png)
</div>

Configura la URL del sistema para PR, notificaciones por correo, etc

<div style={{textAlign: 'center'}}>
![Jenkis config url](/img/jenkins/jenkis-config-url.png)
</div>

Configuración finalizada, ya podemos usar Jenkins.

<div style={{textAlign: 'center'}}>
![Jenkins Intall Finished](/img/jenkins/jenkins-intall-finished.png)
</div>

### Configuración nodo agente

#### Claves ssh

Para agregar las credenciales SSH en Jenkins, ve a `Administrar Jenkins -> Credenciales`. Añade una nueva credencial de tipo SSH con:

- ID de usuario: `jenkins`
- Clave privada: contenido de `jenkins_agent_keys/id_rsa`

<div style={{textAlign: 'center'}}>
![Jenkins list credentials](/img/jenkins/jenkins-list-credentials.png)
</div>

<div style={{textAlign: 'center'}}>
![jenkins add ssh credentials](/img/jenkins/jenkins-add-ssh-credentials.png)
</div>

#### Agregar agente

A continuación vamos a conectar el agente que hemos levantado en el docker-compose, para ello nos dirigimos ha `Adminstrar Jenkins -> Nodes`.

Hacemos click en `+ New Node` y vamos a la creación de un nuevo agentes

<div style={{textAlign: 'center'}}>
![Jenkins new node](/img/jenkins/jenkins-new-node.png)
</div>

A continuación agregamos los datos del agente:

- Nombre
- Descripción
- Directorio raiz remoto (`/home/jenkins/agent`)
- Metodo de ejecución:
  - Arrancar agentes remotos en máquinas Unix vía SSH
  - Nombre de máquina (nombre del contenedor `jenkins-agent`)
  - Host key verification strategy
    - Manual trusted key verification strategy
    - Require manual verification of initial connection

<div style={{textAlign: 'center'}}>
![Jenkins add node](/img/jenkins/jenkins-add-agent.png)
</div>

Vamos al listado de nodos y vemos que ya tenemos el nodo pero sin conectar.

<div style={{textAlign: 'center'}}>
![jenkins node not connect](/img/jenkins/jenkins-node-not-connect.png)
</div>

Entramos al nodo vamos al `Trust SSH Host Key` y aceptamos el hash de la conexión.

<div style={{textAlign: 'center'}}>
![Jenkins agent accept fingerprinting](/img/jenkins/jenkins-agent-accept-fingerprinting.png)
</div>

Ahora ya podemos ver el nodo conectado y usarlos en nuestros pipelines.

<div style={{textAlign: 'center'}}>
![jenkins node connect](/img/jenkins/jenkins-node-connect.png)
</div>

## Conexión GitLab

Para conectar Jenkins con GitLab tenemos que seguir los siguientes pasos:

- Instalar plugin de GitLab en Jekins
- Obtener un token de GitLab del proyecto para asociarlo al plugin de GitLab
- Activar la integración en GitLab de Jenkins para el uso de Webhooks.

### Instalación del plugin

Para instalar el plugin de GitLab, vamos a `Administrar Jekins -> Plugins -> Available plugins` aqui buscamos gitlab, lo selecionamos y le damos a instalar.

<div style={{textAlign: 'center'}}>
![Jenkins select install plugin](/img/jenkins/Jenkins-select-install-plugin.png)
</div>

Nos aparecera una pantalla con el progreso y un boton de reiniciar Jenkins cuando termite para que se active el plugin.

<div style={{textAlign: 'center'}}>
![Jenkins gitlab install](/img/jenkins/Jenkins-gitlab-install.png)
</div>

<div style={{textAlign: 'center'}}>
![Jenkins reboot](/img/jenkins/Jenkins-reboot.png)
</div>

### Configuración del plugin

Lo primero que tenemos que hacer es obtener un token para podernos conectar a GitLab desde Jenkins, si usamos el Free tier de GitLab el token que necesitamos tiene que ser o personal o a nivel de proyecto si no esta en un grupo, si tenemos un grupo tendremos que usar uno personal.

- A nivel de proyecto vamos a `Proyecto -> Settings -> Access Token`
- A nivel de usuario vamos a `User Settings -> Access tokens`

<div style={{textAlign: 'center'}}>
![GitLab token](/img/jenkins/GitLab-token.png)
</div>

Una vez que tenemos el token vamos a Jenkins `Administrar Jenkins -> System -> GitLab` y rellenamos los datos con el nombre de la conexión, url del servidor GitLab y añadimos el token y probamos la conexión.

<div style={{textAlign: 'center'}}>
![Jenkins enable auth gitlab](/img/jenkins/jenkis-enable-auth-gitlab.png)
</div>

### Configuración webhook

Para poder integrar Jenkins en GitLab lo primero que tenemos que hacer es crear una nueva tarea, en nuestro caso vamos a `Pipeline` y en la configuración la realizaremos para que el pipeline funcione del Jenkinsfile que hay en el repositorio.

Tenemos que activar en los Triggers el webhooks `Build when a change is pushed to GitLab. GitLab webhook URL: https://jenkins.opensecdevops.com/project/OSDO` y configuramos los eventos que necesitemos.

En el Pipeline selecionamos la opcion `Pipeline script from SCM` en el SCM `Git` en el reposotiro la url de nuestro repositorio y creamos una nueva credencial con nuestro usuario y el token obtenido anteriormente.

<div style={{textAlign: 'center'}}>
![jenkins config project](/img/jenkins/jenkins-config-project.png)
</div>

Ahora volvemos a GitLab y vamos a `Settings -> Integrations`, buscamos Jenkins y le damos al boton `+ add`

En la integración tenemos que agregar el nombre del proyecto de Jenkins, la url de Jenkins y el usuario y contraseña de Jenkins.

<div style={{textAlign: 'center'}}>
![jenkins gitlab webhook](/img/jenkins/jenkins-gitlab-webhook.png)
</div>

Ya puedes definir tu Jenkinsfile en el repositorio y comenzar a ejecutar pipelines automáticamente con cada push
