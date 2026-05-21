# Flujo de trabajo

Con la intención de que se entregue una aplicacion totalmente segura en un entorno seguro, se utiliza la estrategia de GitOps para desplegar, como tambien se realiza monitorizacion y proteccion del trafico con appSec-nginx de checkpoint.

## Despliegue continuo

En el pipeline una vez ya se haya subido la imagen, procedemos a actualizar los manifiestos de despliegue de tal manera que los mismos ArgoCD los utilice para desplegar la aplicacion en nuestra plataforma.
Con esto vemos que al actualizar dichos manifiestos ArgoCD usa como unica fuente de la verdad los mismos desde el ultimo commit hecho en el repositorio y procede luego a emplearlos en la plataforma.

## Manejo del trafico

Cuando la aplicacion es desplegada en la plataforma, se le coloca un ingress controller, el cual para este proyecto se ha seleccionado appsec-nginx.
Dicho ingress controller le agrega una capa de seguridad al trafico que entra en la aplicacion ya que tiene un agente propio el cual realiza alertas, y tiene deteccion temprana de actividades anomalas actuando como WAF, tambien cuenta con un sistema de ML incorporado el cual le ayuda a tener un aprendizaje de todo tipo de amenzas que van surgiendo mientras la aplicacion use dicho controlador.

