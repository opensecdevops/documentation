# Herramientas

## Manejo de certificados

* Herramienta: CertManager
* Explicación: CertManager es la herramienta que se utiliza para generar certificados autofirmados y validados contra el DNS para que todo el trafico hacia las distintas aplciaciones vaya con certificados ssl/tls.

## Ingress Controler

* Herramienta: appSec-nginx
* Explicación: appSec-nginx es la herramienta que se utiliza para añadirle una capa mas de seguridad al manejor del trafico hacia kubernetes.

## Herramienta de despliegue

* Herramienta: ArgoCD
* Explicación: ArgoCD herramienta que se utiliza para realizar de manera automatizada los despliegues de las aplicaciones en Kubernetes, tambien usa como unica fuente de la verdad el repositorio de codigo fuente.

## PaaS

* Herramienta: Kubernetes
* Explicación: Kubernetes plataforma que se utiliza para desplegar todas las aplicaciones del proyecto, pudiendo obtener una escalabilidad, una monitorizacion y un alto indice de elasticidad.