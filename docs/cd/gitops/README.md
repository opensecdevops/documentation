---
title: GitOps en SecDevOps
description: "GitOps es una metodología que utiliza los principios y herramientas de Git para gestionar y automatizar la infraestructura y las aplicaciones, integrando SecDevOps en un único flujo de trabajo."
sidebar_label: GitOps
---

GitOps es una metodología que utiliza los principios y herramientas de Git para gestionar y automatizar la infraestructura y las aplicaciones, integrando de forma natural las prácticas de desarrollo (Dev), operaciones (Ops) y seguridad (Sec) en un único flujo de trabajo. Su enfoque se basa en declarar el estado deseado del sistema en repositorios Git, desde donde se controla, audita y despliega toda la infraestructura y el software de manera automatizada y segura.

## Beneficios de GitOps en SecDevOps

GitOps aporta ventajas significativas en términos de seguridad, eficiencia y gobernanza, especialmente en entornos donde la trazabilidad, la automatización y la resiliencia son fundamentales.

### Visibilidad y rastreabilidad

- **Registro de cambios:** Todas las configuraciones, manifiestos y definiciones de infraestructura se almacenan en repositorios Git, lo que proporciona un historial completo y detallado de cada cambio realizado.
- **Auditoría mejorada:** Permite auditar fácilmente quién realizó un cambio, cuándo y por qué, facilitando la investigación de incidentes y el cumplimiento de normativas.

### Control de versiones y revisión

- **Versionamiento estructurado:** Cada modificación queda registrada como un commit, lo que permite comparar, revisar y aprobar cambios antes de su aplicación.
- **Revisión por pares:** Los flujos de trabajo basados en pull/merge requests fomentan la revisión colaborativa y la detección temprana de errores o riesgos de seguridad.
- **Reversiones seguras:** Ante cualquier problema, es posible revertir rápidamente a una versión anterior conocida y estable, minimizando el impacto de errores o incidentes.

### Automatización segura

- **Implementaciones controladas:** La automatización de despliegues a partir del estado declarado en Git reduce la intervención manual y los errores humanos, asegurando que solo los cambios aprobados lleguen a producción.
- **Ejecución declarativa:** Los cambios se aplican de forma declarativa, garantizando que el entorno real coincida siempre con lo definido en el repositorio, evitando desviaciones no autorizadas.

### Gestión centralizada

- **Gestión de acceso y permisos:** Git actúa como punto central para la gestión de permisos, facilitando el control de acceso a la infraestructura y la protección de información sensible.
- **Consistencia y estándares:** Permite aplicar políticas y estándares de seguridad de forma uniforme en todos los entornos y aplicaciones, mejorando la gobernanza y la coherencia operativa.

### Seguridad en la cadena de suministro

- **Validación de cambios:** Es posible integrar validaciones automáticas, pruebas de seguridad y análisis de código en el pipeline antes de aplicar cualquier cambio, asegurando que solo configuraciones seguras y autorizadas se desplieguen.
- **Integración con herramientas de seguridad:** GitOps facilita la integración de herramientas de análisis estático y dinámico, escaneo de vulnerabilidades y cumplimiento normativo en el flujo de trabajo.

### Resiliencia y recuperación

- **Capacidad de recuperación:** Ante incidentes o fallos, la capacidad de restaurar el estado anterior mediante rollbacks o restauraciones desde Git permite una recuperación rápida y fiable.
- **Backups y restauración:** La gestión de configuraciones críticas en Git facilita la realización de backups y la restauración de entornos completos de forma sencilla y segura.

## Resumen

GitOps, al integrarse en estrategias DevSecOps, no solo mejora la eficiencia operativa y la velocidad de entrega, sino que también refuerza la seguridad y la trazabilidad en la gestión de la infraestructura y las aplicaciones. Al centralizar el control en Git y automatizar los procesos, se crea un entorno más robusto, auditable y resiliente, alineado con las mejores prácticas de seguridad y cumplimiento.

