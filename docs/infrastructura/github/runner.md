---
title: Runner
description: GitHub self-hosted runner para ejecutar workflows de GitHub Actions
---

Un runner self-hosted de GitHub Actions es una máquina (física, virtual o en contenedor) que ejecuta los jobs definidos en los workflows de GitHub Actions. A diferencia de los runners hospedados por GitHub, los self-hosted runners permiten un mayor control sobre el entorno de ejecución, la instalación de dependencias y la integración con recursos internos o personalizados.

## Características principales

1. **Ejecución de jobs:** El runner ejecuta los jobs definidos en los archivos de workflow (`.github/workflows/*.yml`) del repositorio. Estos jobs pueden incluir tareas como compilación, pruebas, análisis de seguridad, despliegues y más.
2. **Personalización del entorno:** Permite instalar herramientas, dependencias y configuraciones específicas según las necesidades del proyecto o la organización.
3. **Soporte para Docker y DinD:** El runner puede ejecutar contenedores Docker y, mediante Docker-in-Docker (DinD) con TLS, construir y gestionar imágenes de forma segura y aislada.
4. **Escalabilidad:** Se pueden desplegar múltiples runners para distribuir la carga de trabajo y ejecutar jobs en paralelo.
5. **Seguridad:** El uso de certificados TLS y la ejecución bajo usuarios no privilegiados refuerzan la seguridad del entorno.
6. **Integración con GitHub:** El registro y la gestión del runner se realizan desde la interfaz de GitHub, permitiendo su asociación a repositorios o a toda la organización.

## Instalación

A continuación se describe un ejemplo de despliegue de un runner self-hosted de GitHub Actions utilizando Docker Compose, con soporte para Docker-in-Docker (DinD) y certificados TLS

### Estructura de carpetas y ficheros

Dentro de tu proyecto crea la siguiente jerarquía:

```md
 ├── Dockerfiles/Dockerfile-runner
 ├── docker-certs/
 ├── docker-compose.yml
 └── setup.sh
```

