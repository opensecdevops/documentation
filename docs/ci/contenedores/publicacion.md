# Publicación

Publicar imágenes Docker en un registro (registry) es un paso esencial para compartir y distribuir las imágenes de contenedor construidas durante el desarrollo.

En este proyecto se utiliza la siguiente herramienta:

## Crane

Crane es una herramienta que facilita la manipulación y gestión de imágenes Docker en registros remotos. Está diseñada para trabajar con registros alternativos al registro predeterminado de Docker, como Amazon ECR, Google Container Registry, Azure Container Registry, entre otros.

**Funcionalidades clave de Crane:**

- **Interfaz simplificada:** Ofrece una interfaz de línea de comandos sencilla para gestionar imágenes en registros distintos al predeterminado de Docker.
- **Soporte para registros alternativos:** Permite trabajar con una variedad de registros, lo que resulta útil para proyectos que no utilizan Docker Hub como repositorio principal.
- **Autenticación y manejo de credenciales:** Facilita la autenticación y gestión de credenciales para interactuar con registros remotos, permitiendo autenticarse fácilmente para acceder y manipular imágenes.
- **Push y pull de imágenes:** Permite enviar (push) y recuperar (pull) imágenes desde y hacia registros remotos, de manera similar al funcionamiento con el registro predeterminado de Docker.
- **Gestión de etiquetas y versiones:** Ofrece opciones para gestionar etiquetas y versiones de imágenes, facilitando la identificación y manipulación de versiones específicas.

**Ventajas de utilizar Crane:**

1. **Facilita la migración:** Simplifica el proceso de migración entre diferentes registros de imágenes al proporcionar una herramienta dedicada para la manipulación de imágenes.
2. **Flexibilidad en la elección del registro:** Permite utilizar registros alternativos a Docker Hub según las necesidades de la infraestructura y las políticas de seguridad.
3. **Automatización en flujos de trabajo:** Puede integrarse fácilmente en flujos de trabajo automatizados y scripts de CI/CD, al ser compatible con diversos registros.

**Uso de Crane:**

- **Instalación:** Crane se puede instalar como una herramienta independiente y utilizarse desde la línea de comandos.
- **Comandos básicos:** Ofrece comandos como `crane pull`, `crane push`, `crane auth`, entre otros, análogos a los comandos de Docker pero adaptados para registros remotos.
- **Configuración de credenciales:** Antes de interactuar con registros remotos, es necesario configurar las credenciales correspondientes para la autenticación.

**Limitaciones:**  
Aunque Crane es útil para trabajar con registros alternativos, puede tener algunas limitaciones en comparación con las funcionalidades específicas que ofrecen las herramientas nativas de cada registro.

## Uso

### GitLab

El primer paso es registrar las credenciales del [registro de contenedores](../../infrastructura/harbor/cuentas-automaticas.md) en las variables de CI/CD de GitLab. Para ello, en Harbor se crea una cuenta de robot, que puede ser global o por proyecto.

<div style={{textAlign: 'center'}}>
![variables CI](/img/harbor/variables.png)
</div>

Una vez preparado el usuario, se puede publicar la imagen generada previamente en el job `docker_build` mediante el siguiente job de ejemplo:

```yml title=".gitlab-ci.yml" showLineNumbers
docker_push:
  stage: push_image
  dependencies: ["docker_build"]
  variables:
    GIT_STRATEGY: none
  image:
    name: gcr.io/go-containerregistry/crane:v0.16.1
    entrypoint: [""]
  script:
    - cd tar_images
    - |
      crane auth login -u $DOCKER_REGISTRY_USER -p $DOCKER_REGISTRY_PASS $DOCKER_REGISTRY_URL;
      for tar_image in *.tar; 
      do 
        crane push $tar_image $DOCKER_REGISTRY_URL/osdo/osdo-app:$CI_COMMIT_SHORT_SHA -v;
        DIGEST=$(crane digest $DOCKER_REGISTRY_URL/osdo/osdo-app:$CI_COMMIT_SHORT_SHA);
        echo "DIGEST=${DIGEST}" >> digest.env
      done
  artifacts:
    reports:
      dotenv: tar_images/digest.env
    expire_in: 10 min
```

