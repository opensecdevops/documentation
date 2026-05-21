# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar ArgoCD es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar ArgoCD en Kubernetes
osdo deploy --platform kubernetes --components argocd

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components argocd

# Desplegar en K3s
osdo deploy --platform k3s --components argocd
```

### Configuración Avanzada

```bash
# Usar archivo de configuración YAML
cat > argocd-config.yaml << EOF
platform: kubernetes
namespace: argocd
domain: argocd.miempresa.com
components:
  - argocd
  - cert-manager
  - nginx-ingress
config:
  argocd:
    ha: true
    replicas: 3
EOF

osdo deploy --config argocd-config.yaml

# Con preset de producción
osdo deploy --preset production --platform kubernetes \
  --components argocd --namespace gitops
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

:::info
Solo disponible para **Kubernetes (k8s)**
:::

Para proceder a la instalacion de ArgoCD en nuestra plataforma necesitamos ejecutar los siguientes pasos:

1. Creamos el namespace

```bash
kubectl create namespace argocd 
```

2. Instalamos el manifest con kubectl

```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Como ArgoCD no queda expuesto hacia fuera, tenemos dos opciones:

1. Acceder internamente con

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

2. O exponerlo y para ello debemos crearles un **ingress.yaml** de la siguiente manera:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-nginx
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    # If you encounter a redirect loop or are getting a 307 response code
    # then you need to force the nginx ingress to connect to the backend using HTTPS.
    #
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: appsec-nginx
  rules:
  - host: argocd.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              name: https
  tls:
  - hosts:
    - argocd.yourdomain.com
    secretName: argocd-server-tls # as expected by argocd-server
```

Y ahora debemos aplicarlo con:

```bash
kubectl apply -f ingress.yaml -n argocd
```
