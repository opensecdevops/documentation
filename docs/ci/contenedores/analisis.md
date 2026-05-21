# Análisis

El análisis de imágenes Docker en busca de problemas de seguridad es una práctica esencial dentro de los procesos SecDevOps. Su objetivo es identificar vulnerabilidades, configuraciones inseguras y riesgos potenciales en las imágenes de contenedores antes de su despliegue en entornos de producción. Esta tarea permite a los equipos de desarrollo y operaciones anticiparse a posibles amenazas, mejorar la postura de seguridad y cumplir con requisitos normativos o de buenas prácticas.

## Trivy

Trivy es una herramienta ampliamente utilizada para el análisis de seguridad de imágenes Docker y otros artefactos de software. Sus principales características incluyen:

- **Análisis de vulnerabilidades:** Trivy utiliza una base de datos actualizada de vulnerabilidades conocidas (CVE) en bibliotecas, paquetes de sistema y dependencias de software. Esto permite identificar posibles problemas de seguridad en las imágenes Docker, tanto a nivel de sistema operativo como de dependencias de aplicación.
- **Detección de configuraciones inseguras:** Además de vulnerabilidades, Trivy puede detectar configuraciones inseguras en archivos como Dockerfile, Kubernetes Manifests y archivos de infraestructura como código (IaC).
- **Integración en CI/CD:** Trivy se integra fácilmente en pipelines de CI/CD, permitiendo automatizar el escaneo de imágenes de contenedores en cada etapa del ciclo de desarrollo, desde la construcción hasta el despliegue. Esto facilita la detección temprana de riesgos y la aplicación de medidas correctivas antes de que las imágenes lleguen a producción.
- **Escaneo rápido y eficiente:** Trivy es conocido por su velocidad y bajo consumo de recursos, lo que permite realizar análisis frecuentes sin afectar significativamente los tiempos de entrega.
- **Compatibilidad multiplataforma:** Es compatible con diferentes sistemas operativos, arquitecturas y registros de contenedores, lo que facilita su adopción en entornos heterogéneos.
- **Informes detallados:** Proporciona informes claros y estructurados sobre las vulnerabilidades encontradas, incluyendo información sobre el impacto, la severidad, la ubicación y posibles soluciones o mitigaciones.
- **Actualizaciones regulares:** La base de datos de vulnerabilidades de Trivy se actualiza de forma periódica, asegurando que los análisis se basen en la información de seguridad más reciente.
- **Personalización:** Permite personalizar las políticas de escaneo, establecer umbrales de severidad, excluir ciertos tipos de vulnerabilidades y adaptar el análisis a las necesidades específicas del proyecto.
- **Soporte para múltiples artefactos:** Además de imágenes Docker, Trivy puede analizar sistemas de archivos, repositorios de código, paquetes de lenguajes (como npm, pip, gem, etc.) y archivos de configuración.

## GitLab

```yaml title=".gitlab-ci.yml" showLineNumbers
docker_scan:
  stage: build_test
  dependencies: ["docker_build"]
  image:
    name: docker.io/aquasec/trivy:latest
    entrypoint: [""]
  script:
    - mkdir -p scan_result
    - cd tar_images
    - |
      for tar_image in *.tar; 
      do
        [ -e "$tar_image" ] || continue;
        file_name=${tar_image%.*};
        trivy image --timeout 15m --offline-scan --input $tar_image -f json -o ../scan_result/$file_name.json --severity CRITICAL; 
      done
  artifacts:
    paths:
      - scan_result
    expire_in: 1 month
```

- **image:**  
  Utiliza una imagen de contenedor específica (`docker.io/aquasec/trivy:latest`) que incluye la herramienta Trivy necesaria para el análisis de seguridad de imágenes Docker. El uso de la imagen oficial garantiza la compatibilidad y el acceso a las últimas actualizaciones.

- **dependencies:**  
  Indica que este job depende del job `docker_build`, asegurando que las imágenes de contenedor a analizar ya han sido construidas y están disponibles para el escaneo.

