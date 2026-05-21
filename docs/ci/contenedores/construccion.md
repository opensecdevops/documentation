# Construcción

La construcción de imágenes en Docker es el proceso de crear una imagen de contenedor que contiene todo lo necesario para ejecutar una aplicación: desde el sistema operativo base hasta las dependencias y configuraciones específicas de la aplicación.

## Buildah

Buildah es una herramienta open source para la construcción de imágenes de contenedores que no requiere un demonio de Docker en ejecución ni privilegios de root. Está diseñada para integrarse fácilmente en sistemas de integración continua (CI) y automatización, proporcionando flexibilidad, seguridad y compatibilidad con los estándares OCI y Docker.

## Características principales

- **Construcción sin demonio de Docker:** Buildah permite construir imágenes de contenedor sin depender de un demonio de Docker, lo que mejora la seguridad y facilita su uso en entornos restringidos o CI/CD.
- **Sin privilegios de root:** Puede ejecutarse como usuario sin privilegios, reduciendo la superficie de ataque y los riesgos de seguridad en entornos compartidos.
- **Compatibilidad con Dockerfile y scripts:** Buildah puede construir imágenes a partir de Dockerfiles estándar o mediante comandos y scripts, ofreciendo mayor flexibilidad en la definición del proceso de construcción.
- **Soporte para múltiples formatos:** Genera imágenes compatibles tanto con el formato OCI como con Docker, facilitando la portabilidad entre diferentes plataformas y registros.
- **Integración con podman y otras herramientas:** Buildah se integra de forma nativa con podman y otras herramientas del ecosistema de contenedores, permitiendo flujos de trabajo avanzados y personalizados.
- **Gestión avanzada de capas y caché:** Permite optimizar la construcción reutilizando capas y gestionando el cacheado para acelerar los tiempos de build.
- **Soporte multiplataforma:** Puede construir imágenes para diferentes arquitecturas, adaptándose a necesidades de despliegue variadas.

**Beneficios:**

- **Seguridad mejorada:** Al no requerir privilegios elevados ni demonio de Docker, Buildah reduce los riesgos asociados a la construcción de imágenes en entornos CI/CD y automatizados.
- **Portabilidad:** Facilita la construcción de imágenes en cualquier entorno compatible con contenedores, sin depender de servicios específicos o infraestructura local.
- **Flexibilidad:** Permite construir imágenes tanto desde Dockerfiles como desde scripts, adaptándose a flujos de trabajo personalizados y complejos.
- **Optimización de recursos:** Permite distribuir la carga de trabajo de construcción en diferentes sistemas o agentes de CI, aprovechando los recursos disponibles de manera eficiente.
- **Integración sencilla:** Se integra fácilmente en pipelines de CI/CD, permitiendo la automatización completa del proceso de construcción y publicación de imágenes.

## GitLab

```yml title=".gitlab-ci.yml" showLineNumbers
docker_build:
  stage: build
  needs: [composer, npm, docker_checkov]
  extends: .dependencies_cache
  image:
    name: quay.io/buildah/stable:latest
    entrypoint: [""]
  script:
    - mkdir -p tar_images
    - > 
      buildah bud \
        --format docker \
        --file "${CI_PROJECT_DIR}/docker/Dockerfile" \
        --tag "${DOCKER_REGISTRY_URL}/osdo/osdo-app-gitlab-${CI_COMMIT_REF_SLUG}:${CI_COMMIT_SHORT_SHA}" \
        "${CI_PROJECT_DIR}"
    - >
      buildah push \
        "${DOCKER_REGISTRY_URL}/osdo/osdo-app-gitlab-${CI_COMMIT_REF_SLUG}:${CI_COMMIT_SHORT_SHA}" \
        "docker-archive:tar_images/osdo_app.tar"

  artifacts:
    paths:
      - tar_images
    when: on_success
```

