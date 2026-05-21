---
title: Runner
description: GitLab runner para ejecutar pipelines
---

Un Runner de GitLab es una parte fundamental del sistema de CI/CD (Integración Continua y Entrega Continua) de GitLab. Funciona como una entidad que se encarga de ejecutar trabajos específicos definidos en los archivos `.gitlab-ci.yml`. Los Runners permiten la automatización de tareas, pruebas y despliegues en un entorno de desarrollo, todo ello gestionado a través de GitLab. Aquí tienes algunas de sus características principales:

1. **Ejecución de trabajos:** Los Runners ejecutan los trabajos definidos en los archivos `.gitlab-ci.yml`. Estos trabajos pueden incluir tareas como la construcción de código, pruebas unitarias, análisis estático de código y despliegues.
2. **Multiplataforma:** Los Runners son versátiles y pueden ejecutarse en una variedad de sistemas operativos y arquitecturas, lo que permite la compatibilidad con diferentes tipos de proyectos y entornos.
3. **Escalabilidad:** Puedes configurar múltiples Runners para un solo proyecto o incluso para varios proyectos, lo que permite escalar y distribuir la carga de trabajo según sea necesario.
4. **Docker:** Los Runners de GitLab son compatibles con Docker, lo que facilita la creación de entornos de prueba y despliegues de aplicaciones en contenedores.
5. **Seguridad:** GitLab ofrece opciones avanzadas de seguridad para los Runners, lo que incluye autenticación y autorización seguras para garantizar que solo los usuarios autorizados puedan ejecutar trabajos en los Runners.
6. **Paralelismo:** Los Runners pueden ejecutar trabajos en paralelo, lo que acelera el proceso de CI/CD al distribuir las tareas en varios Runners si es necesario.
7. **Personalización:** Los Runners pueden ser configurados y personalizados para satisfacer las necesidades específicas de tu proyecto, lo que te permite definir entornos, variables de entorno y requisitos de ejecución personalizados.
8. **Monitorización y registro:** GitLab proporciona herramientas de monitorización y registro para que puedas rastrear el estado y el rendimiento de tus Runners, lo que facilita la detección y solución de problemas.
9. **Escenarios de despliegue complejos:** Los Runners permiten la automatización de flujos de trabajo complejos de CI/CD que abarcan múltiples etapas, desde la construcción hasta las pruebas y el despliegue en diferentes entornos.

## Instalación

### Official GitLab repositories

Para instalar un runner de GitLab, primero debemos agregar el repositorio oficial de GitLab a nuestro sistema. Esto se puede hacer ejecutando los siguientes comandos:

```bash
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
```

Luego, instalamos el paquete del runner de GitLab con el siguiente comando:

```bash
sudo apt-get install gitlab-runner
```

Una vez instalado, podemos verificar que el runner se haya instalado correctamente ejecutando:

```bash
gitlab-runner --version
```

Esto debería mostrar la versión del runner de GitLab que acabamos de instalar.

#### Registro del Runner

Para registrar el runner, necesitamos un token de registro que podemos obtener desde la interfaz de usuario de GitLab. Este token se encuentra en la sección de configuración del proyecto o grupo donde queremos registrar el runner.

![Obtener token de registro](/img/gitlab/gitlab-runner-token.png)

Una vez que tengamos el token, podemos proceder a registrar el runner. Para ello, ejecutamos el siguiente comando:

```bash
sudo gitlab-runner register  --url https://gitlab.com  --token glrt-1G9u9XWWFnAeQPSH8KXXXXXXXXXXXwFw.01.1i1rubub7
```

![GitLab runner](/img/gitlab/gitlab-runners.png)

### Kubernetes

Para proceder a la instalacion del runner de GitLab en nuestra plataforma como con otras herramientas primero necesitamos revisar el values yaml en el siguiente repo [https://gitlab.com/gitlab-org/charts/gitlab-runner/blob/main/values.yaml](https://gitlab.com/gitlab-org/charts/gitlab-runner/blob/main/values.yaml), para asi poder ver los valores que deseamos utilizar en nuestro despliegue.

Luego procedemos a crear uno propio o copiar el anterior.

Debemos agregar al yaml el token que obtenemos de gitlab para registrar el runner en nuestro cluster

```yaml
runnerRegistrationToken: "glrt-FQX6FNEB6_vNUQkxnQFt"
```

Tambien procedemos a agregar las siguientes configuraciones para poder tener la cache y el docker in docker habilitados

```yaml
config: |
    [[runners]]
      [runners.kubernetes]
        namespace = "namespace del gitlab-runner"
        image = "ubuntu:latest"
        [[runners.kubernetes.volumes.host_path]]
          name = "docker-socket"
          mount_path = "/var/run/docker.sock"
          read_only = false
          host_path = "/var/run/docker.sock"
        [runners.cache]
        Type = "s3"
        Shared = true
        [runners.cache.s3]
          ServerAddress = "S3_ADDRESS"
          AccessKey = "ACCESSKEY"
          SecretKey = "SECRETKEY"
          BucketName = "BUCKETNAME"
          BucketLocation = "BUCKET_LOCATION"
          Insecure = false
```

Una vez configurado el archivo, proceder con la instalación utilizando Helm:

```bash
helm repo add gitlab https://charts.gitlab.io

helm upgrade --install -n  gitlab-runner gitlab-runner -f values.yaml gitlab/gitlab-runner --create-namespace
```

Detalles del comando anterior:

- `-- install` permite instalar Harbor si no está instalado, o actualizarlo si ya existe.
- `--create-namespace` crea el namespace `gitlab-runner` en Kubernetes si no existe.
- `-f values.yaml` indica el archivo de configuración personalizado que se utilizará para la instalación.
- `-n gitlab-runner` es el nombre del namespace donde se instalará el runner de GitLab.