El job `docker_push` se encuentra en la etapa `push_image` del pipeline de CI/CD y se encarga de publicar las imágenes Docker construidas previamente en el job `docker_build`.

- **dependencies**: ["docker_build"]: Este job depende del resultado exitoso del job `docker_build`, asegurando que las imágenes a publicar estén construidas correctamente.
- **variables**: `GIT_STRATEGY: none` indica que no se requiere ninguna estrategia específica de Git para este job, ya que se trata principalmente de operaciones sobre contenedores.
- **image**: Utiliza la imagen oficial de Crane para ejecutar las operaciones de publicación.
- **script**:
  - Autentica con el registro de contenedores utilizando las credenciales proporcionadas en las variables de entorno.
  - Cambia al directorio `tar_images`, donde se encuentran las imágenes Docker en formato `.tar`.
  - Itera sobre cada archivo `.tar` y utiliza Crane para publicar la imagen en el registro, etiquetándola con el valor de `$CI_COMMIT_SHORT_SHA`.
  - Obtiene el digest de la imagen publicada y lo almacena en un archivo `digest.env`.
- **artifacts**: Se configura para almacenar el archivo `digest.env` como artefacto, lo que permite registrar el digest de la imagen publicada y utilizarlo en etapas posteriores, por ejemplo, para firmar la imagen.

### GitHub

```yaml title=".github/workflows/ci.yml" showLineNumbers
docker_push:
    name: docker_push
    needs: docker_build
    runs-on: ubuntu-latest
    env:
      DOCKER_REGISTRY_URL: ${{ vars.DOCKER_REGISTRY_URL }}
      DOCKER_REGISTRY_USER: ${{ vars.DOCKER_REGISTRY_USER }}
      DOCKER_REGISTRY_PASS: ${{ secrets.DOCKER_REGISTRY_PASS }}
    steps:
      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.24'

      - name: Download docker image tar
        uses: actions/download-artifact@v4
        with:
          name: docker_image
          path: tar_images

      - name: Install Crane
        uses: imjasonh/setup-crane@v0.1
      
      - name: Inject enhanced GitHub environment variables
        uses: rlespinasse/github-slug-action@v5

      - name: Push Docker image
        id: push
        run: |
          crane auth login -u ${DOCKER_REGISTRY_USER} -p ${DOCKER_REGISTRY_PASS} ${DOCKER_REGISTRY_URL}
          for tar_image in tar_images/*.tar; do
            crane push $tar_image ${DOCKER_REGISTRY_URL}/osdo/osdo-app-github-${{ env.GITHUB_REF_NAME_SLUG }}:${{ github.sha }}
            DIGEST=$(crane digest ${DOCKER_REGISTRY_URL}/osdo/osdo-app-github-${{ env.GITHUB_REF_NAME_SLUG }}:${{ github.sha }})
            echo "DIGEST=${DIGEST}" >> $GITHUB_OUTPUT
          done

    outputs:
      DIGEST: ${{ steps.push.outputs.DIGEST }}
```

El job `docker_push` se encarga de publicar las imágenes Docker generadas en el job `docker_build` en un registro de contenedores.

- **needs**: Indica que este job depende del job `docker_build`, asegurando que las imágenes estén listas antes de intentar publicarlas.
- **runs-on**: Especifica que el job se ejecutará en un runner con Ubuntu (`ubuntu-latest`), proporcionando un entorno limpio y consistente.
- **env**: Define variables de entorno necesarias para la autenticación y la configuración del registro:
  - **DOCKER_REGISTRY_URL**: URL del registro de contenedores.
  - **DOCKER_REGISTRY_USER**: Usuario para autenticarse en el registro.
  - **DOCKER_REGISTRY_PASS**: Contraseña o token de acceso, almacenado de forma segura como secreto de GitHub.
