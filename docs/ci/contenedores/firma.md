# Firma

Firmar imágenes Docker utilizando herramientas como "cosign" es una práctica recomendada para garantizar la integridad y autenticidad de las imágenes que se utilizan en entornos de desarrollo, pruebas y producción. Al firmar una imagen Docker, se agrega una capa adicional de seguridad que permite verificar que la imagen no ha sido alterada desde su creación y que proviene de una fuente confiable.

## Características

1. **Integridad y autenticidad:** La firma de imágenes Docker permite verificar que una imagen no ha sido modificada y que proviene de la fuente esperada. Esto ayuda a prevenir la ejecución de imágenes comprometidas o modificadas de manera no autorizada.

2. **Verificación de fuente confiable:** Con "cosign", se pueden utilizar claves de firma criptográfica para verificar que la imagen proviene de una fuente confiable y que no ha sido manipulada durante la distribución.

3. **Protección contra ataques y vulnerabilidades:** Al verificar la firma de una imagen antes de su implementación, se reduce el riesgo de desplegar imágenes con vulnerabilidades conocidas o software malicioso.

4. **Cumplimiento y auditoría:** La firma de imágenes Docker facilita el cumplimiento de regulaciones y estándares de seguridad, ya que proporciona un registro de control y auditoría de las imágenes utilizadas en el ciclo de desarrollo.

5. **Integración en pipelines de CI/CD:** "cosign" y otras herramientas de firma de imágenes se pueden integrar en pipelines de CI/CD para automatizar la firma y verificación de imágenes durante el proceso de construcción y despliegue.

6. **Compatibilidad con registros de contenedores:** Estas herramientas son compatibles con varios registros de contenedores, lo que permite firmar y verificar imágenes en entornos como Docker Hub, Google Container Registry y otros.

Para firmar los contenedores en el CI/CD, primero es necesario crear un par de claves RSA para la firma. Se recomienda dejar las claves sin contraseña, ya que no hay manera de introducirla de forma interactiva en el pipeline.

```bash
cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

## GitLab

Guardamos la clave privada `cosign.key` en el almacen de secretos de GitLab, en `Settings -> CI/CD -> Secure files`, y la nombramos `cosign.key`.

<div style={{textAlign: 'center'}}>
![GitLab Secure Files](/img/gitlab/gitlab-cosign-secure.png)
</div>

```yml title=".gitlab-ci.yml" showLineNumbers
docker_sign:
  stage: sign_image
  dependencies: ["docker_push"]
  variables:
    GIT_STRATEGY: none
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
  image: docker:28
  services:
    - docker:28-dind-rootless
  before_script:
    - apk add --update cosign curl bash
    - curl -s https://gitlab.com/gitlab-org/incubation-engineering/mobile-devops/download-secure-files/-/raw/main/installer | bash
  script:
    - echo "$DOCKER_REGISTRY_PASS" | docker login -u "$DOCKER_REGISTRY_USER" --password-stdin $DOCKER_REGISTRY_URL
    - cosign sign --key .secure_files/cosign.key -y $DOCKER_REGISTRY_URL/osdo/osdo-app@${DIGEST}
```

En este ejemplo, el job `docker_sign` se encarga de firmar la imagen Docker que se ha subido previamente al registro. Aquí están los pasos clave:

- **Variables de entorno:** Se definen las variables necesarias para la conexión al registro Docker y se especifica el uso de Docker en modo rootless.
- **Instalación de Cosign:** Se instala `cosign` y se descarga el script para acceder a los archivos seguros del proyecto.
- **Autenticación en el registro:** Se utiliza `docker login` para autenticar al usuario en el registro de Docker, utilizando las credenciales almacenadas en las variables de entorno.
- **Firma de la imagen:** Se utiliza `cosign sign` para firmar la imagen Docker utilizando la clave privada almacenada en los archivos seguros del proyecto. La imagen se identifica por su digest, que se obtiene del job anterior (`docker_push`).

## GitHub

Guardamos la clave privada `cosign.key` en base64 en el almacen de secretos de GitHub, en `Settings -> Secrets and variables -> Actions`, y la nombramos `COSIGN_KEY`.

```yaml title=".github/ci.yml" showLineNumbers
  docker_sign:
    runs-on: ubuntu-latest
    needs: docker_push
    env:
      DIGEST: ${{ needs.docker_push.outputs.DIGEST }}
      DOCKER_REGISTRY_URL: ${{ vars.DOCKER_REGISTRY_URL }}
      DOCKER_REGISTRY_USER: ${{ vars.DOCKER_REGISTRY_USER }}
      DOCKER_REGISTRY_PASS: ${{ secrets.DOCKER_REGISTRY_PASS }}
      COSIGN_PASSWORD: ${{ secrets.COSIGN_PASSWORD }}
    permissions: {}

    name: Install Cosign
    steps:
      - name: Install Cosign
        uses: sigstore/cosign-installer@v3.8.1
      - name: Check install!
        run: cosign version
      - name: Inject enhanced GitHub environment variables
        uses: rlespinasse/github-slug-action@v5

      - name: Sign Docker image
        run: |
          base64 --decode <<< "${{ secrets.COSIGN }}" > cosign.key
          chmod 600 cosign.key
          echo "${DOCKER_REGISTRY_PASS}" | docker login -u "${DOCKER_REGISTRY_USER}" --password-stdin ${DOCKER_REGISTRY_URL}
          cosign sign --key cosign.key -y ${DOCKER_REGISTRY_URL}/osdo/osdo-app-github-${{ env.GITHUB_REF_NAME_SLUG }}@${DIGEST}
```

- **name**: Define el nombre del job como `docker_sign`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende del job `docker_push`, por lo que no se ejecutará hasta que la imagen Docker haya sido construida y publicada correctamente en el registro.
- **env**: Define variables de entorno necesarias para la firma de la imagen:
  - **DIGEST**: Digest de la imagen publicada, obtenido como output del job anterior.
  - **DOCKER_REGISTRY_URL**, **DOCKER_REGISTRY_USER**, **DOCKER_REGISTRY_PASS**: Credenciales y URL del registro de contenedores.
  - **COSIGN_PASSWORD**: Contraseña de la clave privada de firma, almacenada como secreto.
- **permissions**: Se deja vacío para indicar que no se requieren permisos adicionales específicos para este job.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Install Cosign**: Usa la acción `sigstore/cosign-installer@v3.8.1` para instalar la herramienta de firma Cosign en el runner.
  - **Check install!**: Verifica que Cosign se haya instalado correctamente ejecutando `cosign version`.
  - **Inject enhanced GitHub environment variables**: Usa la acción `rlespinasse/github-slug-action@v5` para generar variables de entorno útiles, como el nombre de la rama en formato slug.
  - **Sign Docker image**:  
    - Decodifica la clave privada de Cosign almacenada en el secreto `COSIGN` y la guarda como `cosign.key`.
    - Cambia los permisos de la clave para mayor seguridad.
    - Realiza login en el registro de contenedores usando las credenciales proporcionadas.
    - Firma la imagen Docker publicada utilizando Cosign y la clave privada, identificando la imagen por su digest y el nombre de la rama.
