---
title: Integraciones monitorización
toc_max_heading_level: 4
description: Las integraciones de monitorización son herramientas y procesos que permiten supervisar y analizar el rendimiento, la seguridad y el estado general de un sistema o aplicación.
---

Para centralizar los posibles problemas de seguridad que puedan surgir en las diferentes fases del pipeline, se realiza la integración con herramientas de monitorización.

## DefectDojo

Para integrar [DefectDojo](../infrastructura/defectdojo), el primer paso es [crear un proyecto](../infrastructura/defectdojo/jerarquia-de-producto.md#creación). Una vez creado el proyecto, se requieren dos componentes en el pipeline. El primero consiste en crear un stage previo que genere un engagement para esa ejecución. Posteriormente, se desarrolla una función reutilizable para importar los diferentes análisis.

En ambos casos, se utiliza la API de DefectDojo, que requiere autenticación. Esta información se encuentra en la parte superior derecha de la interfaz de DefectDojo.

<div style={{textAlign: 'center'}}>
![Menú API Key](/img/defectdojo/menu_api_key.png)
</div>

En ese apartado se puede ver la API Key, que debe incluirse en las solicitudes bajo el encabezado `Authorization: Token XXXXXXXXXXXXXX`.

<div style={{textAlign: 'center'}}>
![Show API Key](/img/defectdojo/show_api_key.png)
</div>

La URL base de la API v2 corresponde a la URL base de la instancia de DefectDojo seguida de `/api/v2`.

El identificador del producto se obtiene a partir de la URL al acceder al producto en la interfaz de usuario.

<div style={{textAlign: 'center'}}>
![Id producto](/img/defectdojo/id_product.png)
</div>

### GitLab {#gitlab-defectdojo}

#### Engagement {#gitlab-engagement}

Una vez disponibles los datos, se crea un engagement mediante un stage denominado `.pre`, que devuelve un ID almacenado en una variable de entorno. Este ID se transfiere a las siguientes tareas relacionadas con DefectDojo utilizando el artefacto '[artifacts:reports:dotenv'](https://docs.gitlab.com/ee/ci/yaml/artifacts_reports.html#artifactsreportsdotenv).

Las variables necesarias en el CI son:

- **DD_SERVER:** Dirección del servidor de DefectDojo.
- **DD_API_KEY:** Clave de la API para autenticarse en DefectDojo. Se recomienda marcar el atributo 'mask' para que no se muestre en los registros.
- **DD_PRODUCTID:** ID del producto en el que se crea el engagement.

<div style={{textAlign: 'center'}}>
![GitLab CI/CD Variables](/img/defectdojo/CI_CD_variables.png)
</div>

Se crea un archivo llamado `defectdojo-engagement.sh` en la carpeta `.gitlab-ci`, que contiene la llamada `curl` para crear el engagement en esta ejecución del CI.

```bash title=".gitlab-ci/defectdojo-engagement.sh" showLineNumbers
#!/bin/bash

TODAY=$(date +%Y-%m-%d)
ENDDAY=$(date -d "+${DD_ENGAGEMENT_PERIOD} days" +%Y-%m-%d)

ENGAGEMENTID=$(curl --fail --location --request POST "${DD_SERVER}/api/v2/engagements/" \
  -H "Authorization: Token ${DD_API_KEY}" \
  -H 'Content-Type: application/json' \
  --data-raw "{
    \"tags\": [\"GITLAB-CI\"],
    \"name\": \"#${CI_PIPELINE_ID}\",
    \"description\": \"${CI_COMMIT_DESCRIPTION}\",
    \"version\": \"${CI_COMMIT_REF_NAME}\",
    \"first_contacted\": \"${TODAY}\",
    \"target_start\": \"${TODAY}\",
    \"target_end\": \"${ENDDAY}\",
    \"reason\": \"string\",
    \"tracker\": \"${CI_PROJECT_URL}/-/issues\",
    \"threat_model\": \"${DD_ENGAGEMENT_THREAT_MODEL}\",
    \"api_test\": \"${DD_ENGAGEMENT_API_TEST}\",
    \"pen_test\": \"${DD_ENGAGEMENT_PEN_TEST}\",
    \"check_list\": \"${DD_ENGAGEMENT_CHECK_LIST}\",
    \"status\": \"${DD_ENGAGEMENT_STATUS}\",
    \"engagement_type\": \"CI/CD\",
    \"build_id\": \"${CI_PIPELINE_ID}\",
    \"commit_hash\": \"${CI_COMMIT_SHORT_SHA}\",
    \"branch_tag\": \"${CI_COMMIT_REF_NAME}\",
    \"deduplication_on_engagement\": \"${DD_ENGAGEMENT_DEDUPLICATION_ON_ENGAGEMENT}\",
    \"product\": \"${DD_PRODUCTID}\",
    \"source_code_management_uri\": \"${CI_PROJECT_URL}\",
    \"build_server\": ${DD_ENGAGEMENT_BUILD_SERVER},
    \"source_code_management_server\": ${DD_ENGAGEMENT_SOURCE_CODE_MANAGEMENT_SERVER},
    \"orchestration_engine\": ${DD_ENGAGEMENT_ORCHESTRATION_ENGINE}
  }" | jq -r '.id')

echo "DD_ENGAGEMENTID=${ENGAGEMENTID}" >> defectdojo.env
```

Desde el stage `.pre` se lanza la creación del engagement llamando al script anterior.

```yaml title=".gitlab-ci.yml" showLineNumbers
defectdojo_create_engagement:
  stage: .pre
  image: alpine
  variables:
    DD_NOT_ON_MASTER: "false"
    DD_ENGAGEMENT_PERIOD: 7
    DD_ENGAGEMENT_STATUS: "Not Started"
    DD_ENGAGEMENT_BUILD_SERVER: "null"
    DD_ENGAGEMENT_SOURCE_CODE_MANAGEMENT_SERVER: "null"
    DD_ENGAGEMENT_ORCHESTRATION_ENGINE: "null"
    DD_ENGAGEMENT_DEDUPLICATION_ON_ENGAGEMENT: "false"
    DD_ENGAGEMENT_THREAT_MODEL: "true"
    DD_ENGAGEMENT_API_TEST: "true"
    DD_ENGAGEMENT_PEN_TEST: "true"
    DD_ENGAGEMENT_CHECK_LIST: "true"
  rules:
    - if: '$DD_NOT_ON_MASTER == "true" && $CI_COMMIT_BRANCH == "master"'
      when: never
    - when: always
  before_script:
    - apk add curl jq coreutils
  script:
    - sh .gitlab-ci/defectdojo-engagement.sh 
  artifacts:
    reports:
      dotenv: defectdojo.env
```

Este stage en el archivo de configuración de GitLab CI/CD se denomina "defectdojo_create_engagement".

- **stage: .pre**: Se ubica en la etapa `.pre` del pipeline, ejecutándose antes de otros stages.
- **image: alpine**: Utiliza la imagen Alpine Linux.
- **variables**: Define variables de entorno para configurar el engagement en DefectDojo.
- **rules**: Determina cuándo se ejecuta el stage.
- **before_script**: Instala las herramientas necesarias.
- **script**: Ejecuta el script para crear el engagement.
- **artifacts**: Genera un archivo `.env` que se utilizará en otros stages.

#### Findings

Para enviar los resultados de las diferentes herramientas, se utiliza un archivo en la carpeta `.gitlab-ci` llamado `defectdojo-finding.sh`, que envía los resultados a DefectDojo y al engagement correspondiente.

```bash title=".gitlab-ci/defectdojo-finding.sh" showLineNumbers
#!/bin/bash

TODAY=$(date +%Y-%m-%d)

curl --location --request POST "${DD_SERVER}/api/v2/import-scan/" \
    -H 'accept: application/json' \
    -H "Authorization: Token ${DD_API_KEY}" \
    -F "scan_date=${TODAY}" \
    -F "minimum_severity=${DD_SCAN_MINIMUM_SEVERITY}" \
    -F "active=${DD_SCAN_ACTIVE}" \
    -F "verified=${DD_SCAN_VERIFIED}" \
    -F "scan_type=${DD_SCAN_TYPE}" \
    -F "engagement=${DD_ENGAGEMENTID}" \
    -F "file=@${REPORT};type=application/json" \
    -F "close_old_findings=${DD_SCAN_CLOSE_OLD_FINDINGS}" \
    -F "environment=${DD_SCAN_ENVIRONMENT}" \
    -F "product_name=${DD_PRODUCT_NAME}"  \
    -F 'create_finding_groups_for_all_findings=true' \
    -F 'group_by=component_name+component_version'
```

### GitHub {#github-defectdojo}

#### Engagement {#github-engagement}

Una vez disponibles los datos, se crea un engagement mediante un job llamado `create_engagement`, que devuelve un ID almacenado en una variable de entorno. Este ID se transfiere a las siguientes tareas relacionadas con DefectDojo utilizando [outputs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/passing-information-between-jobs).

Las variables necesarias en el CI son:

- **DD_SERVER:** Dirección del servidor de DefectDojo.
- **DD_API_KEY:** Clave de la API para autenticarse en DefectDojo. Se almacena como secreto para no exponerla en el CI.
- **DD_PRODUCTID:** ID del producto en el que se crea el engagement.

<div style={{textAlign: 'center'}}>
![GitHub Secrets](/img/github/defectdojo-secrets.png)
</div>
<div style={{textAlign: 'center'}}>
![GitHub Variables](/img/github/defectdojo-variables.png)
</div>

Se crea un archivo llamado `defectdojo-engagement.sh` en la carpeta `.github/scripts`, que contiene la llamada curl para crear el engagement en esta ejecución del CI.

```bash title=".github/scripts/defectdojo-engagement.sh" showLineNumbers
#!/bin/bash
set -e
TODAY=$(date +%Y-%m-%d)
ENDDAY=$(date -d "+${DD_ENGAGEMENT_PERIOD} days" +%Y-%m-%d)
BRANCH_NAME=${GITHUB_REF##*/}
COMMIT_DESC=$(jq -r .head_commit.message < "$GITHUB_EVENT_PATH")
COMMIT_SHA_SHORT=${GITHUB_SHA:0:8}

curl --location --request POST "${DD_SERVER}/api/v2/engagements/" \
  -H "Authorization: Token ${DD_API_KEY}" \
  -H 'Content-Type: application/json' \
  --data-raw "{
    \"tags\": [\"GITHUB-ACTIONS\"],
    \"name\": \"#${GITHUB_RUN_ID}\",
    \"description\": \"${COMMIT_DESC}\",
    \"version\": \"${BRANCH_NAME}\",
    \"first_contacted\": \"${TODAY}\",
    \"target_start\": \"${TODAY}\",
    \"target_end\": \"${ENDDAY}\",
    \"reason\": \"CI/CD via Actions\",
    \"tracker\": \"${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/issues\",
    \"threat_model\": \"${DD_ENGAGEMENT_THREAT_MODEL}\",
    \"api_test\": \"${DD_ENGAGEMENT_API_TEST}\",
    \"pen_test\": \"${DD_ENGAGEMENT_PEN_TEST}\",
    \"check_list\": \"${DD_ENGAGEMENT_CHECK_LIST}\",
    \"status\": \"${DD_ENGAGEMENT_STATUS}\",
    \"engagement_type\": \"CI/CD\",
    \"build_id\": \"${GITHUB_RUN_ID}\",
    \"commit_hash\": \"${COMMIT_SHA_SHORT}\",
    \"branch_tag\": \"${BRANCH_NAME}\",
    \"deduplication_on_engagement\": \"${DD_ENGAGEMENT_DEDUPLICATION_ON_ENGAGEMENT}\",
    \"product\": \"${DD_PRODUCTID}\",
    \"source_code_management_uri\": \"${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}\",
    \"build_server\": ${DD_ENGAGEMENT_BUILD_SERVER},
    \"source_code_management_server\": ${DD_ENGAGEMENT_SOURCE_CODE_MANAGEMENT_SERVER},
    \"orchestration_engine\": ${DD_ENGAGEMENT_ORCHESTRATION_ENGINE}
  }" | jq -r '.id' > defectdojo.env
```

Desde el job `create_engagement` se lanza la creación del engagement llamando al script anterior.

```yaml title=".github/workflows/ci.yml" showLineNumbers
 create_engagement:
    name: DefectDojo crear engagement
    runs-on: ubuntu-latest
    container:
      image: alpine:latest
    steps:

      - name: Instalar dependencias
        run: apk add --no-cache coreutils jq curl git

      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          sparse-checkout: .github/

      - name: Crear engagement en DefectDojo
        id: dojo_eng
        run: |
         sh .github/scripts/defectdojo-engagement.sh
         export ENGAGEMENTID=$(cat defectdojo.env)
         echo "ENGAGEMENTID=$ENGAGEMENTID" >> $GITHUB_OUTPUT

    outputs:
      ENGAGEMENTID: ${{ steps.dojo_eng.outputs.ENGAGEMENTID }}
```

Este job en el archivo de configuración de GitHub Actions se denomina `create_engagement`.

- **name: DefectDojo crear engagement**: Nombre del job.
- **runs-on: ubuntu-latest**: Se ejecuta en un runner de GitHub Actions con Ubuntu.
- **container: image: alpine:latest**: Utiliza una imagen Alpine Linux.
- **steps**: Define los pasos del job.
  - **Instalar dependencias**: Instala las herramientas necesarias.
  - **Checkout repo**: Clona el repositorio.
  - **Crear engagement en DefectDojo**: Ejecuta el script para crear el engagement y extrae el ID.
- **outputs**: Define una salida llamada `ENGAGEMENTID` para su uso en otros jobs.

#### Findings {#github-findings}

Para enviar los resultados de las diferentes herramientas, se utiliza un archivo en la carpeta `.github/scripts` llamado `defectdojo-finding.sh`, que envía los resultados a DefectDojo y al engagement correspondiente.

```bash title=".github/scripts/defectdojo-finding.sh" showLineNumbers
#!/bin/bash
set -e
TODAY=$(date +%Y-%m-%d)

curl --location --request POST "${DD_SERVER}/api/v2/import-scan/" \
    -H 'accept: application/json' \
    -H "Authorization: Token ${DD_API_KEY}" \
    -F "scan_date=${TODAY}" \
    -F "minimum_severity=${DD_SCAN_MINIMUM_SEVERITY}" \
    -F "active=${DD_SCAN_ACTIVE}" \
    -F "verified=${DD_SCAN_VERIFIED}" \
    -F "scan_type=${DD_SCAN_TYPE}" \
    -F "engagement=${DD_ENGAGEMENTID}" \
    -F "file=@${DD_SCAN_FILE};type=application/json" \
    -F "close_old_findings=${DD_SCAN_CLOSE_OLD_FINDINGS}" \
    -F "environment=${DD_SCAN_ENVIRONMENT}" \
    -F "product_name=${DD_PRODUCT_NAME}"  \
    -F 'create_finding_groups_for_all_findings=true' \
    -F 'group_by=component_name+component_version'
```

### Jenkins {#jenkins-defectdojo}

#### Engagement {#jenkins-engagement}

Una vez disponibles los datos, se crea un engagement mediante un stage denominado `Create Engagement`, que devuelve un ID almacenado en una variable de entorno. Este ID se transfiere a las siguientes tareas relacionadas con DefectDojo utilizando el artefacto '[artifacts:reports:dotenv'](https://www.jenkins.io/doc/pipeline/steps/core/#archiveartifacts-archive-the-artifacts).

Es necesario instalar el plugin `Pipeline Utility Steps` para poder analizar los datos del artefacto.

Las variables necesarias en el CI son:

**DD_API_KEY:** Clave de la API para autenticarse en DefectDojo.

![Jenkins Credentials](/img/jenkins/defectdojo-credentials.png)

Se crea un archivo llamado `defectdojo-engagement.sh` en la carpeta `.jenkins-ci`, que contiene la llamada curl para crear el engagement en esta ejecución del CI.

```bash title=".jenkins-ci/defectdojo-engagement.sh" showLineNumbers
#!/bin/bash

TODAY=$(date +%Y-%m-%d)
ENDDAY=$(date -d "+${DD_ENGAGEMENT_PERIOD} days" +%Y-%m-%d)

CI_PROJECT_URL='https://example.com/osdo'

CI_COMMIT_DESCRIPTION=$(git log -1 --pretty=%B)

ENGAGEMENTID=$(curl --location --request POST "${DD_SERVER}/api/v2/engagements/" \
  -H "Authorization: Token ${DD_API_KEY}" \
  -H 'Content-Type: application/json' \
  --data-raw "{
    \"tags\": [\"GITLAB-CI\"],
    \"name\": \"#${BUILD_NUMBER}\",
    \"description\": \"${CI_COMMIT_DESCRIPTION}\",
    \"version\": \"${GIT_BRANCH}\",
    \"first_contacted\": \"${TODAY}\",
    \"target_start\": \"${TODAY}\",
    \"target_end\": \"${ENDDAY}\",
    \"reason\": \"string\",
    \"tracker\": \"${CI_PROJECT_URL}/-/issues\",
    \"threat_model\": \"${DD_ENGAGEMENT_THREAT_MODEL}\",
    \"api_test\": \"${DD_ENGAGEMENT_API_TEST}\",
    \"pen_test\": \"${DD_ENGAGEMENT_PEN_TEST}\",
    \"check_list\": \"${DD_ENGAGEMENT_CHECK_LIST}\",
    \"status\": \"${DD_ENGAGEMENT_STATUS}\",
    \"engagement_type\": \"CI/CD\",
    \"build_id\": \"${BUILD_NUMBER}\",
    \"commit_hash\": \"${GIT_COMMIT:0:7}\",
    \"branch_tag\": \"${GIT_BRANCH}\",
    \"deduplication_on_engagement\": \"${DD_ENGAGEMENT_DEDUPLICATION_ON_ENGAGEMENT}\",
    \"product\": \"${DD_PRODUCTID}\",
    \"source_code_management_uri\": \"${CI_PROJECT_URL}\",
    \"build_server\": ${DD_ENGAGEMENT_BUILD_SERVER},
    \"source_code_management_server\": ${DD_ENGAGEMENT_SOURCE_CODE_MANAGEMENT_SERVER},
    \"orchestration_engine\": ${DD_ENGAGEMENT_ORCHESTRATION_ENGINE}
  }" | jq -r '.id')

echo "DD_ENGAGEMENTID=${ENGAGEMENTID}" > defectdojo.env
```

Desde el stage `Create Engagement` se lanza la creación del engagement llamando al script anterior.

```groovy title="Jenkinsfile" showLineNumbers
pipeline {
    agent any
    environment {
        DD_SERVER='https://defectd.opensecdevops.com'
    }
    stages {
        stage('Create Engagement') {
            environment {
                DD_ENGAGEMENT_PERIOD              = '7'
                DD_ENGAGEMENT_STATUS              = 'Not Started'
                DD_ENGAGEMENT_BUILD_SERVER        = 'null'
                DD_ENGAGEMENT_SOURCE_CODE_MANAGEMENT_SERVER = 'null'
                DD_ENGAGEMENT_ORCHESTRATION_ENGINE= 'null'
                DD_ENGAGEMENT_DEDUPLICATION_ON_ENGAGEMENT = 'false'
                DD_ENGAGEMENT_THREAT_MODEL        = 'true'
                DD_ENGAGEMENT_API_TEST            = 'true'
                DD_ENGAGEMENT_PEN_TEST            = 'true'
                DD_ENGAGEMENT_CHECK_LIST          = 'true'
                DD_PRODUCTID                      = '1'
            }
            steps {
                sh 'chmod +x .jenkis-ci/defectdojo-engagement.sh'
                withCredentials([string(credentialsId: 'DD_API_KEY', variable: 'DD_API_KEY')]) {
                        sh './.jenkis-ci/defectdojo-engagement.sh'
                }
                archiveArtifacts artifacts: 'defectdojo.env', fingerprint: true
            }
        }
    }
}
```

Este stage en el archivo de configuración de Jenkins se denomina `Create Engagement`.

- **environment**: Define variables de entorno para configurar el engagement en DefectDojo.
- **steps**: Ejecuta el script para crear el engagement.

#### Findings {#jenkins-findings}

Para enviar los resultados de las diferentes herramientas, se utiliza un archivo en la carpeta `.jenkins-ci` llamado `defectdojo-finding.sh`, que envía los resultados a DefectDojo y al engagement correspondiente.

```bash title=".jenkins-ci/defectdojo-finding.sh" showLineNumbers
#!/bin/bash

TODAY=$(date +%Y-%m-%d)

curl --location --request POST "${DD_SERVER}/api/v2/import-scan/" \
    -H 'accept: application/json' \
    -H "Authorization: Token ${DD_API_KEY}" \
    -F "scan_date=${TODAY}" \
    -F "minimum_severity=${DD_SCAN_MINIMUM_SEVERITY}" \
    -F "active=${DD_SCAN_ACTIVE}" \
    -F "verified=${DD_SCAN_VERIFIED}" \
    -F "scan_type=${DD_SCAN_TYPE}" \
    -F "engagement=${DD_ENGAGEMENTID}" \
    -F "file=@${REPORT};type=application/json" \
    -F "close_old_findings=${DD_SCAN_CLOSE_OLD_FINDINGS}" \
    -F "environment=${DD_SCAN_ENVIRONMENT}" \
    -F "product_name=${DD_PRODUCT_NAME}"  \
    -F 'create_finding_groups_for_all_findings=true' \
    -F 'group_by=component_name+component_version'
```

## Dependency-track

Para integrar [Dependency-track](../infrastructura/dependency-track), el primer paso es crear un [proyecto](../infrastructura/dependency-track/proyecto.md).

Para esta integración, se utiliza la API de Dependency-Track, que requiere autenticación. La información necesaria se encuentra en **Administration > Access Management > Teams**. Se puede utilizar el equipo `Automation` o crear uno propio. Al hacer clic en el equipo, se obtiene una API KEY y los permisos mínimos necesarios para la integración.

![API KEY](/img/dependency-track/api-token.png)

También es necesario el ID del proyecto, que se obtiene de la URL al acceder al proyecto correspondiente.

![Project ID](/img/dependency-track/id_project.png)

### GitLab {#gitlab-dependency-track}

Las variables necesarias en el CI son:

- **DT_SERVER**: Dirección del servidor de Dependency-Track.
- **DT_API_KEY**: Clave de la API para autenticarse en Dependency-Track. Se recomienda marcar el atributo 'mask' para que no se muestre en los registros.
- **DT_PROJECT_ID**: ID del proyecto a integrar.

![GitLab CI/CD Variables](/img/dependency-track/CI_CD_variables-gitlab.png)

Para enviar los resultados a Dependency-Track, se utiliza un archivo en la carpeta `.gitlab-ci` llamado `dependency-track.sh`, que envía los resultados a Dependency-Track y al proyecto correspondiente.

```bash title=".gitlab-ci/dependency-track.sh" showLineNumbers
#!/bin/bash

curl --location --request "POST" "${DT_SERVER}/api/v1/bom" \
        -H "X-Api-Key: ${DT_API_KEY}" \
        -F "project=${DT_PROJECT_ID}" \
        -F "projectVersion=${CI_COMMIT_BRANCH}" \
        -F "bom=@${REPORT}" -f
```

### GitHub {#github-dependency-track}

Las variables necesarias en el CI son:

- **DT_SERVER**: Dirección del servidor de Dependency-Track.
- **DT_API_KEY**: Clave de la API para autenticarse en Dependency-Track. Se almacena como secreto para no exponerla en el CI.
- **DT_PROJECT_ID**: ID del proyecto a integrar.

![GitHub Secrets](/img/github/dependency-track-secrets.png)
![GitHub Variables](/img/github/dependency-track-variables.png)

Se crea un archivo llamado `dependency-track.sh` en la carpeta `.github/scripts`, que contiene la llamada curl para enviar los resultados a Dependency-Track y al proyecto correspondiente.

```bash title=".github/scripts/dependency-track.sh" showLineNumbers
#!/bin/bash
set -e

curl -i --location --request POST "${DT_SERVER}/api/v1/bom" \
     -H "X-Api-Key: ${DT_API_KEY}" \
     -F "project=${DT_PROJECT_ID}" \
     -F "bom=@${REPORT}" -f
```

### Jenkins {#jenkins-dependency-track}

Las variables necesarias en el CI son:

- **DT_API_KEY**: Clave de la API para autenticarse en Dependency-Track.

![Jenkins Credentials](/img/jenkins/dependency-track-credentials.png)

Para enviar los resultados a Dependency-Track, se utiliza un archivo en la carpeta `.jenkins-ci` llamado `dependency-track.sh`, que envía los resultados a Dependency-Track y al proyecto correspondiente.

```bash title=".jenkins-ci/dependency-track.sh" showLineNumbers
#!/bin/bash

curl --location --request "POST" "${DT_SERVER}/api/v1/bom" \
        -H "X-Api-Key: ${DT_API_KEY}" \
        -F "project=${DT_PROJECT_ID}" \
        -F "projectVersion=${CI_COMMIT_BRANCH}" \
        -F "bom=@${REPORT}" -f
```