- **steps**: Define los pasos a seguir en el job:
  - **Set up Go**: Instala el entorno de Go necesario para ejecutar herramientas que lo requieran.
  - **Download docker image tar**: Descarga los artefactos generados en el job anterior, que contienen las imágenes Docker en formato `.tar`, y los coloca en el directorio `tar_images`.
  - **Install Crane**: Instala la herramienta Crane, utilizada para interactuar con registros de contenedores.
  - **Inject enhanced GitHub environment variables**: Usa la acción `rlespinasse/github-slug-action@v5` para generar variables de entorno útiles, como el nombre de la rama en formato slug.
  - **Push Docker image**:  
    - Autentica con el registro de contenedores usando Crane y las credenciales proporcionadas.
    - Itera sobre cada archivo `.tar` en `tar_images`, publica la imagen en el registro con el nombre y tag correspondiente, y obtiene su digest.
    - El digest de la imagen publicada se almacena como salida del job, permitiendo su uso en etapas posteriores del workflow.
- **outputs**: Define una salida llamada `DIGEST` que contiene el digest de la imagen publicada, facilitando su reutilización en otros jobs del workflow.

### Jenkins

```groovy title="Jenkinsfile" showLineNumbers
  stage('Push Docker Images') {
      environment {
          DOCKER_REGISTRY_URL = 'harbor.opensecdevops.com'
      }
      steps {
          // Solo dentro de este bloque estarán disponibles las vars DOCKER_REGISTRY_USER / _PASs
          withCredentials([usernamePassword(
          credentialsId: 'DOCKER_REGISTRY',
          usernameVariable: 'DOCKER_REGISTRY_USER',
          passwordVariable: 'DOCKER_REGISTRY_PASS'
          )]) {
              script {
                  unstash 'docker-image'

                  def shortSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

               
                  sh '''
                  for tar_image in tar_images/*.tar; do
                      [ -e "$tar_image" ] || continue
                      file=$(basename "$tar_image")

                      # Login
                      docker run --rm \
                      -v /workspace/${JOB_NAME}:/workspace \
                      -w /workspace \
                      gcr.io/go-containerregistry/crane:latest \
                      auth login -u $DOCKER_REGISTRY_USER -p $DOCKER_REGISTRY_PASS $DOCKER_REGISTRY_URL

                      # Push con tag por SHA
                      docker run --rm \
                      -v /workspace/${JOB_NAME}:/workspace \
                      -w /workspace \
                      gcr.io/go-containerregistry/crane:latest \
                      push "tar_images/$file" $DOCKER_REGISTRY_URL/osdo/osdo-app-jenkins:$shortSha -v

                      # Obtener digest y volcar en digest.env
                      DIGEST=$(docker run --rm \
                      -v /workspace/${JOB_NAME}:/workspace \
                      -w /workspace \
                      gcr.io/go-containerregistry/crane:latest \
                      digest $DOCKER_REGISTRY_URL/osdo/osdo-app-jenkins:$shortSha)
                      echo "DIGEST=$DIGEST" >> tar_images/digest.env
                  done
                  '''
              }
          }
      }
      post {
          success {
          archiveArtifacts artifacts: 'tar_images/digest.env', fingerprint: true
          }
      }
  }
```

El job `Push Docker Images` se encarga de publicar las imágenes Docker generadas en el job anterior en un registro de contenedores.

- **environment**: Define la variable `DOCKER_REGISTRY_URL` con la URL del registro de contenedores.
- **steps**: Contiene los pasos a seguir en el job:
  - **withCredentials**: Utiliza las credenciales almacenadas en Jenkins para autenticar con el registro de contenedores. Las variables `DOCKER_REGISTRY_USER` y `DOCKER_REGISTRY_PASS` estarán disponibles solo dentro de este bloque.
  - **script**: Ejecuta un script que realiza las siguientes acciones:
    - Descomprime las imágenes Docker almacenadas en formato `.tar` dentro del directorio `tar_images`.
    - Obtiene el SHA corto del commit actual para etiquetar las imágenes.
    - Itera sobre cada imagen `.tar`, autenticándose en el registro y publicando la imagen con la etiqueta correspondiente al SHA.
    - Obtiene el digest de la imagen publicada y lo almacena en un archivo `digest.env`.
- **post**: Define acciones a realizar después de la ejecución del job:
  - **success**: Si el job se ejecuta correctamente, archiva el archivo `digest.env` como artefacto, permitiendo su uso en etapas posteriores del pipeline.
- **fingerprint**: Habilita el fingerprinting del archivo `digest.env`, lo que permite rastrear su uso y cambios a lo largo del tiempo.