- **script:**  
  Ejecuta los comandos principales del job:
  - Crea el directorio `scan_result` para almacenar los resultados del análisis.
  - Accede al directorio `tar_images` donde se encuentran las imágenes Docker en formato tar.
  - Recorre cada archivo `.tar` y ejecuta Trivy para analizar la imagen, generando un informe en formato JSON con las vulnerabilidades críticas detectadas.

- **artifacts:**  
  Especifica que los archivos generados en el directorio `scan_result` deben conservarse como artefactos durante 1 mes, permitiendo su revisión, auditoría y uso en etapas posteriores del pipeline.

### DefectDojo {#defectdojo-gitlab}

```yaml title=".gitlab-ci.yml" showLineNumbers
docker_scan:
  stage: build_test
  dependencies: ["docker_build"]
  variables:
    DD_SCAN_TYPE: "Trivy Scan"
    DD_PRODUCT_NAME: "Trivy"
    DD_SCAN_ACTIVE: "true"
    DD_SCAN_VERIFIED: "false"
  image:
    name: docker.io/aquasec/trivy:latest
    entrypoint: [""]
  script:
    - mkdir -p scan_result
    - cd tar_images
    - |
      for tar_image in *.tar; 
      do
        [ -e "$tar_image" ] || continue;
        file_name=${tar_image%.*};
        trivy image --timeout 15m --offline-scan --input $tar_image -f json -o ../scan_result/$file_name.json --severity CRITICAL; 
      done
    - | 
      cd ../scan_result
      ls;
      vulns=false;
      for result in *.json;
      do
        [ -e "$result" ] || continue;
        file_name=${result%.*};
        vulnerabilities=$(awk -F '[:,]' '/"Vulnerabilities"/ {gsub("[[:blank:]]+", "", $2); print $2}' "$file_name.json");
        if ! [ -z "$vulnerabilities" ]; then 
          vulns=true;
          DD_SCAN_FILE=$file_name.json;
          bash .gitlab-ci/defectdojo-finding.sh
        fi
      done
      if [ "$vulns" = true ]; then
        exit 1;
      fi
  artifacts:
    paths:
      - scan_result
    expire_in: 1 month
```

- **image:**  
  Utiliza una imagen de contenedor específica (`docker.io/aquasec/trivy:latest`) que incluye la herramienta Trivy necesaria para el análisis de seguridad de imágenes Docker. El uso de la imagen oficial garantiza la compatibilidad y el acceso a las últimas actualizaciones.

- **dependencies:**  
  Indica que este job depende del job `docker_build`, asegurando que las imágenes de contenedor a analizar ya han sido construidas y están disponibles para el escaneo.

- **variables:**  
  Define variables de entorno necesarias para el proceso:
  - `DD_SCAN_TYPE`: Tipo de análisis realizado, en este caso "Trivy Scan".
  - `DD_PRODUCT_NAME`: Nombre del producto o herramienta utilizada, aquí "Trivy".
  - `DD_SCAN_ACTIVE`: Indica si el análisis está activo.
  - `DD_SCAN_VERIFIED`: Indica si el análisis ha sido verificado.

- **script:**  
  Ejecuta los comandos principales del job:
  - Crea el directorio `scan_result` para almacenar los resultados del análisis.
  - Accede al directorio `tar_images` donde se encuentran las imágenes Docker en formato tar.
  - Recorre cada archivo `.tar` y ejecuta Trivy para analizar la imagen, generando un informe en formato JSON con las vulnerabilidades críticas detectadas.
  - Cambia al directorio `scan_result`, lista los archivos generados y recorre cada informe JSON para comprobar si existen vulnerabilidades.
  - Si se detectan vulnerabilidades, se establece la variable `DD_SCAN_FILE` y se ejecuta el script `.gitlab-ci/defectdojo-finding.sh` para enviar los resultados a DefectDojo.
  - Si se han encontrado vulnerabilidades, el job finaliza con error (`exit 1`), bloqueando el pipeline para evitar el despliegue de imágenes inseguras.

