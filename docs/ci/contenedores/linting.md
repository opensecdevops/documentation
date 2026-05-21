---
title: Linting
description: Guía para realizar linting de Dockerfile utilizando Checkov, con integración en CI/CD de GitLab y DefectDojo.
---

El **linting** es el proceso de analizar automáticamente el código fuente para identificar errores, malas prácticas, vulnerabilidades y desviaciones respecto a estándares definidos. En el contexto de los archivos `Dockerfile`, el linting ayuda a garantizar que las imágenes de contenedor se construyan siguiendo buenas prácticas de seguridad, eficiencia y mantenibilidad. Aplicar linting en los `Dockerfile` permite detectar configuraciones inseguras, comandos obsoletos, errores de sintaxis y otros problemas que pueden afectar la calidad y seguridad de las imágenes generadas.

## ¿Por qué es importante el linting en Dockerfile?

- **Prevención de vulnerabilidades:** Detecta configuraciones inseguras o potencialmente peligrosas antes de que lleguen a producción.
- **Consistencia:** Promueve el uso de patrones y convenciones comunes en todos los proyectos.
- **Mantenibilidad:** Facilita la revisión y el mantenimiento de los archivos Dockerfile, reduciendo errores humanos.
- **Eficiencia:** Ayuda a optimizar la construcción de imágenes, evitando capas innecesarias o comandos redundantes.

## Checkov