## GitLab

Para implementar GitOps en GitLab, tenemos que crear un repositorio que contenga los fichos de infraestructura a que deseamos gestionar. A continuación, se describen los pasos básicos para configurar GitOps en GitLab:

Para poder descargar el repositorio de GitLab y aplicar los cambios, podemos utilizar la herramienta `git` en la línea de comandos. Asegúrate de tener configuradas las credenciales de acceso adecuadas.

Creamos una clave SSH sin passphrase para autenticarte con GitLab y luego la añadimos a tu cuenta de GitLab.

```bash showLineNumbers
ssh-keygen -t ed25519 -C "gitlab-ci@tudominio.com" -f tl-gitops-key
# Esto creará:
#   - tl-gitops-key      (clave privada)
#   - tl-gitops-key.pub  (clave pública)
```

El contenido de `tl-gitops-key.pub` debe añadirse al repositorio destino en GitLab, haz clic en `Settings -> Repository -> Deploy Keys`, y agrega una nueva deploy key, marca `Grant write permissions to this key` (muy importante para poder push).

![Deploy Key](/img/gitlab/gitlab-deploy-keys.png)

Guardamos la clave privada `tl-gitops-key` en el almacen de secretos de GitLab, en `Settings -> CI/CD -> Secure files`, y la nombramos `infrastructure`.

![Secure Files](/img/gitlab/gitlab-secure-files.png)

```yml title=".gitlab-ci.yml" showLineNumbers
update_manifest:
  stage: gitops
  dependencies:
    - "docker_push"
  image:
    name: alpine:3.18
  variables:
    GIT_STRATEGY: none
    REPOSITORY: git@gitlab.com:Goldrak/osdo-infra.git
    FILE: docker-compose.yml
    EMAIL: hello@opensecdevops.com
    USER: OSDO

  before_script:
    - apk update
    - apk add --no-cache bash curl grep gawk openssh-client git
    - curl -s https://gitlab.com/gitlab-org/incubation-engineering/mobile-devops/download-secure-files/-/raw/main/installer | bash
    - SSH_PRIVATE_KEY=$(cat .secure_files/infrastructure)
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
    - mkdir -p ~/.ssh && chmod 700 ~/.ssh
    - ssh-keyscan -H gitlab.com >> ~/.ssh/known_hosts && chmod 644 ~/.ssh/known_hosts
    - git config --global user.email "${EMAIL}"
    - git config --global user.name "${USER}"

  script:
    - git clone ${REPOSITORY}
    - cd osdo-infra
    - |
      if git show-ref --verify --quiet "refs/remotes/origin/${CI_COMMIT_REF_SLUG}"; then
        git checkout ${CI_COMMIT_REF_SLUG}
      else
        git checkout -b ${CI_COMMIT_REF_SLUG} origin/master
      fi
    - IMAGE=$(grep -m 1 'image:' ${FILE} | awk '{print $2}')
    - IMAGE_TAG="${DOCKER_REGISTRY_URL}/osdo/osdo-app-gitlab-${REF_SLUG}:${CI_COMMIT_SHORT_SHA}@${DIGEST}"
    - sed -i "s|${IMAGE}|${IMAGE_TAG}|g" ${FILE}
    - git add ${FILE}
    - git commit -m "Update deployment image to version ${DIGEST}"
    - git push origin ${CI_COMMIT_REF_SLUG}
```

- **stage**: Define la etapa del pipeline como `gitops`, indicando que este job se encarga de actualizar la infraestructura siguiendo la metodología GitOps.
- **dependencies**: Especifica que este job depende del job `docker_push`, asegurando que la imagen Docker haya sido construida y subida antes de actualizar el manifiesto de despliegue.
- **image**: Utiliza la imagen oficial de Alpine 3.18 como entorno base para ejecutar los comandos necesarios, proporcionando un entorno ligero y eficiente.
- **variables**: Define variables de entorno para configurar el comportamiento del job:
  - `GIT_STRATEGY: none`: Evita que GitLab realice un checkout automático del repositorio, ya que el job clona manualmente el repositorio de infraestructura.
  - `REPOSITORY`: URL SSH del repositorio de infraestructura que se va a actualizar.
  - `FILE`: Nombre del archivo de manifiesto a modificar (por ejemplo, `docker-compose.yml`).
  - `EMAIL` y `USER`: Datos de usuario para configurar Git y firmar los commits.