- **artifacts:**  
  Especifica que los archivos generados en el directorio `scan_result` deben conservarse como artefactos durante 1 mes, permitiendo su revisión, auditoría y uso en etapas posteriores del pipeline.

## GitHub

```yaml title=".github/workflows/ci.yml" showLineNumbers
trivy_scan:
  name: Trivy Scan
  runs-on: ubuntu-latest
  needs: docker_build
  container:
    image: docker.io/aquasec/trivy:latest
  steps:

    - name: Download docker image tar
      uses: actions/download-artifact@v4
      with:
        name: docker_image
        path: tar_images

    - name: Run Trivy scan
      run: |
        mkdir -p scan_result
        for tar in tar_images/*.tar; do
          [ -e "$tar" ] || continue
          name="$(basename "$tar" .tar)"
          trivy image --input "$tar" \
                      --format json \
                      --output "scan_result/${name}.json"
        done

    - name: Upload scan results
      uses: actions/upload-artifact@v4
      with:
        name: scan_result
        path: scan_result
        retention-days: 1
```

- **name**: Define el nombre del job como `Trivy Scan`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende del job `docker_build`, por lo que no se ejecutará hasta que la construcción de la imagen Docker haya finalizado correctamente.
- **container**: Utiliza la imagen oficial de Trivy (`docker.io/aquasec/trivy:latest`) como entorno de ejecución, garantizando que la herramienta esté disponible y actualizada.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Download docker image tar**: Usa la acción `actions/download-artifact@v4` para descargar el archivo tar de la imagen Docker generada en etapas previas, almacenándolo en el directorio `tar_images`.
  - **Run Trivy scan**: Ejecuta un script que recorre cada archivo `.tar` en `tar_images`, analiza la imagen con Trivy y genera un informe en formato JSON en el directorio `scan_result`.
  - **Upload scan results**: Usa la acción `actions/upload-artifact@v4` para subir los informes generados en `scan_result` como artefactos del workflow, permitiendo su revisión o uso en etapas posteriores. El tiempo de retención se establece en 1 día.

### DefectDojo {#defectdojo-github}

```yaml title=".github/workflows/ci.yml" showLineNumbers
upload_to_defectdojo:
  name: Upload to DefectDojo
  runs-on: ubuntu-latest
  needs: [trivy_scan, create_engagement]
  env:
    DD_ENGAGEMENTID: ${{ needs.create_engagement.outputs.ENGAGEMENTID }}
    DD_SCAN_TYPE:     "Trivy Scan"
    DD_PRODUCT_NAME:  "Trivy"
    DD_SCAN_ACTIVE: "true"
    DD_SCAN_VERIFIED: "false"
    DD_SCAN_MINIMUM_SEVERITY: ${{ secrets.DD_SCAN_MINIMUM_SEVERITY }}
    DD_SCAN_CLOSE_OLD_FINDINGS: ${{ secrets.DD_SCAN_CLOSE_OLD_FINDINGS }}
    DD_SCAN_ENVIRONMENT: ${{ secrets.DD_SCAN_ENVIRONMENT }}
  steps:
    - name: Checkout repo
      uses: actions/checkout@v4
      with:
        sparse-checkout: .github/

    - name: Download scan results
      uses: actions/download-artifact@v4
      with:
        name: scan_result
        path: scan_result

    - name: Upload findings to DefectDojo
      run: |
        for result in scan_result/*.json; do
          [ -e "$result" ] || continue
          file_name=${result%.*}
          vulnerabilities=$(awk -F '[:,]' '/"Vulnerabilities"/ {gsub("[[:blank:]]+", "", $2); print $2}' "$file_name.json")
          if ! [ -z "$vulnerabilities" ]; then 
            export DD_SCAN_FILE="${file_name}.json"
            echo "Subiendo: $DD_SCAN_FILE"
            sh .github/scripts/defectdojo-finding.sh
          fi
        done
```