- **stage**: Define la fase del pipeline en la que se ejecuta este job, en este caso `build`, indicando que corresponde al proceso de construcción de la imagen de contenedor.
- **needs**: Especifica que este job depende de los jobs `composer`, `npm` y `docker_checkov`, asegurando que las dependencias PHP, JavaScript y los chequeos de seguridad estén completados antes de construir la imagen.
- **extends**: Hereda la configuración de `.dependencies_cache`, lo que permite reutilizar reglas de caché y otras configuraciones comunes definidas previamente en el pipeline.
- **image**: Utiliza la imagen oficial de Buildah (`quay.io/buildah/stable:latest`), que contiene las herramientas necesarias para construir imágenes de contenedor de forma segura y sin requerir demonio de Docker.
- **entrypoint**: Sobrescribe el punto de entrada por defecto de la imagen, estableciéndolo como vacío para permitir la ejecución personalizada de comandos en el script.
- **script**: Lista los comandos principales que se ejecutan en el job:
  - Crea el directorio `tar_images` para almacenar la imagen generada en formato tar.
  - Ejecuta Buildah con los parámetros necesarios:
    - `--format docker`: Genera la imagen en formato Docker.
    - `--file`: Especifica la ubicación del Dockerfile a utilizar.
    - `--tag`: Indica el destino de la imagen en el registro de contenedores, utilizando la URL y el tag del commit.
    - El último argumento es el contexto de construcción (directorio raíz del proyecto).
  - Usa `buildah push` para exportar la imagen construida a un archivo tar en el directorio `tar_images`.
- **artifacts**: Especifica que el directorio `tar_images` debe conservarse como artefacto tras la ejecución del job, permitiendo su descarga o uso en etapas posteriores del pipeline. El artefacto se guarda solo si el job finaliza correctamente (`when: on_success`).

## GitHub

```yaml title=".github/workflows/ci.yml" showLineNumbers
 docker_build:
    name: Docker Build
    runs-on: ubuntu-latest
    needs: [composer, npm]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Descargar artifacts previos
        uses: actions/download-artifact@v4

      - name: Crear directorio tar_images
        run: mkdir -p tar_images

      - name: Inject enhanced GitHub environment variables
        uses: rlespinasse/github-slug-action@v5

      - name: Instalar Buildah
        run: |
          sudo apt-get update -qq
          sudo apt-get install -y -qq buildah

      - name: Construir imagen con Buildah
        run: |
          buildah bud \
            --format docker \
            --file docker/nginx/Dockerfile \
            --tag harbor.opensecdevops.com/osdo/osdo-app-github-${{ env.GITHUB_REF_NAME_SLUG }}:${{ github.sha }} \
            .

      - name: Exportar imagen a tarball
        run: |
          buildah push \
            harbor.opensecdevops.com/osdo/osdo-app-github-${{ env.GITHUB_REF_NAME_SLUG }}:${{ github.sha }} \
            docker-archive:tar_images/osdo_app.tar

      - name: Subir tar del Docker image
        uses: actions/upload-artifact@v4
        with:
          name: docker_image
          path: tar_images/
          retention-days: 1

```