- **before_script**: Prepara el entorno de ejecución:
  - Actualiza los paquetes e instala herramientas necesarias (`bash`, `curl`, `grep`, `gawk`, `openssh-client`, `git`).
  - Descarga e instala la utilidad para gestionar archivos seguros de GitLab CI.
  - Recupera la clave SSH privada almacenada como archivo seguro y la añade al agente SSH.
  - Configura el entorno SSH para permitir la conexión segura al repositorio remoto (añadiendo la clave pública de GitLab a `known_hosts`).
  - Configura el usuario y correo de Git para los commits.
- **script**: Ejecuta los pasos principales del job:
  - Clona el repositorio de infraestructura usando la clave SSH configurada.
  - Cambia al directorio del repositorio clonado.
  - Comprueba si existe la rama correspondiente al commit actual (`CI_COMMIT_REF_SLUG`); si existe, la utiliza, si no, crea una nueva rama basada en `origin/master`.
  - Extrae el nombre de la imagen actual del archivo de manifiesto.
  - Construye la nueva etiqueta de la imagen (`IMAGE_TAG`) utilizando variables del pipeline, incluyendo el digest y el commit.
  - Sustituye la referencia de la imagen en el manifiesto por la nueva imagen generada.
  - Añade y commitea el cambio en el archivo de manifiesto.
  - Realiza un push de la rama actualizada al repositorio remoto, completando así el flujo GitOps.

## GitHub

Para implementar GitOps en GitHub, el proceso es similar al de GitLab, pero adaptado a las herramientas y flujos de trabajo de GitHub. A continuación, se describen los pasos básicos para configurar GitOps en GitHub:

Para poder descargar el repositorio de GitHub y aplicar los cambios, podemos utilizar la herramienta `git` en la línea de comandos. Asegúrate de tener configuradas las credenciales de acceso adecuadas.

Creamos una clave SSH sin passphrase para autenticarte con GitHub y luego la añadimos a tu cuenta de GitHub.

```bash showLineNumbers
ssh-keygen -t ed25519 -C "gitlab-ci@tudominio.com" -f tl-gitops-key
# Esto creará:
#   - tl-gitops-key      (clave privada)
#   - tl-gitops-key.pub  (clave pública)
```

El contenido de `tl-gitops-key.pub` debe añadirse al repositorio destino en GitHub, haz clic en `Settings -> Deploy keys`, y agrega una nueva deploy key, marca `Allow write access` (muy importante para poder push).

![Deploy Key](/img/github/github-deploy-keys.png)

Guardamos la clave privada `tl-gitops-key` en el almacen de secretos de GitHub, en `Settings -> Secrets and variables -> Actions`, y la nombramos `infrastructure`.

![Private Key](/img/github/github-private-key.png)