[Checkov](https://www.checkov.io/) es una herramienta de código abierto desarrollada por Bridgecrew (ahora parte de Prisma Cloud) para el análisis estático y la validación de la seguridad en infraestructuras como código (IaC), incluyendo archivos `Dockerfile`, Terraform, CloudFormation, Kubernetes, entre otros.

### Características principales

- **Análisis de seguridad:** Detecta configuraciones inseguras, malas prácticas y vulnerabilidades conocidas en archivos Dockerfile y otros recursos de IaC.
- **Soporte para múltiples tecnologías:** Además de Dockerfile, Checkov soporta Terraform, Kubernetes, CloudFormation, ARM, Serverless y más.
- **Reglas personalizables:** Permite definir y extender reglas de seguridad según las necesidades del equipo o la organización.
- **Integración CI/CD:** Se integra fácilmente en pipelines de integración y despliegue continuo, permitiendo automatizar el análisis en cada cambio.
- **Reportes detallados:** Genera informes en varios formatos (CLI, JSON, JUnit, SARIF) para facilitar la revisión y la integración con otras herramientas.
- **Actualización constante:** La comunidad y el equipo de Bridgecrew mantienen y actualizan las reglas para cubrir nuevas amenazas y mejores prácticas.

Utilizar Checkov para el linting de Dockerfile permite elevar el nivel de seguridad y calidad en la construcción de imágenes, integrando el análisis en los flujos de trabajo de desarrollo y despliegue de manera sencilla y automatizada.

## GitLab

```yml title=".gitlab-ci.yml" showLineNumbers
docker_checkov:
  stage: test
  variables:
    REPORT: "checkov.json"
  image:
    name: bridgecrew/checkov:latest
    entrypoint:
      - '/usr/bin/env'
      - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
  script:
    - checkov --directory=docker --output=cli --output=json --output-file-path=console,${REPORT} --framework=dockerfile
  artifacts:
    paths:
      - ${REPORT}
```

- **stage**: Define la etapa del pipeline en la que se ejecuta el análisis, en este caso `test`, para validar la seguridad y calidad de los Dockerfile antes de continuar con el flujo de CI/CD.
- **variables**: Configura variables de entorno necesarias para el proceso:
  - **REPORT**: Especifica el nombre del archivo donde se almacenará el reporte generado por Checkov (`checkov.json`).
- **image**: Utiliza la imagen oficial de Checkov (`bridgecrew/checkov:latest`) desde DockerHub, asegurando que la herramienta esté disponible y actualizada en el entorno de ejecución.
- **entrypoint**: Se redefine el entrypoint para establecer la variable de entorno `PATH` correctamente, permitiendo la ejecución de Checkov sin conflictos en el contenedor.
- **script**: Ejecuta el análisis de los Dockerfile presentes en el directorio `docker` usando Checkov. El comando genera dos salidas: una en consola (CLI) y otra en formato JSON, almacenada en el archivo definido por la variable `REPORT`.
- **artifacts**: Conserva el archivo de reporte (`checkov.json`) como artefacto del job, permitiendo su revisión o uso en etapas posteriores del pipeline.

### DefectDojo {#gitlab-defectdojo}

```yml title=".gitlab-ci.yml" showLineNumbers
docker_checkov:
  stage: test
  dependencies: ["defectdojo_create_engagement"]
  variables:
    DD_SCAN_TYPE: "Checkov Scan"
    DD_PRODUCT_NAME: "Checkov"
    DD_SCAN_FILE: "checkov.json"
    DD_SCAN_ACTIVE: "true"
    DD_SCAN_VERIFIED: "false"
  image:
    name: bridgecrew/checkov:latest
    entrypoint:
      - '/usr/bin/env'
      - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
  script:
    - apt-get update
    - apt-get install -y curl
    - checkov --directory=docker --output=cli --output=json --output-file-path=console,${DD_SCAN_FILE} --framework=dockerfile
  after_script:
    - bash .gitlab-ci/defectdojo-finding.sh
  artifacts:
    paths:
      - ${DD_SCAN_FILE}
```

- **stage**: Define la etapa del pipeline en la que se ejecuta el análisis, en este caso `test`, para validar la seguridad y calidad de los Dockerfile antes de continuar con el flujo de CI/CD.
- **dependencies**: Indica que este job depende del job `defectdojo_create_engagement`, asegurando que el engagement en DefectDojo esté creado antes de subir los resultados del análisis.
- **variables**: Configura variables de entorno necesarias para la integración con DefectDojo:
  - **DD_SCAN_TYPE**: Tipo de análisis realizado, aquí "Checkov Scan".
  - **DD_PRODUCT_NAME**: Nombre del producto o herramienta, aquí "Checkov".
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por Checkov (`checkov.json`).
  - **DD_SCAN_ACTIVE**: Indica si el análisis está activo.
  - **DD_SCAN_VERIFIED**: Indica si el análisis ha sido verificado.
- **image**: Utiliza la imagen oficial de Checkov (`bridgecrew/checkov:latest`) desde DockerHub, asegurando que la herramienta esté disponible y actualizada en el entorno de ejecución.
- **entrypoint**: Se redefine el entrypoint para establecer la variable de entorno `PATH` correctamente, permitiendo la ejecución de Checkov sin conflictos en el contenedor.
- **script**: Actualiza los paquetes del sistema, instala `curl` y ejecuta el análisis de los Dockerfile presentes en el directorio `docker` usando Checkov. El comando genera dos salidas: una en consola (CLI) y otra en formato JSON, almacenada en el archivo definido por la variable `DD_SCAN_FILE`.
- **after_script**: Ejecuta el script `.gitlab-ci/defectdojo-finding.sh` para subir el reporte generado a DefectDojo.
- **artifacts**: Conserva el archivo de reporte (`checkov.json`) como artefacto del job, permitiendo su revisión o uso en etapas posteriores del pipeline.

## GitHub

```yaml title=".github/workflows/ci.yml" showLineNumbers
  checkov:
    name: checkov
    runs-on: self-hosted
    needs: create_engagement
    env:
      REPORT: "checkov-report.json"
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Checkov action
        uses: bridgecrewio/checkov-action@master
        with:
          framework: "dockerfile"
          file: docker/nginx/Dockerfile
          output_format: cli,json
          output_file_path: console,${REPORT}

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: checkov-report
          path: ${REPORT}
```

- **name**: Define el nombre del job como `checkov`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el runner donde se ejecutará el job, en este caso `self-hosted`, lo que permite utilizar un entorno controlado y personalizado para la ejecución.
- **needs**: Indica que este job depende del job `create_engagement`, asegurando que el engagement necesario esté creado antes de ejecutar el análisis.
- **env**: Define variables de entorno necesarias para el proceso:
  - **REPORT**: Especifica el nombre del archivo donde se almacenará el reporte generado por Checkov (`checkov-report.json`).
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Checkout Code**: Usa la acción `actions/checkout@v4` para clonar el repositorio y disponer del código fuente que será analizado.
  - **Run Checkov action**: Utiliza la acción oficial `bridgecrewio/checkov-action@master` para ejecutar el análisis de seguridad sobre el Dockerfile especificado. El análisis genera un reporte tanto en consola como en formato JSON, almacenado en el archivo definido por la variable `REPORT`.
  - **Upload artifact**: Usa la acción `actions/upload-artifact@v4` para subir el reporte generado como artefacto del workflow, permitiendo su revisión o uso en etapas posteriores.

### Defectdojo {#github-defectdojo}

```yaml title=".github/workflows/ci.yml" showLineNumbers
  checkov:
    name: checkov
    runs-on: self-hosted
    needs: create_engagement
    env:
      DD_ENGAGEMENTID: ${{ needs.create_engagement.outputs.ENGAGEMENTID }}
      DD_SCAN_TYPE: "Checkov Scan"
      DD_PRODUCT_NAME: "Checkov"
      DD_SCAN_FILE: "checkov-report.json"
      DD_SCAN_ACTIVE: "true"
      DD_SCAN_VERIFIED: "false"
      DD_SCAN_MINIMUM_SEVERITY: ${{ secrets.DD_SCAN_MINIMUM_SEVERITY }}
      DD_SCAN_CLOSE_OLD_FINDINGS: ${{ secrets.DD_SCAN_CLOSE_OLD_FINDINGS }}
      DD_SCAN_ENVIRONMENT: ${{ secrets.DD_SCAN_ENVIRONMENT }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Run Checkov action
        uses: bridgecrewio/checkov-action@master
        with:
          framework: "dockerfile"
          file: docker/nginx/Dockerfile
          output_format: cli,json
          output_file_path: console,checkov-report.json
        continue-on-error: true
      - name: Upload Checkov report to DefectDojo
        if: failure()
        run: |
          sh .github/scripts/defectdojo-finding.sh
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: checkov-report
          path: checkov-report.json 
```

- **name**: Define el nombre del job como `checkov`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el runner donde se ejecutará el job, en este caso `self-hosted`, lo que permite utilizar un entorno controlado y personalizado para la ejecución.
- **needs**: Indica que este job depende del job `create_engagement`, asegurando que el engagement necesario esté creado antes de ejecutar el análisis.
- **env**: Define variables de entorno necesarias tanto para el análisis con Checkov como para la integración con DefectDojo:
  - **DD_ENGAGEMENTID**: Identificador del engagement en DefectDojo.
  - **DD_SCAN_TYPE**: Tipo de análisis realizado, aquí "Checkov Scan".
  - **DD_PRODUCT_NAME**: Nombre del producto o herramienta, aquí "Checkov".
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por Checkov (`checkov-report.json`).
  - **DD_SCAN_ACTIVE**: Indica si el análisis está activo.
  - **DD_SCAN_VERIFIED**: Indica si el análisis ha sido verificado.
  - **DD_SCAN_MINIMUM_SEVERITY**, **DD_SCAN_CLOSE_OLD_FINDINGS**, **DD_SCAN_ENVIRONMENT**: Variables adicionales para controlar la integración y filtrado en DefectDojo.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Checkout Code**: Usa la acción `actions/checkout@v4` para clonar el repositorio y disponer del código fuente que será analizado.
  - **Run Checkov action**: Utiliza la acción oficial `bridgecrewio/checkov-action@master` para ejecutar el análisis de seguridad sobre el Dockerfile especificado. El análisis genera un reporte tanto en consola como en formato JSON, almacenado en el archivo definido por la variable `DD_SCAN_FILE`. El parámetro `continue-on-error: true` permite que el workflow continúe aunque se detecten problemas en el análisis.
  - **Upload Checkov report to DefectDojo**: Si el análisis falla, ejecuta el script `.github/scripts/defectdojo-finding.sh` para subir el reporte generado a DefectDojo.
  - **Upload artifact**: Usa la acción `actions/upload-artifact@v4` para subir el reporte generado como artefacto del workflow, permitiendo su revisión o uso en etapas posteriores.

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
        stage("Docker Linting") {
            environment {
                    REPORT = "checkov-report.json"
                }
            steps {
                script {

                     sh """
                        docker run --rm \
                            -v /workspace/${JOB_NAME}:/app \
                              --workdir /app \
                              bridgecrew/checkov \
                              --directory=docker \
                              --output=cli --output=json \
                              --output-file-path=console,${REPORT} \
                              --framework=dockerfile
                    """
            }
        }
```

- **environment:**  
  Define variables de entorno necesarias para el análisis:
  - `REPORT`: Nombre del archivo donde se almacenará el reporte generado por Checkov (`checkov-report.json`).

- **steps:**  
  Ejecuta el bloque principal del stage:
  - **script:**  
    - Ejecuta un contenedor de Checkov usando Docker, montando el workspace del job en `/app` y estableciendo el directorio de trabajo en `/app`.
    - El comando `checkov` analiza todos los Dockerfile presentes en el directorio `docker`, generando dos salidas: una en consola (CLI) y otra en formato JSON, almacenada en el archivo definido por la variable `REPORT`.
    - El análisis permite identificar errores, malas prácticas y vulnerabilidades en los Dockerfile antes de continuar con el pipeline, facilitando la revisión y asegurando la calidad y seguridad de las imágenes generadas.

### Defectdojo {#jenkins-defectdojo}

```groovy title="Jenkinsfile" showLineNumbers
        stage("Docker Linting") {
            environment {
                    DD_SCAN_TYPE                    = "Checkov Scan"
                    DD_PRODUCT_NAME                 = "Checkov"
                    REPORT                          = "checkov-report.json"
                    DD_SCAN_ACTIVE                  = "true"
                    DD_SCAN_VERIFIED                = "false"
                }
            steps {
                script {
                    def props = readProperties file: 'defectdojo.env'
                    env.DD_ENGAGEMENTID = props['DD_ENGAGEMENTID']
                    
                     def exitCode = sh(
                    script:"""
                            docker run --rm \
                                -v /workspace/${JOB_NAME}:/app \
                                 --workdir /app \
                                 bridgecrew/checkov \
                                 --directory=docker \
                                 --output=cli --output=json \
                                 --output-file-path=console,${REPORT} \
                                 --framework=dockerfile
                        """,
                    returnStatus: true
                     )

                if (exitCode == 1) {
                    sh 'chmod +x .jenkis-ci/defectdojo-finding.sh'
                    echo "Se encontraron errores en Docker Linting: enviando evidencias al servidor externo..."
                    withCredentials([string(credentialsId: 'DD_API_KEY', variable: 'DD_API_KEY')]) {
                        sh './.jenkis-ci/defectdojo-finding.sh'
                    }
                } else if (exitCode != 0) {
                    error "checkov terminó con un error inesperado (exit ${exitCode})"
                } else {
                    echo "Sin errores detectados."
                }
                }
            }
        }
```

- **environment:**  
  Define variables de entorno necesarias para el análisis y la integración con DefectDojo:
  - `DD_SCAN_TYPE`: Tipo de escaneo, en este caso "Checkov Scan".
  - `DD_PRODUCT_NAME`: Nombre del producto, aquí "Checkov".
  - `REPORT`: Nombre del archivo de reporte generado (`checkov-report.json`).
  - `DD_SCAN_ACTIVE` y `DD_SCAN_VERIFIED`: Estado del hallazgo en DefectDojo.

- **steps:**  
  Ejecuta el bloque principal del stage:
  - **script:**  
    - `def props = readProperties file: 'defectdojo.env'`: Lee el archivo de configuración para obtener el identificador de engagement de DefectDojo y lo exporta al entorno.
    - `sh docker run ...`: Ejecuta Checkov en un contenedor Docker, montando el workspace en `/app` y generando el reporte en formato JSON y CLI. El resultado se almacena en `exitCode`.
    - Control de flujo según el resultado del análisis:
      - Si `exitCode == 1`: Se han detectado problemas en el linting. Se otorgan permisos de ejecución al script de integración con DefectDojo y, usando credenciales almacenadas en Jenkins, se sube el reporte.
      - Si `exitCode != 0` y distinto de 1: Se detiene el pipeline indicando un error inesperado.
      - Si `exitCode == 0`: No se han detectado problemas y se informa en el log.
  - **withCredentials:**  
  Utiliza el bloque `withCredentials` de Jenkins para gestionar de forma segura las credenciales necesarias durante la ejecución del script.  
  - En este caso, recupera el valor del API Key de DefectDojo almacenado en Jenkins (con el identificador `DD_API_KEY`) y lo expone como variable de entorno temporal (`DD_API_KEY`) solo durante la ejecución del script `.jenkis-ci/defectdojo-finding.sh`.  
  - Esto garantiza que las credenciales sensibles no queden expuestas en los logs ni en el entorno global del pipeline, mejorando la seguridad en la integración con sistemas externos.
