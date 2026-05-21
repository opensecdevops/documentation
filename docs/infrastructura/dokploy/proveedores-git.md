# Proveedores Git

En Dokploy, los **proveedores Git** (o *Git providers*) son servicios externos de gestión de repositorios de código fuente, como GitHub o GitLab, que se pueden integrar con la plataforma para automatizar y gestionar los flujos de trabajo de despliegue.

## ¿Para qué sirven los providers de Git?

La integración con proveedores Git permite a Dokploy:

- **Automatizar despliegues:** Detectar automáticamente cambios en los repositorios y lanzar procesos de despliegue basados en esos cambios.
- **Sincronizar código y configuración:** Mantener la infraestructura y las aplicaciones alineadas con el estado declarado en los repositorios Git, siguiendo prácticas GitOps.
- **Gestionar permisos y autenticación:** Utilizar los mecanismos de autenticación y autorización de los proveedores para controlar el acceso a los proyectos y repositorios.
- **Facilitar la trazabilidad:** Registrar qué cambios y commits han originado cada despliegue, mejorando la auditoría y el seguimiento.

## Integración con GitHub y GitLab

Dokploy ofrece integración nativa tanto con **GitHub** como con **GitLab**. Para conectar un proveedor Git, normalmente se requiere:

1. **Registrar una aplicación OAuth** en el proveedor (GitHub o GitLab) para obtener las credenciales necesarias (Client ID y Client Secret).
2. **Configurar la integración en Dokploy** introduciendo las credenciales y la URL del proveedor.
3. **Autorizar el acceso** desde Dokploy a los repositorios deseados.

Una vez configurada la integración, Dokploy puede acceder a los repositorios, detectar cambios (commits, merges, tags) y automatizar los despliegues según la configuración definida.

### Ventajas de la integración

- Permite implementar flujos de trabajo GitOps de forma sencilla.
- Facilita la colaboración entre equipos de desarrollo y operaciones.
- Mejora la seguridad y el control de acceso a los despliegues.

### GitLab

Para integrar GitLab como proveedor Git en Dokploy, vamos a `Git Providers` y seleccionamos `GitLab`, el cual nos abrira un formulario para introducir los datos necesarios

<div style={{textAlign: 'center'}}>
![GitLab Provider](/img/dokploy/gitlab_provider.png)
</div>

Lo primero que debemos hacer es crear una aplicación OAuth en GitLab. Para ello, accedemos a `Settings > Applications` y rellenamos el formulario con los siguientes datos

<div style={{textAlign: 'center'}}>
![GitLab Application](/img/dokploy/gitlab_application.png)
</div>

Una vez creada la aplicación, obtendremos el `Application ID` y el `Secret`, que son los datos que debemos introducir en Dokploy, junto con la URL de GitLab (por ejemplo, `https://gitlab.com` o `https://gitlab.midominio.com`).

Ahora ya podemos utilizar GitLab como proveedor Git en Dokploy, permitiendo la automatización de despliegues y la gestión de proyectos directamente desde los repositorios de GitLab.

### Github

Para integrar GitHub como proveedor Git en Dokploy, vamos a `Git Providers` y seleccionamos `GitHub`, el cual nos llevara a crear una aplicación para la integración.

<div style={{textAlign: 'center'}}>
![GitHub Provider](/img/dokploy/github_provider.png)
</div>

<div style={{textAlign: 'center'}}>
![GitHub Application](/img/dokploy/github_application.png)
</div>

Una vez creada la aplicación, volvemos a Dokploy y autorizamos la aplicación con los permisos necesarios. Esto nos permitirá acceder a los repositorios de GitHub y gestionar los despliegues desde Dokploy.

<div style={{textAlign: 'center'}}>
![GitHub Authorization](/img/dokploy/github_authorization.png)
</div>