- **name**: Define el nombre del job como `Upload to DefectDojo`, facilitando su identificación dentro del workflow.
- **runs-on**: Especifica el sistema operativo del runner, en este caso `ubuntu-latest`.
- **needs**: Indica que este job depende de los jobs `trivy_scan` y `create_engagement`, asegurando que tanto el análisis de seguridad como la creación del engagement en DefectDojo se hayan completado.
- **env**: Define variables de entorno necesarias para el proceso, incluyendo identificadores y parámetros de configuración para la integración con DefectDojo:
  - **DD_ENGAGEMENTID**: Identificador del engagement en DefectDojo.
  - **DD_SCAN_TYPE**: Tipo de análisis realizado, aquí "Trivy Scan".
  - **DD_PRODUCT_NAME**: Nombre del producto o herramienta utilizada, aquí "Trivy".
  - **DD_SCAN_ACTIVE**: Indica si el análisis está activo.
  - **DD_SCAN_VERIFIED**: Indica si el análisis ha sido verificado.
  - **DD_SCAN_MINIMUM_SEVERITY**: Severidad mínima de findings a reportar.
  - **DD_SCAN_CLOSE_OLD_FINDINGS**: Indica si se deben cerrar findings antiguos.
  - **DD_SCAN_ENVIRONMENT**: Entorno de ejecución del análisis.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Checkout repo**: Usa la acción `actions/checkout@v4` para clonar el repositorio, limitando el checkout a la carpeta `.github/` mediante `sparse-checkout`.
  - **Download scan results**: Usa la acción `actions/download-artifact@v4` para descargar los informes generados por Trivy en el directorio `scan_result`.
  - **Upload findings to DefectDojo**: Ejecuta un script que recorre cada informe JSON en `scan_result`, verifica si existen vulnerabilidades y, en caso afirmativo, exporta la variable `DD_SCAN_FILE` y ejecuta el script `.github/scripts/defectdojo-finding.sh` para enviar los resultados a DefectDojo.

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
stage('Trivy Scan') {
    steps {
        script {
            sh 'mkdir -p scan_result'
            sh '''
                for tar_image in tar_images/*.tar; do
                    [ -e "$tar_image" ] || continue
                    file_name=${tar_image##*/}
                    file_name=${file_name%.*}
                    docker run --rm \
                    -v /workspace/${JOB_NAME}:/app \
                    -w /app \
                    aquasec/trivy image --input "$tar_image" \
                        -f json \
                        -o scan_result/"$file_name".json
                done
                '''
            archiveArtifacts artifacts: 'scan_result/**', fingerprint: true

        }
    }
}
```

- **environment:**  
  Define variables de entorno necesarias para el proceso:
  - `DD_SCAN_TYPE`: Tipo de análisis realizado, en este caso "Trivy Scan".
  - `DD_PRODUCT_NAME`: Nombre del producto o herramienta utilizada, aquí "Trivy".
  - `DD_SCAN_ACTIVE`: Indica si el análisis está activo.
  - `DD_SCAN_VERIFIED`: Indica si el análisis ha sido verificado.

- **script:**  
  Ejecuta el bloque principal de instrucciones del stage:
  - Lee el archivo `defectdojo.env` para obtener propiedades adicionales, como el identificador de engagement (`DD_ENGAGEMENTID`), y lo asigna a una variable de entorno.
  - Crea el directorio `scan_result` donde se almacenarán los informes generados por Trivy.
  - Ejecuta un bucle que recorre cada archivo `.tar` en el directorio `tar_images`, y para cada uno:
    - Obtiene el nombre base del archivo.
    - Ejecuta un contenedor Docker con la imagen oficial de Trivy, montando el workspace del job y estableciendo el directorio de trabajo. Trivy analiza la imagen y genera un informe en formato JSON en el directorio `scan_result`.

- **archiveArtifacts artifacts: 'scan_result/**', fingerprint: true**:  
  Guarda todos los informes generados en el directorio `scan_result` como artefactos del build, permitiendo su consulta posterior y asegurando la trazabilidad mediante fingerprint.

### DefectDojo {#defectdojo-jenkins}

```groovy title="Jenkinsfile" showLineNumbers
stage('Trivy Scan') {
            environment {
                DD_SCAN_TYPE                    = "Trivy Scan"
                DD_PRODUCT_NAME                 = "Trivy"
                DD_SCAN_ACTIVE                  = "true"
                DD_SCAN_VERIFIED                = "false"
            }
            steps {
                script {
                    def props = readProperties file: 'defectdojo.env'
                    env.DD_ENGAGEMENTID = props['DD_ENGAGEMENTID']
                    


                    sh 'mkdir -p scan_result'
                    sh '''
                        for tar_image in tar_images/*.tar; do
                            [ -e "$tar_image" ] || continue
                            file_name=${tar_image##*/}
                            file_name=${file_name%.*}
                            docker run --rm \
                            -v /workspace/${JOB_NAME}:/app \
                            -w /app \
                            aquasec/trivy image --input "$tar_image" \
                                -f json \
                                -o scan_result/"$file_name".json
                        done
                        '''
                    withCredentials([string(credentialsId: 'DD_API_KEY', variable: 'DD_API_KEY')]) {
                    sh '''
                        for result in scan_result/*.json; do
                        [ -e "$result" ] || continue
                        vulnerabilities=$(awk -F '[:,]' '/"Vulnerabilities"/ {gsub("[[:blank:]]+","",$2); print $2}' "$result")
                        if [ ! -z "$vulnerabilities" ]; then
                            export REPORT="$result"
                            bash .jenkis-ci/defectdojo-finding.sh > "${result%.*}-log.txt"
                        fi
                        done
                    '''
                    }

                    archiveArtifacts artifacts: 'scan_result/**', fingerprint: true

                }
            }
        }
