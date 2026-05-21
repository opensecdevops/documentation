---
title: Gitleaks
description: Gitleaks es una herramienta de seguridad utilizada en DevOps para detectar información confidencial y potencialmente comprometedora en repositorios de Git.
---

[GitLeaks](https://github.com/gitleaks/gitleaks) es una herramienta de seguridad utilizada en el ámbito de DevOps para detectar información confidencial y potencialmente comprometedora en repositorios de Git. Su objetivo principal es prevenir la exposición de datos sensibles, como contraseñas, claves de API y otros secretos, que podrían ser accidentalmente incluidos en el historial de versiones de un repositorio Git.

## Características

- **Búsqueda de patrones sensibles:** GitLeaks busca patrones de datos sensibles utilizando reglas predefinidas o personalizadas. Estas reglas pueden incluir patrones de contraseñas, claves de API, tokens de autenticación y otros datos confidenciales.
- **Análisis exhaustivo del historial:** La herramienta escanea el historial completo de commits en un repositorio Git, lo que incluye cambios antiguos y nuevos. Esto permite identificar y corregir datos sensibles que podrían haber sido agregados en versiones anteriores.
- **Integración con flujos de trabajo de CI/CD:** GitLeaks se puede integrar en pipelines de CI/CD para realizar análisis de seguridad automáticamente antes de la implementación. Esto ayuda a que cualquier nueva contribución sea examinada en busca de posibles fugas de información.
- **Compatibilidad con múltiples formatos de archivos:** GitLeaks es capaz de analizar varios formatos de archivos, como archivos de código fuente, archivos de configuración y archivos de texto plano. Esto abarca una amplia gama de posibles ubicaciones de datos sensibles.
- **Configuración personalizada:** Es posible configurar las reglas y los patrones de búsqueda según las necesidades específicas del proyecto, lo que permite adaptar GitLeaks a diferentes contextos.

Gitleaks puede integrarse con otras herramientas del flujo de trabajo, como DefectDojo, para visualizar los hallazgos de manera centralizada.

## GitLab

Para integrar Gitleaks con CI/CD de GitLab, existen dos opciones: utilizar la imagen disponible en el [DockerHub](https://hub.docker.com/r/zricethezav/gitleaks) o la imagen del proyecto [OSDO](https://harbor.opensecdevops.com/harbor/projects/2/repositories/gitleak/artifacts-tab?publicAndNotLogged=yes), que incluye Curl para facilitar la integración con DefectDojo.

Una vez seleccionada la opción adecuada, se puede añadir la siguiente sección en el archivo `gitlab-ci.yml`:

```yaml title=".gitlab-ci.yml" showLineNumbers
secret_detection:
  stage: secret_detection
  variables:
    GIT_STRATEGY: clone
    GIT_DEPTH: 1
    REPORT: gitleaks-report.json
  image: 
    name: zricethezav/gitleaks:latest
    entrypoint: [""]
  script:
    - gitleaks git -v --report-path=${REPORT}
  artifacts:
    paths:
      - ${REPORT}
```

- **stage**: Define la etapa del pipeline en la que se ejecuta el análisis de secretos.
- **variables**: Configura variables de entorno para optimizar la estrategia de clonación del repositorio:
  - **GIT_STRATEGY**: Usa el modo `clone` para obtener el repositorio completo.
  - **GIT_DEPTH**: Limita la profundidad del clon a 1, descargando solo el último commit para acelerar el análisis y reducir recursos.
- **image**: Utiliza la imagen oficial de Gitleaks desde DockerHub, asegurando que la herramienta esté disponible en el entorno de ejecución.
- **entrypoint**: Se establece como vacío para permitir la ejecución directa de comandos en el contenedor.
- **script**: Ejecuta el análisis de secretos con Gitleaks sobre el repositorio, generando un reporte en formato JSON.
- **artifacts**: Conserva el archivo de reporte `gitleaks-report.json` como artefacto del job, permitiendo su revisión o uso en etapas posteriores.

### DefectDojo {#gitlab-defectdojo}

```yaml title=".gitlab-ci.yml" showLineNumbers
secret_detection:
  stage: secret_detection
  dependencies: ["defectdojo_create_engagement"]
  variables:
    GIT_STRATEGY: clone
    GIT_DEPTH: 1
    DD_SCAN_TYPE: "Gitleaks Scan"
    DD_PRODUCT_NAME: "GitLeaks"
    DD_SCAN_FILE: "gitleaks-report.json"
    DD_SCAN_ACTIVE: "true"
    DD_SCAN_VERIFIED: "false"
  image: 
    name: harbor.opensecdevops.com/osdo/gitleak@sha256:d348f3c616c5b51b8e6bb1702484d6f293712be43fc81c3b97793f0886b7f95b
    entrypoint: [""]
  script:
    - gitleaks git -v --report-path=${DD_SCAN_FILE}
  after_script:
    - |
      if [ $CI_JOB_STATUS == 'failed' ]; then
        bash .gitlab-ci/defectdojo-finding.sh
      fi
  artifacts:
    when: on_failure
    paths:
      - ${DD_SCAN_FILE}
```

- **stage**: Define la etapa del pipeline donde se ejecuta el análisis de secretos.
- **dependencies**: Indica que este job depende del job `defectdojo_create_engagement`, asegurando que la integración con DefectDojo esté preparada antes de ejecutar el escaneo.
- **variables**: Establece variables de entorno necesarias para la integración y personalización del reporte:
  - **GIT_STRATEGY** y **GIT_DEPTH**: Optimizan la estrategia de clonación del repositorio para el análisis.
  - **DD_SCAN_TYPE**: Tipo de escaneo reportado en DefectDojo.
  - **DD_PRODUCT_NAME**: Nombre del producto en DefectDojo.
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por Gitleaks.
  - **DD_SCAN_ACTIVE** y **DD_SCAN_VERIFIED**: Marcan el estado del hallazgo en DefectDojo.
- **image**: Utiliza una imagen de contenedor específica que incluye Gitleaks y Curl, necesaria para la integración con DefectDojo.
- **script**: Ejecuta el análisis de secretos con Gitleaks y genera el reporte en formato JSON.
- **after_script**: Si el job falla (es decir, si se detectan secretos), ejecuta el script `defectdojo-finding.sh` para enviar los hallazgos a DefectDojo.
- **artifacts**: Conserva el archivo de reporte solo si el job falla, permitiendo su revisión o uso en etapas posteriores.

## GitHub

Para integrar Gitleaks en el CI/CD de GitHub se puede usar la acción oficial de Gitleaks, disponible en el [GitHub Marketplace](https://github.com/marketplace/actions/gitleaks). Si se requiere integración con DefectDojo, es necesario instalar Gitleaks manualmente en el job, ya que la acción oficial no permite exportar el reporte en formato JSON.

Ejemplo básico de integración:

```yaml title=".github/workflows/ci.yml" showLineNumbers
scan:
    name: gitleaks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: gitleaks/gitleaks-action@v2
```

- **name**: Define el nombre del job como `gitleaks`, facilitando su identificación dentro del workflow.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Clonar repositorio**: Usa la acción `actions/checkout@v4` para clonar el repositorio. El parámetro `fetch-depth: 1` descarga solo el último commit, optimizando el proceso.
  - **Ejecutar Gitleaks**: Utiliza la acción oficial `gitleaks/gitleaks-action@v2` para ejecutar el análisis de secretos en el repositorio, detectando posibles fugas de información sensible en el código fuente y su historial.

### DefectDojo {#github-defectdojo}

```yaml title=".github/workflows/ci.yml" showLineNumbers
  secret_detection:
    name: secret_detection (gitleaks)
    runs-on: ubuntu-latest
    needs: create_engagement
    env:
      DD_ENGAGEMENTID: ${{ needs.create_engagement.outputs.ENGAGEMENTID }}
      DD_SCAN_TYPE: "Gitleaks Scan"
      DD_PRODUCT_NAME: "GitLeaks"
      DD_SCAN_FILE: "gitleaks-report.json"
      DD_SCAN_ACTIVE: "true"
      DD_SCAN_VERIFIED: "false"
      DD_SCAN_MINIMUM_SEVERITY: ${{ secrets.DD_SCAN_MINIMUM_SEVERITY }}
      DD_SCAN_CLOSE_OLD_FINDINGS: ${{ secrets.DD_SCAN_CLOSE_OLD_FINDINGS }}
      DD_SCAN_ENVIRONMENT: ${{ secrets.DD_SCAN_ENVIRONMENT }}
      GITLEAKS_VERSION: "8.27.2"
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - name: Download Gitleaks
        run: |
          echo "Descargando Gitleaks v${GITLEAKS_VERSION}"
          GITLEAKS_URL="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
          curl -sSLf "${GITLEAKS_URL}" -o gitleaks.tar.gz
      - name: Extract & verify binary
        run: |
          file gitleaks.tar.gz | grep -q gzip \
            && tar -xzf gitleaks.tar.gz \
            && chmod +x gitleaks \
            && mv gitleaks /usr/local/bin/ \
            && gitleaks version \
            || (echo "Error en extracción/verificación"; exit 1)
      - name: Run Gitleaks Secret Detection
        id: gitleaks
        continue-on-error: true
        run: |
          gitleaks git -v --report-path=gitleaks-report.json
      - name : Subir reporte a DefectDojo
        run: |
          sh .github/scripts/defectdojo-finding.sh
```

- **name**: Define el nombre del job como `secret_detection (gitleaks)`, facilitando su identificación dentro del workflow.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende del job `create_engagement`, por lo que no se ejecutará hasta que la creación del engagement en DefectDojo haya finalizado correctamente.
- **env**: Define variables de entorno necesarias para la integración con DefectDojo y la configuración del análisis:
  - **DD_ENGAGEMENTID**: Identificador del engagement en DefectDojo, obtenido del output del job anterior.
  - **DD_SCAN_TYPE**, **DD_PRODUCT_NAME**, **DD_SCAN_FILE**, **DD_SCAN_ACTIVE**, **DD_SCAN_VERIFIED**: Variables que describen el tipo de escaneo, el producto, el archivo de reporte y el estado del hallazgo en DefectDojo.
  - **DD_SCAN_MINIMUM_SEVERITY**, **DD_SCAN_CLOSE_OLD_FINDINGS**, **DD_SCAN_ENVIRONMENT**: Variables adicionales para controlar la severidad mínima, el cierre de hallazgos antiguos y el entorno del escaneo, obtenidas de los secretos del repositorio.
  - **GITLEAKS_VERSION**: Versión específica de Gitleaks a instalar y utilizar en el análisis.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Checkout Code**: Usa la acción `actions/checkout@v4` para clonar el repositorio. El parámetro `fetch-depth: 1` descarga solo el último commit, optimizando el proceso.
  - **Download Gitleaks**: Descarga la versión especificada de Gitleaks desde el repositorio oficial de GitHub.
  - **Extract & verify binary**: Extrae el binario de Gitleaks, verifica que la descarga y extracción sean correctas, le otorga permisos de ejecución y lo mueve a `/usr/local/bin/` para que esté disponible en el entorno.
  - **Run Gitleaks Secret Detection**: Ejecuta el análisis de secretos con Gitleaks sobre el repositorio, generando un reporte en formato JSON. El parámetro `continue-on-error: true` permite que el workflow continúe aunque se detecten secretos.
  - **Subir reporte a DefectDojo**: Ejecuta un script que envía el reporte generado a DefectDojo para su gestión y visualización centralizada.

## Jenkins

Para integrar Gitleaks con CI/CD de Jenkins se puede utilizar la imagen disponible en [DockerHub](https://hub.docker.com/r/zricethezav/gitleaks).

Ejemplo básico de integración:

```groovy title="Jenkinsfile" showLineNumbers
stage("GitLeaks") {
  steps {
      script {
              script: """
                  docker run \
                    -v /workspace/${JOB_NAME}:/app \
                    -w /app \
                    zricethezav/gitleaks:latest dir /app --no-color -r ${REPORT}
              """,
      }
      archiveArtifacts artifacts: 'gitleaks-report.json', fingerprint: true
  }
}
```

- **stage("GitLeaks"):**  
  Define una etapa del pipeline dedicada al análisis de secretos con Gitleaks.
- **script:**  
  Ejecuta un bloque de comandos dentro del pipeline.
- `docker run -v /workspace/${JOB_NAME}:/app -w /app zricethezav/gitleaks:latest dir /app --no-color -r ${REPORT}`:  
  Ejecuta un contenedor Docker con la imagen oficial de Gitleaks. Monta el workspace del job en `/app` dentro del contenedor y realiza el escaneo de todo el directorio `/app`, generando un reporte en formato JSON (`${REPORT}`).
- **archiveArtifacts artifacts: 'gitleaks-report.json', fingerprint: true:**  
  Guarda el archivo de reporte generado como artefacto del build, permitiendo su consulta posterior y asegurando trazabilidad mediante fingerprint.

### DefectDojo {#jenkins-defectdojo}

```groovy title="Jenkinsfile" showLineNumbers
stage("GitLeaks") {
  environment {
          DD_SCAN_TYPE    = "Gitleaks Scan"
          DD_PRODUCT_NAME = "GitLeaks"
          REPORT          = "gitleaks-report.json"
          DD_SCAN_ACTIVE  = "true"
          DD_SCAN_VERIFIED= "false"
      }
  steps {
      script {
          def props = readProperties file: 'defectdojo.env'
          env.DD_ENGAGEMENTID = props['DD_ENGAGEMENTID']
          
          def exitCode = sh(
              script: """
                  docker run \
                    -v /workspace/${JOB_NAME}:/app \
                    -w /app \
                    zricethezav/gitleaks:latest dir /app --no-color -r ${REPORT}
              """,
              returnStatus: true
          )

          if (exitCode == 1) {
              sh 'chmod +x .jenkis-ci/defectdojo-finding.sh'
              echo "Se encontraron secretos: enviando evidencias al servidor externo..."
              withCredentials([string(credentialsId: 'DD_API_KEY', variable: 'DD_API_KEY')]) {
                  sh './.jenkis-ci/defectdojo-finding.sh'
              }
          } else if (exitCode != 0) {
              error "Gitleaks terminó con un error inesperado (exit ${exitCode})"
          } else {
              echo "Sin secretos detectados."
          }
      }
      archiveArtifacts artifacts: 'gitleaks-report.json', fingerprint: true
  }
}
```

- **environment:**  
  Define variables de entorno necesarias para el análisis y la integración con DefectDojo:
  - `DD_SCAN_TYPE`: Tipo de escaneo, en este caso "Gitleaks Scan".
  - `DD_PRODUCT_NAME`: Nombre del producto, aquí "GitLeaks".
  - `REPORT`: Nombre del archivo de reporte generado.
  - `DD_SCAN_ACTIVE` y `DD_SCAN_VERIFIED`: Estado del hallazgo en DefectDojo.

- **script:**  
  Ejecuta el bloque principal del stage:
  - `readProperties file: 'defectdojo.env'`: Lee el archivo de configuración para obtener el identificador de engagement de DefectDojo y lo exporta al entorno.
  - `sh docker run ...`: Ejecuta Gitleaks en un contenedor Docker, montando el workspace en `/app` y generando el reporte en formato JSON. El resultado se almacena en `exitCode`.
  - Control de flujo según el resultado del análisis:
    - Si `exitCode == 1`: Se han detectado secretos. Se otorgan permisos de ejecución al script de integración con DefectDojo y, usando credenciales almacenadas en Jenkins, se sube el reporte.
    - Si `exitCode != 0` y distinto de 1: Se detiene el pipeline indicando un error inesperado.
    - Si `exitCode == 0`: No se han detectado secretos y se informa en el log.

- **archiveArtifacts artifacts: 'gitleaks-report.json', fingerprint: true:**  
  Guarda el archivo de reporte generado como artefacto del build, permitiendo su consulta posterior y asegurando trazabilidad mediante fingerprint.