- **name**: Define el nombre del job como `Docker Build`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende de los jobs `composer` y `npm`, por lo que no se ejecutará hasta que la instalación de dependencias PHP y JavaScript haya finalizado correctamente.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Clonar repositorio**: Usa la acción `actions/checkout@v4` para clonar el repositorio en el runner y disponer del código fuente necesario para la construcción de la imagen.
  - **Recuperar artifacts**: Usa la acción `actions/download-artifact@v4` para descargar los artefactos generados en jobs previos, como dependencias o archivos de compilación.
  - **Crear directorio tar_images**: Ejecuta el comando `mkdir -p tar_images` para crear el directorio donde se almacenará la imagen de contenedor en formato tar.
  - **Inject enhanced GitHub environment variables**: Usa la acción `rlespinasse/github-slug-action@v5` para generar variables de entorno útiles, como el nombre de la rama en formato slug.
  - **Instalar Buildah**: Instala la herramienta Buildah, que permite construir imágenes de contenedor sin requerir demonio de Docker ni privilegios de root.
  - **Construir imagen con Buildah**: Utiliza el comando `buildah bud` para construir la imagen a partir del Dockerfile especificado, etiquetándola con el nombre de la rama y el hash del commit.
  - **Exportar imagen a tarball**: Usa `buildah push` para exportar la imagen construida a un archivo tar en el directorio `tar_images`.
  - **Subir tar del Docker image**: Usa la acción `actions/upload-artifact@v4` para subir el archivo tar generado como artefacto del workflow, permitiendo su descarga o uso en etapas posteriores. Se especifica el nombre del artefacto (`docker_image`), la ruta (`tar_images/`) y el tiempo de retención (`retention-days: 1`).

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
stage('Build Image with Kaniko') {
    environment {
        DOCKER_REGISTRY_URL     = 'harbor.opensecdevops.com'
    }
    steps {
        unstash 'deps'

        script {
            if (env.TAG_NAME) {
                env.IMAGE_TAG = env.TAG_NAME
            } else {
                def sha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                env.IMAGE_TAG = "${env.BRANCH_NAME}-${sha}"
            }

            sh 'mkdir -p tar_images'

            def uid = sh(returnStdout: true, script: 'id -u').trim()
            def gid = sh(returnStdout: true, script: 'id -g').trim()
            echo "→ Ejecutaré Buildah como UID=${uid} GID=${gid}"

            sh """
                docker run --rm \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                quay.io/buildah/stable:latest \
                buildah bud --format docker \
                    -f docker/Dockerfile \
                    -t ${DOCKER_REGISTRY_URL}/osdo/osdo-app-jenkins:\${IMAGE_TAG} \
                    .
            """

            sh """
                docker run --rm \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                quay.io/buildah/stable:latest \
                buildah push \
                    ${DOCKER_REGISTRY_URL}/osdo/osdo-app-jenkins:\${IMAGE_TAG} \
                    docker-archive:/app/tar_images/osdo_app.tar
            """

            sh """
                docker run --rm \
                -v /workspace/${JOB_NAME}:/app \
                alpine:latest \
                chown ${uid}:${gid} /app/tar_images/osdo_app.tar
            """
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'tar_images/**', fingerprint: true
            stash name: 'docker-image', includes: 'tar_images/**'
        }
    }
}
```

- **environment:**  
  Define variables de entorno necesarias para el proceso:
  - `DOCKER_REGISTRY_URL`: URL del registro de contenedores donde se almacenará la imagen generada.

- **unstash 'deps':**  
  Recupera las dependencias previamente almacenadas en una etapa anterior del pipeline, asegurando que estén disponibles para la construcción de la imagen.

- **script:**  
  Ejecuta un bloque de instrucciones en Groovy para preparar y construir la imagen:
  - Comprueba si existe una variable `TAG_NAME` (por ejemplo, para releases); si existe, la usa como tag de la imagen. Si no, genera un tag basado en el nombre de la rama y el hash corto del commit actual, asegurando la trazabilidad de la imagen.
  - Ejecuta `mkdir -p tar_images` para crear el directorio donde se almacenará la imagen en formato tar.
  - Obtiene el UID y GID del usuario actual para asegurar los permisos correctos sobre los archivos generados.
  - Ejecuta el comando `docker run` con la imagen de Buildah para construir la imagen de contenedor:
    - Monta el workspace del job en el contenedor (`-v /workspace/${JOB_NAME}:/app`).
    - Establece el directorio de trabajo (`-w /app`).
    - Usa Buildah (`quay.io/buildah/stable:latest`) para construir la imagen con los siguientes argumentos:
      - `buildah bud --format docker -f docker/Dockerfile -t ${DOCKER_REGISTRY_URL}/osdo/osdo-app-jenkins:${IMAGE_TAG} .`
  - Usa otro contenedor Buildah para exportar la imagen construida a un archivo tar en el directorio `tar_images`:
    - `buildah push ${DOCKER_REGISTRY_URL}/osdo/osdo-app-jenkins:${IMAGE_TAG} docker-archive:/app/tar_images/osdo_app.tar`
  - Ajusta los permisos del archivo tar generado usando un contenedor Alpine y el comando `chown`, para que el archivo sea accesible por el usuario del runner.

- **post > success:**  
  Acciones a ejecutar si el stage finaliza correctamente:
  - `archiveArtifacts artifacts: 'tar_images/**', fingerprint: true`: Guarda la imagen generada como artefacto del build y asegura la trazabilidad mediante fingerprint.
  - `stash name: 'docker-image', includes: 'tar_images/**'`: Almacena el archivo tar generado en el stash de Jenkins para su uso en etapas posteriores del pipeline.