```yaml title=".github/workflows/ci.yml" showLineNumbers
  update_manifest:
    name: Actualizar docker-compose.yml con nuevo digest
    runs-on: ubuntu-22.04
    needs: build_and_push
    env:
      REPOSITORY: git@github.com:Goldrak/osdo-infra.git
      FILE: docker-compose.yml
      EMAIL: hello@opensecdevops.com
      USER: OSDO
      BRANCH: main
      DIGEST: ${{ needs.build_and_push.outputs.DIGEST }}
      SSH_PRIVATE_KEY: ${{ secrets.INFRASTRUCTURE }}

    steps:
      - name: Instalación de utilidades (curl, grep, gawk, ssh-client)
        run: |
          sudo apt-get update -y
          sudo apt-get install -y curl grep gawk openssh-client

      - name: Configurar SSH con Deploy Key
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519

          # Agregamos GitHub a known_hosts para no solicitar confirmación
          ssh-keyscan -H github.com >> ~/.ssh/known_hosts
          chmod 644 ~/.ssh/known_hosts

          eval "$(ssh-agent -s)"
          ssh-add ~/.ssh/id_ed25519

      - name: Configurar usuario Git
        run: |
          git config --global user.email "${{ env.EMAIL }}"
          git config --global user.name "${{ env.USER }}"

      - name: Clonar el repositorio destino (osdo-infra)
        run: |
          git clone "$REPOSITORY"

      - name: Modificar docker-compose.yml con el nuevo digest
        run: |
          cd osdo-infra

          # 1. Extraemos la ruta actual de la imagen del FILE (primera coincidencia "image:")
          IMAGE=$(grep -m 1 "image:" ${FILE} | awk '{print $2}' | sed 's/\//\\\\\//g')
          echo "Ruta de imagen en el compose antes: ${IMAGE}"

          # 2. Reemplazamos la imagen por harbor.opensecdevops.com/osdo/osdo-app-gitlab@<digest>
          OBJETIVO="harbor.opensecdevops.com\/osdo\/osdo-app-gitlab@${{ env.DIGEST }}"
          echo "Reemplazando en ${FILE}: ${IMAGE} → ${OBJETIVO}"
          sed -i "s/${IMAGE}/${OBJETIVO}/g" ${FILE}

          # 3. Commit & push de los cambios
          git add ${FILE}
          git commit -m "GitOps: actualización de imagen a ${{ env.DIGEST }}"
          git push origin "${{ env.BRANCH }}"
```

- **name**: Define el nombre del job como `Actualizar docker-compose.yml con nuevo digest`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-22.04`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende del job `build_and_push`, por lo que no se ejecutará hasta que la construcción y subida de la imagen Docker haya finalizado correctamente.
- **env**: Define variables de entorno necesarias para la actualización del manifiesto y la autenticación:
  - **REPOSITORY**: URL SSH del repositorio de infraestructura donde se actualizará el manifiesto.
  - **FILE**: Nombre del archivo de manifiesto a modificar (por ejemplo, `docker-compose.yml`).
  - **EMAIL** y **USER**: Datos de usuario para configurar Git y firmar los commits.
  - **BRANCH**: Rama donde se realizará el push de los cambios (ajustable según la rama principal del repositorio).
  - **DIGEST**: Digest de la imagen Docker generado en el job anterior, que se utilizará para actualizar la referencia de la imagen en el manifiesto.
  - **SSH_PRIVATE_KEY**: Clave privada SSH almacenada como secreto, utilizada para autenticar el acceso al repositorio.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Instalación de utilidades**: Instala herramientas necesarias como `curl`, `grep`, `gawk` y `openssh-client` para el procesamiento de archivos y la conexión SSH.
  - **Configurar SSH con Deploy Key**: Configura el entorno SSH utilizando la clave privada proporcionada, añade GitHub a los hosts conocidos y activa el agente SSH para permitir operaciones seguras con el repositorio remoto.
  - **Configurar usuario Git**: Establece el usuario y correo electrónico globales de Git para firmar los commits realizados por el workflow.
  - **Clonar el repositorio destino**: Clona el repositorio de infraestructura usando la clave SSH configurada, asegurando acceso de escritura para poder actualizar el manifiesto.
  - **Modificar docker-compose.yml con el nuevo digest**: Accede al repositorio clonado, extrae la ruta actual de la imagen en el archivo de manifiesto y la reemplaza por la nueva imagen con el digest actualizado, asegurando que el despliegue utilice la versión correcta de la imagen.
  - **Commit & push de los cambios**: Realiza un commit con el cambio en el manifiesto y lo sube a la rama especificada del repositorio remoto, completando así el flujo GitOps y permitiendo que el sistema de despliegue detecte y aplique la actualización automáticamente.
