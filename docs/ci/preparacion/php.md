---
title: Preparación de PHP
description: Preparación de PHP en pipelines de CI/CD
sidebar_label: PHP
pagination_label: Preparación de PHP
---

En la etapa de preparación de PHP, es importante gestionar las dependencias de manera eficiente antes de avanzar a las fases posteriores del ciclo de CI/CD. Aquí se realizan dos preparaciones principales:

**Instalación de todas las dependencias (desarrollo y producción):** En esta etapa se instalan todas las dependencias necesarias para el proyecto, tanto las de producción como las de desarrollo. Esto garantiza que el proyecto sea funcional en el entorno de construcción.

**Instalación de dependencias de producción para la creación de imágenes optimizadas:** Para optimizar la construcción de imágenes de contenedor y reducir su tamaño, se realiza una preparación adicional centrada en instalar solo las dependencias de producción. Separar estas dependencias permite crear imágenes de contenedor más ligeras, eliminando la inclusión de dependencias de desarrollo en los entornos productivos.

## GitLab

Como se mencionó anteriormente, se configuran dos jobs. El primero estará en la etapa de preparación del pipeline y se llamará `composer`. El segundo estará en la etapa de `build` y se llamará `composer_prod`.

### Todas las dependencias {#gitlab-preparacion-todas-las-dependencias}

Para preparar las dependencias necesarias en la etapa de pruebas, se crea un stage que comparte la caché de GitLab Runner con el resto de los stages, lo que mejora la eficiencia del pipeline. En este paso no se generarán artefactos, ya que no será necesario descargarlos posteriormente. Optimizar la etapa de preparación es importante para asegurar que las pruebas posteriores se ejecuten correctamente y sin problemas de dependencias faltantes. Al utilizar la caché de GitLab Runner, se evita la descarga repetida de las mismas dependencias en cada etapa del pipeline, acelerando el proceso de construcción y pruebas.

El siguiente stage, llamado `.dependencies_cache`, gestiona la caché de dependencias para el proyecto en GitLab CI/CD.

```yml title=".gitlab-ci.yml" showLineNumbers
.dependencies_cache:
  cache:
    key: $CI_PROJECT_NAME-osdo
    paths:
      - vendor/
```

El punto delante del nombre de un stage en GitLab CI/CD, como `.dependencies_cache`, es una convención utilizada para indicar que se trata de un stage oculto o interno, que no se ejecuta de forma independiente, sino que se utiliza como parte de otros stages o para tareas específicas de configuración, preparación o limpieza en el pipeline.

En este caso, la caché se configura con la clave `$CI_PROJECT_NAME-osdo`, única para cada proyecto, y se utiliza para identificar y recuperar la caché asociada a ese proyecto.

Los elementos almacenados en la caché se especifican en la lista bajo `paths`. En este ejemplo, se incluye:

- **vendor/**: Directorio utilizado en proyectos PHP para almacenar las dependencias gestionadas por Composer.

Una vez configurada la caché, se puede usar en el stage de preparación:

```yml title=".gitlab-ci.yml" showLineNumbers
composer:
  image: harbor.opensecdevops.com/osdo/php-ci@sha256:c4d27b1286fb998148f7439533f83c2ca40f0358bbda6009a6a3f069e14086c0
  stage: preparation
  script:
      - composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts
  extends: .dependencies_cache
```

El stage `composer` instala las dependencias de PHP utilizando Composer durante la etapa de preparación en el pipeline de GitLab CI/CD.

- **image**: Especifica la imagen de Docker utilizada para ejecutar este stage.
- **stage**: Define la etapa a la que pertenece este job.
- **script**: Comandos ejecutados en este stage. En este caso, se utiliza `composer install` con los siguientes parámetros:
  - **--prefer-dist**: Prefiere descargar las dependencias desde archivos comprimidos.
  - **--no-ansi**: Evita la salida de caracteres de control ANSI.
  - **--no-interaction**: Ejecuta Composer en modo no interactivo.
  - **--no-progress**: Deshabilita la visualización del progreso.
  - **--no-scripts**: Evita la ejecución de scripts definidos en los paquetes de las dependencias.
- **extends**: Hereda la configuración de `.dependencies_cache` para compartir la caché de dependencias.

### Dependencias de producción {#gitlab-preparacion-dependencias-produccion}

```yml title=".gitlab-ci.yml" showLineNumbers
composer_prod:
  image: harbor.opensecdevops.com/osdo/php-ci@sha256:c4d27b1286fb998148f7439533f83c2ca40f0358bbda6009a6a3f069e14086c0
  stage: build
  script:
      - composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts --no-plugins --optimize-autoloader  --no-dev 
  artifacts:
    paths:
      - vendor/
```

El stage `composer_prod` instala las dependencias de producción de PHP utilizando Composer durante la etapa de construcción en el pipeline de GitLab CI/CD. Las diferencias principales respecto al stage anterior son:

- **stage**: Pertenece a la etapa de construcción, ejecutándose después de la preparación y las pruebas.
- **script**: Incluye parámetros adicionales para optimizar las dependencias en producción:
  - **--no-scripts**: Evita la ejecución de scripts definidos en los paquetes.
  - **--no-plugins**: Deshabilita la ejecución de complementos durante la instalación.
  - **--optimize-autoloader**: Optimiza el cargador automático de Composer para mejorar el rendimiento en producción.
  - **--no-dev**: Excluye las dependencias de desarrollo.
- **artifacts**: Define los artefactos que se conservarán tras la ejecución de este stage, en este caso la carpeta `vendor/`, que contiene las dependencias de producción y se utilizará en el job que construye la imagen.

## GitHub

En GitHub Actions, la preparación de PHP se realiza mediante un job que instala las dependencias necesarias utilizando Composer. Este proceso se divide en dos partes: una para instalar todas las dependencias y otra para instalar solo las de producción.

### Todas las dependencias {#github-preparacion-todas-las-dependencias}

```yaml title=".github/workflows/ci.yml" showLineNumbers
  composer:
    name: preparation composer install
    runs-on: ubuntu-latest
    steps:  
      - name: Clonar repositorio
        uses: actions/checkout@v4
      
      - name: cache directorios comunes
        uses: actions/cache@v4
        with:
          path: vendor
          key: ${{ runner.os }}-osdo-${{ hashFiles('composer.lock') }}
      - name: Dar al runner la propiedad del workspace
        run: sudo chown -R "$(id -u):$(id -g)" "${GITHUB_WORKSPACE}"

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none
          tools: composer
 
      - name: Install composer dependencies
        run: composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts

      - name: Guardar vendor directory
        uses: actions/upload-artifact@v4
        with:
          name: vendor
          path: vendor/
          retention-days: 1
```

En este job, se instala Composer y se preparan las dependencias del proyecto. Los pasos son los siguientes:

- **name**: Define el nombre del job como "preparation composer install".
- **runs-on**: Especifica el sistema operativo en el que se ejecutará el job, en este caso `ubuntu-latest`.
- **steps**: Enumera los pasos a seguir en el job.
  - **Clonar repositorio**: Utiliza la acción `actions/checkout@v4` para clonar el repositorio en el runner.
  - **Cache directorios comunes**: Utiliza la acción `actions/cache@v4` para almacenar en caché el directorio `vendor/`, lo que mejora la eficiencia del pipeline al evitar descargas repetidas de las mismas dependencias.
  - **Dar al runner la propiedad del workspace**: Cambia la propiedad del directorio de trabajo del runner para evitar problemas de permisos.
  - **Setup PHP**: Utiliza la acción `shivammathur/setup-php@v2` para configurar PHP en la versión especificada (8.2 en este caso).
  - **Install composer dependencies**: Ejecuta `composer install` con los parámetros `--prefer-dist`, `--no-ansi`, `--no-interaction`, `--no-progress` y `--no-scripts` para instalar las dependencias del proyecto.
  - **Guardar vendor directory**: Utiliza la acción `actions/upload-artifact@v4` para guardar el directorio `vendor/` como un artefacto llamado "vendor", que se utilizará en etapas posteriores del pipeline.

### Dependencias de producción {#github-preparacion-dependencias-produccion}

```yaml title=".github/workflows/ci.yml" showLineNumbers
  composer_prod:
    name: build composer install
    runs-on: ubuntu-latest
    needs: composer
    steps:
      - name: Clonar repositorio
        uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none
          tools: composer

      - name: Descargar vendor directory
        uses: actions/download-artifact@v4
        with:
          name: vendor

      - name: Install composer dependencies for production
        run: composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts --no-plugins --optimize-autoloader --no-dev

      - name: Guardar vendor directory
        uses: actions/upload-artifact@v4
        with:
          name: vendor
          path: vendor/
          retention-days: 1
```

En este job, se instalan únicamente las dependencias de producción utilizando Composer. Los pasos son similares al job anterior, pero con algunas diferencias clave:

- **name**: Define el nombre del job como "build composer install".
- **runs-on**: Especifica el sistema operativo en el que se ejecutará el job, en este caso `ubuntu-latest`.
- **needs**: Indica que este job depende del job `composer`, asegurando que las dependencias se instalen antes de ejecutar este job.
- **Download vendor directory**: Utiliza la acción `actions/download-artifact@v4` para descargar el artefacto "vendor" creado en el job anterior, que contiene las dependencias instaladas.
- **Install composer dependencies for production**: Ejecuta `composer install` con los parámetros `--prefer-dist`, `--no-ansi`, `--no-interaction`, `--no-progress`, `--no-scripts`, `--no-plugins`, `--optimize-autoloader` y `--no-dev` para instalar únicamente las dependencias de producción, optimizando el cargador automático y excluyendo las dependencias de desarrollo.
- **Guardar vendor directory**: Utiliza la acción `actions/upload-artifact@v4` para guardar el directorio `vendor/` como un artefacto llamado "vendor", que se utilizará en la construcción de la imagen del contenedor.

## Jenkins

En Jenkins, la preparación de PHP se realiza mediante un stage que instala las dependencias necesarias utilizando Composer. Este proceso se divide en dos partes: una para instalar todas las dependencias y otra para instalar solo las de producción.

### Todas las dependencias {#jenkins-preparacion-todas-las-dependencias}

```groovy title="Jenkinsfile" showLineNumbers
stage("Preparation") {
    steps {
        script {
            def uid = sh(returnStdout: true, script: 'id -u').trim()
            def gid = sh(returnStdout: true, script: 'id -g').trim()
            echo "→ Ejecutaré Docker como UID=${uid} GID=${gid}"


            sh """
            docker run --rm \
                -u ${uid}:${gid} \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                harbor.opensecdevops.com/osdo/php-ci@sha256:84efd71c4e19ee63e1a08ef6884b6016182af23e35b9a6cba6fe3cf647f665fe composer install --no-interaction --prefer-dist --ansi
            """
  
        stash name: 'deps', includes: 'vendor/**'
          }
    }
}
```

En este stage, se ejecuta un contenedor Docker con la imagen de PHP y Composer para instalar todas las dependencias del proyecto. Los pasos son los siguientes:

- **Definición del stage**: Se crea un stage llamado "Preparation" en el pipeline de Jenkins.
- **Script de shell**: Se utiliza un script de shell para ejecutar comandos dentro del contenedor Docker.
- **Obtención de UID y GID**: Se obtienen el UID y GID del usuario actual para ejecutar el contenedor con los permisos adecuados.
- **Ejecución de Docker**: Se ejecuta un contenedor Docker con la imagen de PHP y Composer, montando el directorio del workspace del job en `/app` dentro del contenedor. Se instala Composer con los parámetros `--no-interaction`, `--prefer-dist` y `--ansi`.
- **Stash de dependencias**: Se guarda el directorio `vendor/` en un stash llamado `deps`, que se utilizará en etapas posteriores del pipeline.

### Dependencias de producción {#jenkins-preparacion-dependencias-produccion}

```groovy title="Jenkinsfile" showLineNumbers
stage("Build") {
    steps {
        script {
            unstash 'deps'
            def uid = sh(returnStdout: true, script: 'id -u').trim()
            def gid = sh(returnStdout: true, script: 'id -g').trim()
            echo "→ Ejecutaré Docker como UID=${uid} GID=${gid}"

            sh """
            docker run --rm \
                -u ${uid}:${gid} \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                harbor.opensecdevops.com/osdo/php-ci@sha256:84efd71c4e19ee63e1a08ef6884b6016182af23e35b9a6cba6fe3cf647f665fe composer install --no-interaction --prefer-dist --ansi --no-dev --optimize-autoloader
            """

            stash name: 'deps', includes: 'vendor/**'
        }
    }
}
```

En este stage, se instalan únicamente las dependencias de producción utilizando Composer. Los pasos son similares al stage anterior, pero con algunas diferencias clave:

- **Definición del stage**: Se crea un stage llamado "Build" en el pipeline de Jenkins.
- **Deshacer stash**: Se recupera el stash `deps` que contiene las dependencias instaladas previamente. Con esto, se asegura que las dependencias de producción se instalen sobre las ya existentes, sin necesidad de volver a descargarlas.
- **Ejecución de Docker**: Se ejecuta un contenedor Docker con la imagen de PHP y Composer, montando el directorio del workspace del job en `/app` dentro del contenedor.
- **Instalación de dependencias**: Se instala Composer con los parámetros `--no-interaction`, `--prefer-dist`, `--ansi`, `--no-dev` (para excluir las dependencias de desarrollo) y `--optimize-autoloader` (para optimizar el cargador automático).
- **Stash de dependencias**: Se guarda el directorio `vendor/` en un stash llamado `deps`, que se utilizará en la construcción de la imagen del contenedor.

## Conclusión

La preparación de PHP en un pipeline de CI/CD es un paso importante para garantizar que las dependencias del proyecto estén correctamente instaladas y optimizadas. Tanto en GitLab, GitHub Actions como en Jenkins, se implementan estrategias para gestionar las dependencias de manera eficiente, separando las de desarrollo y producción para optimizar el rendimiento y reducir el tamaño de las imágenes de contenedor.

Esta preparación asegura que el entorno de construcción esté listo para las pruebas y la implementación, y mejora la eficiencia del pipeline al utilizar cachés y stashes para evitar descargas innecesarias. Al seguir estas prácticas, se facilita un flujo de trabajo más ágil y confiable en el desarrollo de aplicaciones PHP.
