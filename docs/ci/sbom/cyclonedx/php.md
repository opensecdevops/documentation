---
title: CycloneDX PHP
description: Cómo generar un Software Bill of Materials (SBOM) en proyectos PHP utilizando CycloneDX y enviarlo a Dependency-Track.
sidebar_label: PHP
keywords:
  - CycloneDX
  - PHP
  - SBOM
  - Dependency-Track
  - GitLab
  - GitHub
  - Jenkins
---

Para instalar [CycloneDX en PHP con Composer](https://github.com/CycloneDX/cyclonedx-php-composer), primero es necesario contar con PHP y [Composer](https://getcomposer.org/) instalados en el sistema. A continuación, se indican los pasos a seguir:

- Abrir una terminal o línea de comandos.
- Navegar hasta la raíz del proyecto PHP, donde se encuentra el archivo `composer.json`.
- Ejecutar el siguiente comando para agregar CycloneDX como dependencia de desarrollo:

```bash
composer require --dev cyclonedx/cyclonedx-php-composer
```

- Para permitir el uso del plugin CycloneDX, se debe agregar la siguiente configuración en el archivo `composer.json`:

```json
    "config": {
        "allow-plugins": {
            "cyclonedx/cyclonedx-php-composer": true
        }
    }
```

- Una vez configurado, se puede ejecutar el análisis de dependencias mediante CycloneDX con el siguiente comando:

```bash
composer CycloneDX:make-sbom --output-file=sbom.json --output-format=json
```

## GitLab

A continuación se muestra cómo integrar la generación del SBOM en el pipeline de CI para que se ejecute en cada commit y se envíe a la plataforma de gestión de dependencias Dependency-Track, utilizando el script `dependency-track.sh`:

```yml title=".gitlab-ci.yml" showLineNumbers
sbom_scan_php:
  stage: sbom_scan
  image: harbor.opensecdevops.com/osdo/php-ci@sha256:84efd71c4e19ee63e1a08ef6884b6016182af23e35b9a6cba6fe3cf647f665fe
  dependencies: ['composer']
  variables:
    COMPOSER_ALLOW_SUPERUSER: 1
    DT_PROJECT_ID: b869e154-fa10-401b-8310-63025fe6c286
    REPORT: php-sbom.json
  extends: .dependencies_cache
  script:
    - composer CycloneDX:make-sbom --output-file=${REPORT} --output-format=json
    - sh .gitlab-ci/dependency-track.sh 
  allow_failure: true
  artifacts:
    expire_in: 1 days
    paths:
      - ${REPORT}
    reports:
      cyclonedx: ${REPORT}
```

- **image**: Utiliza una imagen de contenedor específica que incluye las herramientas necesarias para generar el SBOM en proyectos PHP. El uso de un hash sha256 garantiza la consistencia de la imagen utilizada.
- **dependencies**: Indica que este job depende del job llamado `composer`, asegurando que las dependencias del proyecto estén instaladas antes de generar el SBOM.
- **variables**: Define variables de entorno necesarias para el proceso.
  - **COMPOSER_ALLOW_SUPERUSER**: Permite que Composer se ejecute con privilegios de superusuario dentro del contenedor.
  - **DT_PROJECT_ID**: Identificador del proyecto en Dependency-Track.
  - **REPORT**: Nombre del archivo donde se generará el SBOM.
- **cache**: Configura una caché para la carpeta `vendor/`, utilizando como clave la rama actual, lo que acelera los siguientes pipelines al reutilizar dependencias ya instaladas.
- **script**: Ejecuta los comandos principales del job:
  - Genera el archivo SBOM en formato JSON usando el plugin CycloneDX para Composer.
  - Ejecuta el script que envía el SBOM generado a Dependency-Track.
- **allow_failure**: Permite que este job falle sin afectar el resultado global del pipeline, útil si el análisis SBOM es informativo y no crítico para el despliegue.
- **artifacts**: Especifica que el archivo generado debe conservarse como artefacto durante 1 día, permitiendo su revisión o uso en otros jobs.

## GitHub

```yaml title=".github/workflows/ci.yml" showLineNumbers
sbom_scan_php:
    name: sbom_scan_php
    runs-on: ubuntu-latest
    needs: composer
    env:
      DT_PROJECT_ID: b869e154-fa10-401b-8310-63025fe6c286
      REPORT: 'sbom-php.json'
    steps:
      - name: Clonar
        uses: actions/checkout@v4
      
      - name: Recuperar vendor
        uses: actions/download-artifact@v4
        with:
          name: vendor
          path: vendor/
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none
          tools: composer

      - name: Generar SBOM PHP
        id: sbom_php
        run: |
          composer CycloneDX:make-sbom --output-file=${REPORT} --output-format=json

      - name: Enviar a Dependency track
        id: send_sbom_php
        run: |
          sh .github/scripts/dependency-track.sh
```

- **name**: Define el nombre del job como `sbom_scan_php`, facilitando su identificación dentro del workflow.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende del job `composer`, por lo que no se ejecutará hasta que la instalación de dependencias haya finalizado correctamente.
- **env**: Define variables de entorno necesarias para el proceso.
  - **DT_PROJECT_ID**: Identificador del proyecto en Dependency-Track.
  - **REPORT**: Nombre del archivo donde se generará el SBOM.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Clonar**: Usa la acción `actions/checkout@v4` para clonar el repositorio.
  - **Recuperar vendor**: Usa la acción `actions/download-artifact@v4` para recuperar el directorio `vendor/` previamente generado, asegurando que las dependencias estén disponibles para el análisis.
  - **Setup PHP**: Usa la acción `shivammathur/setup-php@v2` para instalar PHP 8.2 y Composer en el runner, configurando el entorno necesario para ejecutar Composer y el plugin CycloneDX.
  - **Generar SBOM PHP**: Ejecuta el comando para generar el archivo SBOM en formato JSON usando el plugin CycloneDX.
  - **Enviar a Dependency track**: Ejecuta el script para enviar el archivo SBOM generado a Dependency-Track para su análisis y gestión.

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
stage('SBOM Scan PHP') {
    environment {
        DT_SERVER       = "https://dtrack-api.example.com"
        DT_PROJECT_ID   = "3e6d6c0b-d404-474f-a29f-86c757f90657"
        REPORT          = "sbom-php.json"
    }
    steps {
        unstash 'deps'
        sh """docker run --rm \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                composer:2.5 CycloneDX:make-sbom --output-file=${REPORT} --output-format=json"""
          sh 'chmod +x .jenkis-ci/dependency-track.sh'
        withCredentials([string(credentialsId: 'DT_API_KEY', variable: 'DT_API_KEY')]) {
            sh './.jenkis-ci/dependency-track.sh'
        }
        archiveArtifacts artifacts: "${env.REPORT}", fingerprint: true
    }
}
```

- **environment:**  
  Define variables de entorno necesarias para el proceso:
  - `DT_SERVER`: URL del servidor de Dependency-Track donde se enviará el SBOM.
  - `DT_PROJECT_ID`: Identificador del proyecto en Dependency-Track.
  - `REPORT`: Nombre del archivo donde se generará el SBOM.
- **unstash 'deps':**  
  Recupera las dependencias previamente almacenadas en una etapa anterior del pipeline, asegurando que estén disponibles para el análisis.

- `sh docker run ... composer:2.5 CycloneDX:make-sbom`:  
  Ejecuta un contenedor Docker con la imagen oficial de Composer para generar el archivo SBOM usando el plugin CycloneDX. Se monta el workspace del job en el contenedor para que tenga acceso al código y las dependencias.
- `sh 'chmod +x .jenkis-ci/dependency-track.sh'`:  
  Da permisos de ejecución al script `dependency-track.sh`.
- `withCredentials([string(credentialsId: 'DT_API_KEY', variable: 'DT_API_KEY')])`:  
  Utiliza credenciales almacenadas en Jenkins (API key para Dependency-Track) y las expone como variable de entorno para el script.
- `sh './.jenkis-ci/dependency-track.sh'`:  
  Ejecuta el script encargado de enviar el archivo SBOM generado a Dependency-Track.
- `archiveArtifacts artifacts: "${env.REPORT}", fingerprint: true`:  
  Guarda el archivo SBOM como artefacto del build, permitiendo su consulta posterior y asegurando trazabilidad mediante fingerprint.

Una vez cargado el archivo SBOM en la plataforma Dependency-Track, es posible visualizar las dependencias, su estado de actualización y las vulnerabilidades conocidas.

<div style={{textAlign: 'center'}}>
![Lista dependencias](/img/dependency-track/sbom_load.png)
</div>
