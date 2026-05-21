# Registry

Dokploy permite conectar y gestionar cualquier Docker Registry para almacenar imágenes y artefactos generados durante los despliegues. Esta integración facilita la autenticación y el almacenamiento seguro de credenciales, permitiendo el uso de múltiples aplicaciones sin necesidad de introducir las credenciales en cada una de ellas.

## ¿Para qué sirve conectarse a un registry?

Conectarse a un registry desde Dokploy permite:

- Almacenar y recuperar imágenes de contenedores de forma centralizada.
- Automatizar despliegues y actualizaciones de aplicaciones usando imágenes almacenadas en el registry.
- Gestionar credenciales de acceso de manera segura y reutilizable.
- Facilitar la integración con clusters y servidores remotos, ya que las credenciales quedan guardadas y se pueden usar en diferentes entornos.

## Configuración del Registry

Para conectar un registry en Dokploy, accede a la interfaz y completa el formulario con los siguientes datos:

![nuevo Registry](/img/dokploy/registry.png)

- **Registry Name:** Nombre identificativo para tu registry (por ejemplo, "Harbor Producción").
- **Username:** Usuario para autenticarse en el registry.
- **Password:** Contraseña o token de acceso.
- **Image Prefix (opcional):** Prefijo para etiquetar imágenes, útil en entornos con clusters (por ejemplo, `dokploy` convertirá la imagen a `dokploy/mi-app:latest`).
- **Registry URL:** URL del registry (por ejemplo, `https://harbor.midominio.com` o `https://index.docker.io/v1`).

Esta configuración permite que Dokploy almacene las credenciales localmente, facilitando el acceso automatizado y seguro a los registros de imágenes.

:::warning
Los [usuarios automáticos](../harbor/cuentas-automaticas.md) de Harbor tienen un símbolo de dólar (`$`) en el nombre (por ejemplo, `robot$miusuario`). Si introduces este usuario en la configuración de Dokploy, debes envolverlo entre comillas simples (`'robot$miusuario'`). De lo contrario, Dokploy interpreta el símbolo `$` como una variable y provocará errores de autenticación.
:::

Ejemplo de usuario correcto:

```text
'robot$miusuario'
```

De este modo, se garantiza la compatibilidad y el correcto funcionamiento de la autenticación con Harbor desde Dokploy.