```

- **environment:**  
  Define variables de entorno necesarias para el proceso:
  - `DD_SCAN_TYPE`: Tipo de análisis realizado, en este caso "Trivy Scan".
  - `DD_PRODUCT_NAME`: Nombre del producto o herramienta utilizada, aquí "Trivy".
  - `DD_SCAN_ACTIVE`: Indica si el análisis está activo.
  - `DD_SCAN_VERIFIED`: Indica si el análisis ha sido verificado.

- **script:**  
  Ejecuta el bloque principal de instrucciones del stage:
  - Lee el archivo `defectdojo.env` para obtener propiedades adicionales, como el identificador de engagement (`DD_ENGAGEMENTID`), y lo asigna a una variable de entorno.
  - Crea el directorio `scan_result` donde se almacenarán los informes generados por Trivy.
  - Ejecuta un bucle que recorre cada archivo `.tar` en el directorio `tar_images`, y para cada uno:
    - Obtiene el nombre base del archivo.
    - Ejecuta un contenedor Docker con la imagen oficial de Trivy, montando el workspace del job y estableciendo el directorio de trabajo. Trivy analiza la imagen y genera un informe en formato JSON en el directorio `scan_result`.

- **withCredentials([string(credentialsId: 'DD_API_KEY', variable: 'DD_API_KEY')])**:  
  Utiliza credenciales almacenadas en Jenkins (API key para DefectDojo) y las expone como variable de entorno para el script, permitiendo la autenticación segura al enviar resultados.

- **sh '.jenkis-ci/defectdojo-finding.sh'**:  
  Recorre cada informe JSON generado en `scan_result`, verifica si existen vulnerabilidades y, en caso afirmativo, exporta la variable `REPORT` y ejecuta el script `.jenkis-ci/defectdojo-finding.sh` para enviar los resultados a DefectDojo. El resultado del envío se guarda en un archivo de log asociado a cada informe.

- **archiveArtifacts artifacts: 'scan_result/**', fingerprint: true**:  
  Guarda todos los informes generados en el directorio `scan_result` como artefactos del build, permitiendo su consulta posterior y asegurando la trazabilidad mediante fingerprint.
