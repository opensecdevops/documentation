---
title: Instalación
---

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar Harbor es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar Harbor en Kubernetes
osdo deploy --platform kubernetes --components harbor

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components harbor

# Desplegar en K3s
osdo deploy --platform k3s --components harbor
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > harbor-config.yaml << EOF
platform: kubernetes
namespace: harbor
domain: harbor.miempresa.com
components:
  - harbor
  - cert-manager
  - nginx-ingress
config:
  registry:
    storage: 100Gi
    replication: true
EOF

osdo deploy --config harbor-config.yaml

# Con preset predefinido
osdo deploy --preset production --platform kubernetes \
  --components harbor --namespace harbor
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::
## Instalacion Manual

## Docker-compose

Para instalar Harbor utilizando Docker Compose, sigue los pasos oficiales recomendados:

- Accede a la página de [releases de Harbor](https://github.com/goharbor/harbor/releases).
- Descarga el instalador online u offline para la versión que desees instalar.
- **(Opcional)** Descarga el archivo *.asc correspondiente para verificar la autenticidad del paquete.

   El archivo *.asc es una clave OpenPGP. Para verificar que el paquete descargado es genuino, realiza los siguientes pasos:

  - Obtén la clave pública asociada al archivo *.asc:

     ```bash
     gpg --keyserver hkps://keyserver.ubuntu.com --receive-keys 644FF454C0B4115C
     ```

     Deberías ver el mensaje:  
     `public key "Harbor-sign (The key for signing Harbor build) <jiangd@vmware.com>" imported`

  - Verifica que el paquete es genuino ejecutando uno de los siguientes comandos según el tipo de instalador:

     **Online installer:**

     ```bash
     gpg -v --keyserver hkps://keyserver.ubuntu.com --verify harbor-online-installer-version.tgz.asc
     ```

     **Offline installer:**

     ```bash
     gpg -v --keyserver hkps://keyserver.ubuntu.com --verify harbor-offline-installer-version.tgz.asc
     ```

     El comando `gpg` confirmará que la firma del paquete coincide con la clave *.asc. Deberías ver una confirmación de que la firma es correcta.

     ```bash
     gpg: armor header: Version: GnuPG v1
     gpg: assuming signed  indata 'harbor-offline-installer-v1.10.0-rc2.tgz'
     gpg: Signature made Fri, Dec  6, 2019  5:04:17 AM WEST
     gpg: using RSA key 644FF454C0B4115C
     gpg: using pgp trust model
     gpg: Good signature from "Harbor-sign (The key for signing Harbor build) <jiangd@vmware.com> [unknown]
     ```

- Extrae el paquete del instalador usando `tar`:

   **Online installer:**

   ```bash
   tar xzvf harbor-online-installer-version.tgz
   ```

   **Offline installer:**

   ```bash
   tar xzvf harbor-offline-installer-version.tgz
   ```

- Accede al directorio extraído:

   ```bash
   cd harbor
   ```

- Configura el archivo `harbor.yml` según tus necesidades. Asegúrate de establecer correctamente la sección `hostname` y, si es necesario, configura las secciones de autenticación y base de datos.

- Instala Harbor ejecutando el script `install.sh`:

   ```bash
   sudo ./install.sh
   ```

   Este script realizará todas las configuraciones necesarias y levantará los contenedores de Harbor.

:::warning
Si queremos usar Traefik, tenemos que desactivar el TLS de Harbor y que haga de terminador Traefik
:::

Paramos los contenedores de Harbor:

```bash
docker-compose down
```

Modificar el archivo `docker-compose.yml` de Harbor para que use la red creada y los labels necesarios para Traefik:

```yaml title="docker-compose.yml" showLineNumbers="true"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.harbor.rule=Host(`harbor.opensecdevops.com`)"
      - "traefik.http.routers.harbor.entrypoints=websecure"
      - "traefik.http.routers.harbor.tls=true"
      - "traefik.http.routers.harbor.tls.certresolver=le"
```

- Levanta los contenedores de Harbor nuevamente:

```bash
docker-compose up -d --build
```

- **Inicia sesión con las credenciales predeterminadas**:

  - Usuario: `admin`
  - Contraseña: `Harbor12345`

   Se recomienda cambiar la contraseña del administrador después del primer inicio de sesión.

## Kubernetes

[https://github.com/goharbor/harbor-helm.git](https://github.com/goharbor/harbor-helm.git)

Clonar el repositorio:

```bash
git clone https://github.com/goharbor/harbor-helm.git
```

Acceder al directorio recién clonado:

```bash
cd harbor-helm
```

A continuación, copiar o modificar el archivo `values.yaml` según las necesidades del entorno. En el archivo `values.yaml` se deben establecer los siguientes parámetros:

```yaml
expose:
  type: ingress
  tls:
    enabled: true
    secret:
      secretName: "SECRET_CERT"
    certSource: secret
  ingress:
    hosts:
      core: "harbor.opensecdevops.com"
    className: "appsec-nginx"
  annotations:
    k8s.io/appsec-nginx: appsec-nginx
    nginx.ingress.kubernetes.io/proxy-body-size: "0"

trivy:
  enabled: true
notary:
  enabled: false
externalURL: "https://harbor.opensecdevops.com"
harborAdminPassword: admin
persistence:
  persistentVolumeClaim:
    registry:
      size: 20Gi
```

Una vez configurado el archivo, proceder con la instalación utilizando Helm:

```bash
helm repo add harbor https://helm.goharbor.io 

helm upgrade --install -n harbor harbor -f values.yaml harbor/harbor --create-namespace
```

Detalles del comando anterior:

- `-- install` permite instalar Harbor si no está instalado, o actualizarlo si ya existe.
- `--create-namespace` crea el namespace `harbor` en Kubernetes si no existe.
- `-f values.yaml` indica el archivo de configuración personalizado que se utilizará para la instalación.
- `-n harbor` especifica el namespace donde se instalará Harbor.

:::warning
El chart de Helm puede requerir editar el recurso Ingress de Harbor y añadir `ingressClassName: appsec-nginx` debajo de `spec` para que el Ingress funcione correctamente.
:::
