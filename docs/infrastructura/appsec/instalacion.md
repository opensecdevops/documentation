# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar OpenAppSec es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar OpenAppSec en Kubernetes
osdo deploy --platform kubernetes --components appsec

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components appsec

# Desplegar en K3s
osdo deploy --platform k3s --components appsec
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > appsec-config.yaml << EOF
platform: kubernetes
namespace: appsec
domain: appsec.miempresa.com
components:
  - appsec
  - cert-manager
  - nginx-ingress
config:
  appsec:
    mode: standalone
    email: admin@miempresa.com
    persistence: false
    ingressClass: appsec-nginx
EOF

osdo deploy --config appsec-config.yaml

# Con preset de seguridad
osdo deploy --preset production --platform kubernetes \
  --components appsec,falco,kyverno --namespace security
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

:::info
Solo disponible para **Kubernetes (k8s)**
:::

Para instalar AppSec procederemos con los siguientes pasos:

1. Descargamos el chart de Helm

```bash
wget https://downloads.openappsec.io/helm/open-appsec-k8s-nginx-ingress-latest.tgz
```

2. Procedemos a instalar con Helm

```bash
helm upgrade --install open-appsec openappsec/open-appsec-k8s-nginx-ingress \
--set appsec.mode=standalone \
--set controller.ingressClass=appsec-nginx \
--set controller.ingressClassResource.name=appsec-nginx \
--set controller.ingressClassResource.controllerValue="k8s.io/appsec-nginx" \
--set appsec.persistence.enabled=false \
--set appsec.userEmail="correo@correo.org" \
--set controller.admissionWebhooks.certManager.enabled=false\
-n appsec --create-namespace
```

Del anterior comando podemos notar los siguientes detalle:

1. Se usa 'helm upgrade --install' porque si no existe los instale y si existe lo actualice.
2. Se usa '--create-namespace' para que cree el namespace en Kuberentes si no esta creado.
3. Se usa '-n appsec' para indicar el namespace donde queremos instalar nuestra aplicacion.
4. Se usa '--set appsec.mode=standalone' para indicar el modo en que se quiere desplegar la aplicación standalone es modo local el cual no conecta con la interfaz web.
5. Se usa '--set controller.ingressClass=appsec-nginx' para indicar el nombre del controlador.
6. Se usa '--set controller.ingressClassResource.name=appsec-nginx' para indicar el nombre que tendra la clase del controlador.
7. Se usa '--set appsec.persistence.enabled=false' para indicar que no queremos persistencia, si esta activo el ML la info se perdera cada vez que muera el contenedor.
8. Se usa '--set appsec.userEmail="correo@correo.org"' para indicar el correo que se utiliza para relacionarlo con la interfaz web.
9. Se usa '--set controller.admissionWebhooks.certManager.enabled=false' para indicar si queremos engancharlo al certManager para generar los certificados ssl/tls.
