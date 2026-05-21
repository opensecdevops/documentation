# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar Cert-Manager es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar Cert-Manager en Kubernetes
osdo deploy --platform kubernetes --components cert-manager

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components cert-manager

# Desplegar en K3s
osdo deploy --platform k3s --components cert-manager
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > certmanager-config.yaml << EOF
platform: kubernetes
namespace: cert-manager
components:
  - cert-manager
  - nginx-ingress
config:
  certmanager:
    email: admin@miempresa.com
    acme_server: production
    installCRDs: true
EOF

osdo deploy --config certmanager-config.yaml

# Con preset de infraestructura
osdo deploy --preset production --platform kubernetes \
  --components cert-manager,nginx-ingress
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

:::info
Solo disponible para **Kubernetes (k8s)**
:::

Para proceder a la instalacion de CertManager en nuestra plataforma necesitamos ejecutar los siguientes pasos:

1. Agregamos el helm repo de CertManager

```bash
helm repo add jetstack https://charts.jetstack.io
```

:::warning
**En CertManager hay que colocar --set installCRDs=true porque sino se deben instalar aparte**
:::

2. Se instala con helm

```bash
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.10.0 --set installCRDs=true
```

Del anterior comando podemos notar los siguientes detalle:

1. Se usa 'helm upgrade --install' porque si no existe los instale y si existe lo actualice.
2. Se usa '--create-namespace' para que cree el namespace en Kuberentes si no esta creado.
3. Se usa '-n cert-manager' para indicar el namespace donde queremos instalar nuestra aplicacion.
4. Se usa '--version v1.10.0' para indicar la version que queremos instalar de nuestra aplicacion.
5. Se usa '--set installCRDs=true' para indicar que si queremos instalar los CRD.

## Issuer

Despues de tener instalado el CertManager debemos proceder a crear un emisor de certificados, asi que debemos crear un archivo para el **ClusterIssuer** llamado clusterissuer.yaml en el cual agregaremos las siguientes lineas:

:::info
**Se usa ClusterIssuer para que este disponible en todo el cluster**
:::

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-nginx
  namespace: cert-manager
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: easter@yourdomain.org
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      name: letsencrypt
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
    - http01:
        ingress:
          class: appsec-nginx
```

## Certificate

Por ultimo procederemos a crear el certificado que es el que se emitira a traves del emisor para cada uno de nuestros subdominios.
Crearemos un archivo yaml llamado **osdocert.yaml** con el siguiente contenido:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: osdo-certs
  namespace: cert-manager
spec:
  secretName: osdo-certs
  commonName: harbor.yourdomain.com
  dnsNames:
  - harbor.yourdomain.com

  issuerRef:
    name: letsencrypt-nginx
    kind: ClusterIssuer
```