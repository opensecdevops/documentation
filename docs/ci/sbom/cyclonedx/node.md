---
title: CycloneDX Node
description: Guía para generar y gestionar SBOM en proyectos Node.js usando CycloneDX, con integración en CI/CD para GitLab, GitHub y Jenkins.
sidebar_label: Node.js
keywords:
  - CycloneDX
  - Node.js
  - SBOM
  - Dependency-Track
  - GitLab
  - GitHub
  - Jenkins
---

Para instalar [CycloneDX para Node con npm](https://github.com/CycloneDX/cyclonedx-node-npm), primero debes asegurarte de que tengas [node y npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) instalados en tu sistema. Luego, sigue estos pasos:

* Abre una terminal o línea de comandos.
* Instala el paquete `@cyclonedx/cyclonedx-npm` de manera global

```bash
npm install -g @cyclonedx/cyclonedx-npm
```

* Ya  podemos ejecutar el análisis de dependencias mediante CycloneXD con el siguiente comando

```bash
cyclonedx-npm --output-file sbom.json 
```

Podemos agregar `--omit dev` si no queremos que se analice las dependencias de desarrollo

Ahora que sabemos como se integra en node vamos a agregar nuestro stage en el CI para que se ejecute en cada commit y se envie a la plataforma de gestión de dependencias Dependecy-track.

## GitLab

```yml title=".gitlab-ci.yml" showLineNumbers
sbom_scan_node:
  stage: sbom_scan
  image: harbor.opensecdevops.com/osdo/cyclonedx-npm@sha256:719379ececf59b541a01ac019f568a141c10974df587dd9bd37ae78145ebc5bd
  dependencies: ['npm']
  extends: .dependencies_cache
  variables:
    DT_PROJECT_ID: 4f0a8f37-00c7-40aa-ae48-7155bbf6ae68
    REPORT: node-sbom.json
  script:
    - cyclonedx-npm --output-file ${REPORT} --omit dev --short-PURLs
    - sh .gitlab-ci/dependency-track.sh 
  allow_failure: true
  artifacts:
    expire_in: 1 days
    paths:
      - ${REPORT}
    reports:
      cyclonedx: ${REPORT}
```

* **image**: Se utiliza una imagen de contenedor específica (harbor.opensecdevops.com/osdo/cyclonedx-npm@sha256:...) que contiene todas las herramientas necesarias para generar el SBOM (Software Bill of Materials) en proyectos Node.js. El uso de un hash sha256 garantiza que siempre se use la misma versión de la imagen, asegurando consistencia en los análisis.

* **dependencies**: Se indica que este job depende del job llamado npm. Esto asegura que las dependencias del proyecto ya estén instaladas antes de generar el SBOM, evitando errores por falta de paquetes.

* **variables**: Se definen variables de entorno necesarias para el proceso:
  * **DT_PROJECT_ID**: Identificador del proyecto en Dependency-Track.
  * **REPORT**: Nombre del archivo donde se generará el SBOM.
* **script**: Contiene los comandos que se ejecutarán en el job:
  * `cyclonedx-npm --output-file ${REPORT} --omit dev --short-PURLs`: Genera el SBOM en formato JSON, omitiendo las dependencias de desarrollo y utilizando PURLs cortos.
  * `sh .gitlab-ci/dependency-track.sh`: Envía el SBOM generado a la plataforma Dependency-Track para su análisis y gestión.
* **allow_failure**: Permite que el job falle sin afectar el pipeline completo, lo que es útil si el análisis de dependencias no es crítico para la ejecución del pipeline.
* **artifacts**: Se especifica que el archivo en la variable `${REPORT}` generado debe conservarse como artefacto durante 1 día. Esto permite revisar el SBOM después de la ejecución del pipeline o utilizarlo en otros jobs.

## GitHub

```yml title=".github/workflows/ci.yml" showLineNumbers
sbom_scan_node:
    name: sbom_scan_node
    runs-on: ubuntu-latest
    needs: npm
    env:
      DT_PROJECT_ID: 4f0a8f37-00c7-40aa-ae48-7155bbf6ae68
      REPORT: 'sbom-node.json'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node  
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Recuperar artifacts
        uses: actions/download-artifact@v4
      - name: CycloneDX
        run: | 
          npm install --global @cyclonedx/cyclonedx-npm
          npx cyclonedx-npm -o ${REPORT} --of json --omit dev
          sh .github/scripts/dependency-track.sh
```

* **name**: Define el nombre del job como sbom_scan_node, facilitando su identificación dentro del workflow.
* **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso ubuntu-latest, asegurando un entorno limpio y consistente para cada ejecución.
* **needs**: Indica que este job depende del job npm, por lo que no se ejecutará hasta que el job de instalación de dependencias haya finalizado correctamente.
* **env**: Define variables de entorno necesarias para el proceso:
  * **DT_PROJECT_ID**: Identificador del proyecto en Dependency-Track.
  * **REPORT**: Nombre del archivo donde se generará el SBOM.

* **steps**: Lista los pasos que se ejecutarán en el job:
  * **Clonar repositorio**: Usa la acción `actions/checkout@v4` para clonar el repositorio y obtener el código fuente.
  * **Setup Node**: Usa la acción `actions/setup-node@v4` para instalar Node.js versión 20, configurando el entorno necesario para ejecutar los comandos de npm y CycloneDX.
  * **Recuperar artifacts**: Usa la acción `actions/download-artifact@v4` para recuperar artefactos generados en etapas previas, como las dependencias instaladas.
  * **CycloneDX**: Instala globalmente el paquete `@cyclonedx/cyclonedx-npm` y ejecuta el comando `npx cyclonedx-npm -o ${REPORT} --of json --omit dev` para generar el archivo SBOM en formato JSON, omitiendo las dependencias de desarrollo. Finalmente, ejecuta el script `.github/scripts/dependency-track.sh` para enviar el SBOM generado a la plataforma Dependency-Track para su análisis y gestión.

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
stage('SBOM Scan Node') {
    environment {
        DT_SERVER       = "https://dtrack-api.example.com"
        DT_PROJECT_ID   = "c034c920-a6d2-4859-bfcb-e89c7bce807e"
        REPORT          = "sbom-node.json"
    }
    steps {
        unstash 'deps'
        sh """docker run --rm \
                -v /workspace/${JOB_NAME}:/app \
                -w /app \
                harbor.opensecdevops.com/osdo/cyclonedx-npm@sha256:719379ececf59b541a01ac019f568a141c10974df587dd9bd37ae78145ebc5bd cyclonedx-npm --output-file ${REPORT} --omit dev --short-PURLs
            """
          sh 'chmod +x .jenkis-ci/dependency-track.sh'
        withCredentials([string(credentialsId: 'DT_API_KEY', variable: 'DT_API_KEY')]) {
            sh './.jenkis-ci/dependency-track.sh'
        }
        
        archiveArtifacts artifacts: "${env.REPORT}", fingerprint: true
    }
}
```

* **environment**: Se definen variables de entorno necesarias para el proceso:
  * **DT_SERVER**: URL del servidor de Dependency-Track donde se enviará el SBOM.
  * **DT_PROJECT_ID**: Identificador del proyecto en Dependency-Track.
  * **REPORT**: Nombre del archivo donde se generará el SBOM.
* **unstash 'deps'**: Recupera las dependencias previamente almacenadas (stash) en una etapa anterior del pipeline, asegurando que estén disponibles para el análisis.

* `sh docker run ... cyclonedx-npm`: Ejecuta un contenedor Docker con la imagen específica (harbor.opensecdevops.com/osdo/cyclonedx-npm@sha256:719379ececf59b541a01ac019f568a141c10974df587dd9bd37ae78145ebc5bd) para generar el archivo SBOM (sbom-node.json) usando la herramienta CycloneDX para Node.js. El uso del hash sha256 garantiza que siempre se utilice la misma versión de la imagen, asegurando consistencia y reproducibilidad en los análisis.
* `sh 'chmod +x .jenkis-ci/dependency-track.sh'`: Da permisos de ejecución al script dependency-track.sh, necesario para poder ejecutarlo en el siguiente paso.
* `withCredentials([string(credentialsId: 'DT_API_KEY', variable: 'DT_API_KEY')]) { ... }`: Utiliza credenciales almacenadas en Jenkins (en este caso, una API key para Dependency-Track) y las expone como variable de entorno para el script.

* `sh './.jenkis-ci/dependency-track.sh'`: Ejecuta el script encargado de enviar el archivo SBOM generado a la plataforma Dependency-Track para su análisis y gestión.

* `archiveArtifacts artifacts: "${env.REPORT}", fingerprint: true`: Guarda el archivo SBOM (sbom-node.json) como artefacto del build, permitiendo su consulta posterior y asegurando trazabilidad mediante fingerprint.

Una vez cargado el fichero sbom en la plataforma de Dependecy-track veremos las dependencias y su estado de actualización y de vulnerabilidades conocidas.

![Lista dependencias](/img/dependency-track/sbom_load.png)