- **docker-certs/**  
  Directorio donde `setup.sh` generará los certificados ssl para proteger las comunicaciones con el DinD

- **docker-compose.yml**  
  Orquestación de los 3 contenedores: `jenkins-master`, `jenkins-agent` y `docker-dind`.

- **setup.sh**  
  Script Bash para generar los certificados TLS necesarios para la comunicación segura entre el runner y el servicio Docker-in-Docker (DinD).

### setup.sh

Este script realiza las siguientes tareas:

- Crea la autoridad de certificación (CA) y genera los certificados TLS para DinD y para el GitHub self-hosted runner.

```bash title="setup.sh" showLineNumbers
#!/bin/bash
set -e
echo "==> Generating TLS certificates for DinD..."

CERT_DIR="./docker-certs"
CA_DIR="$CERT_DIR/ca"
SERVER_DIR="$CERT_DIR/server"
CLIENT_DIR="$CERT_DIR/client"

mkdir -p "$CA_DIR" "$SERVER_DIR" "$CLIENT_DIR"

# 1) CA
if [ ! -f "$CA_DIR/ca.pem" ]; then
  openssl genrsa -out "$CA_DIR/ca-key.pem" 4096
  chmod 600 "$CA_DIR/ca-key.pem"
  openssl req -x509 -new -nodes \
    -key "$CA_DIR/ca-key.pem" \
    -sha256 -days 3650 \
    -subj "/CN=OpenSecDevOps-CA" \
    -out "$CA_DIR/ca.pem"
else
  echo "Existing CA, skipping."
fi

# 2) Server (DinD)
if [ ! -f "$SERVER_DIR/server-cert.pem" ]; then
  openssl genrsa -out "$SERVER_DIR/server-key.pem" 4096
  chmod 600 "$SERVER_DIR/server-key.pem"
  openssl req -new \
    -key "$SERVER_DIR/server-key.pem" \
    -subj "/CN=docker-dind" \
    -out "$SERVER_DIR/server.csr"
  cat > "$SERVER_DIR/server-ext.cnf" <<EOF
[ v3_ext ]
subjectAltName = DNS:docker-dind,IP:127.0.0.1
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
  echo "Existing server certificate, skipping."
fi

# 3) Client (for the runner if TLS access is needed)
if [ ! -f "$CLIENT_DIR/cert.pem" ]; then
  openssl genrsa -out "$CLIENT_DIR/key.pem" 4096
  chmod 600 "$CLIENT_DIR/key.pem"
  openssl req -new \
    -key "$CLIENT_DIR/key.pem" \
    -subj "/CN=github-runner" \
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
  echo "Existing client certificate, skipping."
fi

# Link the CA in the client directory for convenience
if [ ! -L "$CLIENT_DIR/ca.pem" ]; then
  (cd "$CLIENT_DIR" && ln -s ../ca/ca.pem ca.pem)
fi

chmod -R 600 "$CA_DIR"/*.pem "$SERVER_DIR"/*.pem "$CLIENT_DIR"/*.pem

echo "==> Certificates generated."
```

### start.sh

```bash title="start.sh" showLineNumbers
#!/bin/bash
set -e

echo "==> Starting GitHub Actions self-hosted runner..."

echo "==> Configuring Docker TLS certificates..."
sudo mkdir -p /home/docker/.docker
sudo chown docker:docker /home/docker/.docker
sudo chmod 700 /home/docker/.docker


sudo cp /home/docker/actions-runner/docker-certs/ca/ca.pem \
        /home/docker/.docker/ca.pem
sudo cp /home/docker/actions-runner/docker-certs/client/cert.pem \
        /home/docker/.docker/cert.pem
sudo cp /home/docker/actions-runner/docker-certs/client/key.pem \
        /home/docker/.docker/key.pem

sudo chown docker:docker /home/docker/.docker/*.pem
sudo chmod 600 /home/docker/.docker/*.pem

export DOCKER_CERT_PATH=/home/docker/.docker

echoo "==> Configuring GitHub Actions runner..."

REG_TOKEN=$(
  curl -s -X POST \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/actions/runners/registration-token" \
  | jq -r .token
)
echo "Token de registro obtenido: ${REG_TOKEN}"

cd /home/docker/actions-runner
./config.sh --unattended \
            --url https://github.com/${REPO} \
            --token ${REG_TOKEN}

cleanup() {
  echo "Eliminando runner..."
  ./config.sh remove --unattended --token ${REG_TOKEN}
}

trap 'cleanup; kill ${RUNNER_PID} 2>/dev/null || true; exit 0' SIGINT SIGTERM

./run.sh &
RUNNER_PID=$!

wait "${RUNNER_PID}"
exit $?
```

### Dockerfile

El Dockerfile instala todas las dependencias necesarias, incluyendo Docker, el runner de GitHub Actions y los scripts de arranque. Se crea un usuario dedicado y se configuran los permisos adecuados.

```dockerfile title="Dockerfiles/Dockerfile-runner" showLineNumbers
FROM ubuntu:24.04

ARG RUNNER_VERSION="2.324.0"
ARG DEBIAN_FRONTEND=noninteractive

# 1) Create user and update
RUN apt update -y && apt upgrade -y && useradd -m docker

# 2) Install dependencies + sudo + Docker CE
RUN apt install -y --no-install-recommends \
      curl jq build-essential libssl-dev libffi-dev \
      python3 python3-venv python3-dev python3-pip libicu-dev \
      apt-transport-https ca-certificates gnupg lsb-release sudo \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
         | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
         https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
         > /etc/apt/sources.list.d/docker.list \
    && apt update -y \
    && apt install -y --no-install-recommends \
         docker-ce docker-ce-cli containerd.io docker-compose-plugin \
    && echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 3) Download and install GitHub Actions runner
RUN mkdir -p /home/docker/actions-runner \
 && cd /home/docker/actions-runner \
 && curl -O -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz \
 && tar xzf actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# 4) Adjust permissions and internal dependencies
RUN chown -R docker:docker /home/docker/actions-runner \
 && /home/docker/actions-runner/bin/installdependencies.sh

WORKDIR /home/docker/actions-runner

# 5) Copy startup and certificate generation scripts
COPY start.sh setup.sh ./
RUN chmod +x start.sh setup.sh

# 6) Run as non-privileged user
USER docker
ENTRYPOINT ["./start.sh"]
```

### docker-compose.yml

El archivo docker-compose.yml define dos servicios principales:

- **runner**: Contenedor que ejecuta el self-hosted runner de GitHub Actions, configurado para comunicarse con el servicio DinD mediante TLS.
- **docker-dind**: Servicio Docker-in-Docker que permite la construcción y gestión de contenedores de forma aislada y segura, utilizando los certificados generados.

```yaml title="docker-compose.yml" showLineNumbers
services:
  runner:
    build:
      context: .
      dockerfile: Dockerfiles/Dockerfile-runner
    container_name: github-runner
    restart: unless-stopped
    environment:
      REPO: GoldraK/osdo
      TOKEN: <YOUR_GITHUB_TOKEN>
      DOCKER_HOST: tcp://docker-dind:2376
      DOCKER_TLS_VERIFY: 1
      DOCKER_CERT_PATH: /home/docker/.docker
    volumes:
      - ./docker-certs:/home/docker/actions-runner/docker-certs:ro

  docker-dind:
    image: docker:dind
    container_name: docker-dind-github
    privileged: true
    restart: unless-stopped
    environment:
      - DOCKER_TLS_CERTDIR=
      - DOCKER_TLS_VERIFY=1
      - DOCKER_CERT_PATH=/certs/client
    volumes:
      - ./docker-certs/ca:/certs/ca:ro
      - ./docker-certs/server:/certs/server:ro
      - ./docker-certs/client:/certs/client:ro
      - docker_dind_data:/var/lib/docker
    command: >
      dockerd
        --host=tcp://0.0.0.0:2376
        --tlsverify
        --tlscacert=/certs/ca/ca.pem
        --tlscert=/certs/server/server-cert.pem
        --tlskey=/certs/server/server-key.pem

volumes:
  docker_dind_data:
```

### Registro y uso en GitHub

Para registrar el runner:

- Se debe obtener un token de registro desde la interfaz de GitHub (en la configuración del repositorio u organización, sección "Actions > Runners").
- El runner se registra automáticamente al arrancar, utilizando el token y la URL del repositorio.
- Una vez registrado, el runner aparecerá en la lista de runners disponibles y podrá ser utilizado por los workflows del repositorio.

## Ventajas del enfoque self-hosted

- Control total: Permite definir el entorno exacto de ejecución, instalar herramientas personalizadas y acceder a recursos internos.
- Aislamiento y seguridad: El uso de usuarios dedicados y certificados TLS refuerza la seguridad, especialmente en entornos donde se requiere ejecutar Docker de forma segura.
- Optimización de costes: Reduce la dependencia de los runners hospedados por GitHub, permitiendo aprovechar infraestructura propia o en la nube.
- Escalabilidad: Se pueden desplegar varios runners para gestionar cargas de trabajo elevadas o distribuir jobs entre diferentes entornos.

## Inconvenientes y consideraciones

Aunque los runners self-hosted de GitHub Actions ofrecen numerosas ventajas, también presentan ciertos inconvenientes y aspectos a tener en cuenta:

- **Gestión y mantenimiento:** Es responsabilidad del equipo mantener actualizado el sistema operativo, Docker, el propio runner y todas las dependencias instaladas. Esto implica tareas periódicas de actualización y parcheo de seguridad.
- **Seguridad:** Al ejecutar código de los workflows, el runner puede estar expuesto a riesgos de seguridad, especialmente si se utilizan repositorios públicos o si los workflows no están debidamente controlados. Es fundamental restringir el acceso y aplicar buenas prácticas de seguridad.
- **Consumo de recursos:** El consumo de CPU, memoria y almacenamiento depende de los jobs ejecutados. Es necesario dimensionar adecuadamente la infraestructura para evitar cuellos de botella o interrupciones.
- **Disponibilidad:** Si el runner se detiene, falla o pierde conectividad, los workflows que dependan de él no podrán ejecutarse hasta que se restablezca el servicio.
- **Gestión de secretos:** Es necesario gestionar de forma segura los tokens, certificados y variables sensibles utilizados en la configuración y operación del runner.
- **Compatibilidad:** Algunas funcionalidades avanzadas de GitHub Actions pueden requerir configuraciones adicionales o no estar disponibles en entornos self-hosted, dependiendo del sistema operativo o las restricciones de red.

Antes de optar por un runner self-hosted, es recomendable evaluar estos aspectos y definir procedimientos claros de mantenimiento, seguridad y monitorización.

## Consideraciones adicionales

- Es importante mantener actualizados tanto el runner de GitHub Actions como Docker y las dependencias del sistema.
- Se recomienda monitorizar el estado y el rendimiento del runner, así como gestionar adecuadamente los tokens y secretos utilizados en la configuración.
- La integración con Docker-in-Docker debe realizarse siguiendo buenas prácticas de seguridad, como el uso de certificados y la restricción de privilegios.
- Para más información sobre runners self-hosted en GitHub Actions, consulta la documentación oficial.
