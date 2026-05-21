---
title: Preparación de Node.js
description: Cómo gestionar las dependencias de Node.js en la etapa de preparación del pipeline de CI/CD utilizando GitLab, GitHub y Jenkins.
sidebar_label: Node.js
pagination_label: Preparación de Node.js
---

En la etapa de preparación de Node, es fundamental gestionar las dependencias de manera eficiente antes de avanzar a las fases posteriores del ciclo de CI/CD. Aquí se realizan las siguientes preparaciones clave:

**Instalación de todas las dependencias (desarrollo y producción):** En esta etapa se instalan todas las dependencias necesarias para el proyecto, tanto las de producción como las de desarrollo. Esto garantiza que el proyecto sea funcional en el entorno de construcción y que todas las pruebas posteriores puedan ejecutarse correctamente.

## GitLab

Como se ha mencionado, se configura un job para la gestión de dependencias.

Para preparar las dependencias necesarias en la etapa de pruebas, se crea un stage que comparte la caché de GitLab Runner con el resto de los stages, lo que mejora la eficiencia del pipeline. En este paso no se generan artefactos, ya que no será necesario descargarlos posteriormente. Utilizar la caché de GitLab Runner evita la descarga repetida de las mismas dependencias en cada etapa del pipeline, acelerando el proceso de construcción y pruebas.

El siguiente stage, llamado `.dependencies_cache`, gestiona la caché de dependencias para el proyecto en GitLab CI/CD.

```yml title=".gitlab-ci.yml" showLineNumbers
.dependencies_cache:
  cache:
    key: $CI_PROJECT_NAME-osdo
    paths:
      - .npm/
      - node_modules/
      - public/build/
```

El punto delante del nombre de un stage en GitLab CI/CD, como `.dependencies_cache`, es una convención utilizada para indicar que se trata de un stage oculto o interno, que no se ejecuta de forma independiente, sino que se utiliza como parte de otros stages o para tareas específicas de configuración o preparación en el pipeline.

En este caso, la caché se configura con la clave `$CI_PROJECT_NAME-osdo`, única para cada proyecto, y se utiliza para identificar y recuperar la caché asociada a ese proyecto.

Los elementos almacenados en la caché se especifican en la lista bajo `paths`. En este ejemplo, se incluyen:

- **.npm/**: Directorio utilizado por npm para almacenar los paquetes descargados.
- **node_modules/**: Carpeta donde se encuentran las dependencias y módulos de Node.js requeridos por la aplicación.
- **public/build/**: Contiene archivos generados en el proceso de construcción de la aplicación, como recursos estáticos.

Una vez configurada la caché, se puede usar en el stage de preparación:

```yml title=".gitlab-ci.yml" showLineNumbers
npm:
  image: node@sha256:f4c96a28c0b2d8981664e03f461c2677152cd9a756012ffa8e2c6727427c2bda
  stage: preparation
  needs:
    - composer
  extends: .dependencies_cache
  before_script:
    - npm ci --cache .npm --prefer-offline
  script:
    - npm run build
```

El stage `npm` instala las dependencias de Node utilizando npm durante la etapa de preparación en el pipeline de GitLab CI/CD.

- **image**: Especifica la imagen de Docker utilizada para ejecutar este stage.
- **stage**: Define la etapa a la que pertenece este job.
- **needs**: Indica que depende del job `composer`, lo que puede ser útil en proyectos que combinan tecnologías como Laravel + InertiaJS + Vue.
- **extends**: Hereda la configuración de `.dependencies_cache` para compartir la caché de dependencias.
- **before_script**: Ejecuta el comando `npm ci --cache .npm --prefer-offline` para instalar las dependencias de Node.  
  - **ci**: Instala las dependencias según el archivo de bloqueo sin modificarlo.
  - **--cache .npm**: Utiliza la caché local para almacenar los paquetes descargados.
  - **--prefer-offline**: Prefiere instalar los paquetes desde la caché local si están disponibles.
- **script**: Ejecuta el comando `npm run build` para construir la aplicación, según lo definido en el archivo `package.json`.

Esta configuración permite optimizar la gestión de dependencias y acelerar el pipeline, asegurando que todas las etapas posteriores cuenten con los recursos necesarios.

## GitHub

Para GitHub Actions, se utiliza un workflow que se ejecuta en la etapa de preparación para instalar las dependencias de Node.js. A continuación, se muestra un ejemplo de cómo configurar este workflow:

```yml title=".github/workflows/ci.yml" showLineNumbers
  npm:
    name: preparation npm ci & build
    runs-on: ubuntu-latest
    needs: composer
    steps:
      - uses: actions/checkout@v4
      - name: Recuperar vendor directory
        uses: actions/download-artifact@v4
        with:
          name: vendor
          path: vendor/
      - name: cache node_modules
        uses: actions/cache@v4
        with:
          path: |
            node_modules/
          key: ${{ runner.os }}-osdo-${{ hashFiles('package-lock.json') }}

      - name: Setup Node  
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: npm ci
        run: npm ci
      - name: npm build
        run: npm run build
      - name: Guardar node_modules
        uses: actions/upload-artifact@v4
        with:
          name: node_modules
          path: |
            node_modules/
          retention-days: 1
      - name: Guardar public/build
        uses: actions/upload-artifact@v4
        with:
          name: public
          path: |
            public/
          retention-days: 1
```

En este workflow de GitHub Actions, se realizan las siguientes acciones:

- **name**: Se define el nombre del job como "preparation npm ci & build".
- **runs-on**: Especifica el sistema operativo en el que se ejecutará el job, en este caso `ubuntu-latest`.
- **needs**: Indica que el job depende del job `composer`, lo que garantiza que las dependencias de PHP (y otros recursos del backend) estén disponibles antes de instalar las dependencias de Node.js.
- **steps**: Se definen los pasos a seguir en el job.
  - **Clonar repositorio**: Utiliza la acción `actions/checkout@v4` para clonar el repositorio y acceder al código fuente.
  - **Descargar directorio vendor**: Emplea la acción `actions/download-artifact@v4` para recuperar el directorio `vendor` guardado previamente por el job de Composer.
  - **Configurar caché para node_modules**: Utiliza la acción `actions/cache@v4` para almacenar en caché el directorio `node_modules`, aprovechando una clave basada en el hash del archivo `package-lock.json`, lo que evita la reinstalación redundante de dependencias.
  - **Setup Node.js**: Configura la versión 20 de Node.js mediante la acción `actions/setup-node@v4`.
  - **Instalar dependencias de Node.js**: Ejecuta `npm ci` para instalar las dependencias según el archivo `package-lock.json`.
  - **Compilar la aplicación**: Ejecuta `npm run build`, que construye la aplicación conforme a lo definido en el archivo `package.json`.
  - **Guardar directorios como artefactos**: Utiliza la acción `actions/upload-artifact@v4` para almacenar los directorios `node_modules` y `public/build` como artefactos, facilitando su uso en etapas posteriores del pipeline.

Esta configuración permite gestionar de manera eficiente las dependencias de Node.js en el pipeline de GitHub Actions, asegurando que todas las etapas posteriores cuenten con los recursos necesarios para la ejecución de pruebas y despliegues.

## Jenkins

Para Jenkins, se utiliza un pipeline que se ejecuta en la etapa de preparación para instalar las dependencias de Node.js. A continuación, se muestra un ejemplo de cómo configurar este pipeline:

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
                node:lts \
                npm ci --cache .npm
            """
            sh """
            docker run --rm \
                -u ${uid}:${gid} \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                node:lts \
                npm run build
            """
                        
        stash name: 'deps', includes: 'node_modules/**,public/build/**'
          }
    }
}
```

En este pipeline de Jenkins, se realizan las siguientes acciones:

- **stage("Preparation")**: Define la etapa de preparación del pipeline.
- **steps**: Se definen los pasos a seguir en la etapa de preparación.
  - **script**: Permite ejecutar un bloque de código Groovy.
  - **Obtener UID y GID**: Utiliza comandos `sh` para obtener el UID y GID del usuario actual, lo que ayuda a evitar problemas de permisos al ejecutar contenedores Docker.
  - **Instalar dependencias de Node.js**: Ejecuta un contenedor Docker con la imagen `node:lts` para instalar las dependencias de Node.js utilizando `npm ci --cache .npm`. Esto asegura que las dependencias se instalen correctamente en el entorno de construcción.
  - **Compilar la aplicación**: Ejecuta otro contenedor Docker para compilar la aplicación con `npm run build`.
  - **Stash**: Utiliza el comando `stash` para almacenar los directorios `node_modules` y `public/build` como un stash llamado `deps`, lo que permite su uso en etapas posteriores del pipeline.

Esta configuración permite gestionar de manera eficiente las dependencias de Node.js en el pipeline de Jenkins, asegurando que todas las etapas posteriores cuenten con los recursos necesarios para la ejecución de pruebas y despliegues.

## Conclusión

La preparación de Node.js en un pipeline de CI/CD es esencial para garantizar que todas las dependencias estén correctamente instaladas y que la aplicación esté lista para ser probada y desplegada. En este documento se ha explicado cómo configurar la instalación de dependencias en GitLab, GitHub y Jenkins, destacando la importancia de utilizar cachés y artefactos para optimizar el proceso.

Esta etapa de preparación contribuye a mejorar la eficiencia del pipeline y asegura que el entorno de construcción sea coherente y reproducible, lo que resulta clave para el éxito de cualquier proyecto de software. Al seguir estas prácticas recomendadas, se puede lograr un flujo de trabajo más ágil y confiable en el desarrollo y despliegue de aplicaciones basadas en Node.js.
