# OWASP ZAP

OWASP ZAP (Zed Attack Proxy) es una herramienta de código abierto ampliamente utilizada para realizar pruebas de seguridad automatizadas y manuales en aplicaciones web. Desarrollada por la comunidad de seguridad de OWASP, ZAP se ha convertido en una opción esencial para los profesionales de la seguridad y los desarrolladores de aplicaciones web que desean identificar y mitigar vulnerabilidades. Su interfaz fácil de usar y sus poderosas capacidades lo convierten en una herramienta valiosa en la lucha contra las amenazas de seguridad en aplicaciones en línea.

## Características Principales

- **Escaneo automatizado:** ZAP puede realizar escaneos automatizados para detectar una amplia gama de vulnerabilidades comunes, como inyecciones SQL, XSS, CSRF y muchas más.
- **Exploración de aplicaciones:** Puede mapear la estructura de una aplicación web, identificando todas sus páginas y funcionalidades, lo que facilita la detección de posibles vulnerabilidades.
- **Ataques de fuzzing:** Permite realizar ataques de fuzzing para probar la resistencia de la aplicación a entradas no válidas o maliciosas.
- **Spidering avanzado:** ZAP realiza spidering avanzado para recopilar datos sobre la aplicación, identificar vulnerabilidades ocultas y generar mapas de sitio web.
- **Interceptación de Proxy:** Actúa como proxy entre el navegador y la aplicación, lo que permite a los usuarios interceptar y modificar solicitudes y respuestas HTTP para pruebas manuales.
- **Soporte de scripts:** ZAP admite scripts personalizados en varios lenguajes, lo que permite a los usuarios realizar pruebas específicas y automatizar tareas repetitivas.
- **Generación de informes:** Genera informes detallados que incluyen descripciones de vulnerabilidades, ubicaciones y recomendaciones para su corrección.
- **Integración CI/CD:** Puede integrarse en pipelines de CI/CD para realizar pruebas automáticas en cada etapa del ciclo de desarrollo.
- **Autenticación y sesiones:** Permite configurar autenticación y gestionar sesiones para probar aplicaciones que requieren inicio de sesión.
- **Soporte activo:** ZAP es respaldado por una comunidad activa de usuarios y desarrolladores que brindan soporte y mantienen actualizadas sus capacidades de detección.
- **Personalización:** Los usuarios pueden personalizar fácilmente el alcance y la configuración de las pruebas para adaptarse a sus necesidades específicas.

Para poder usarlo tenemos que usar la parte de sistema automatico de OWASP ZAP si quieres ampliar la información es muy recomendable el siguiente [vídeo](https://www.youtube.com/watch?v=TTiW5NPJlwY).

## Configuración contexto

Para poder utilizar OWASP ZAP en nuestro CI, lo primero que debemos hacer es configurarlo desde la interfaz para establecer la instancia que se usará en el pipeline.

Abre OWASP ZAP y haz clic en `Default Context` en la barra lateral izquierda. En la ventana que se abre, selecciona `Authentication`, donde podrás configurar cómo se realiza el inicio de sesión en nuestra aplicación.

<div style={{textAlign: 'center'}}>
![Authentication Context](/img/owasp/auth.png)
</div>

Disponemos de los siguientes tipos de autenticación:

- **Autenticación manual**: Permite a los usuarios autenticarse manualmente, como en un navegador usando proxy, seleccionando después la sesión HTTP. No soporta reautenticación, pero ZAP mantiene estadísticas con estrategias de verificación.

- **Autenticación basada en formularios**: Utiliza envío de formulario o solicitud GET para autenticarse con credenciales usuario/contraseña. Soporta reautenticación y configuración a través de la pantalla Autenticación de contextos de sesión o menús contextuales.

- **Autenticación basada en JSON**: Similar a la autenticación basada en formularios, pero utiliza un objeto JSON enviado a una URL específica. Permite reautenticación y configuración de credenciales usuario/contraseña.

- **Autenticación HTTP/NTLM**: Emplea mecanismos HTTP o NTLM con encabezados en mensajes HTTP. Soporta esquemas de autenticación Básico, Digest, NTLM y permite reautenticación con envío de encabezados en cada solicitud.

- **Autenticación basada en scripts**: Ideal para procesos de autenticación complejos, requiere definir un script personalizado que maneje la autenticación. Permite reautenticación y configuración mediante parámetros definidos en el script

Tenemos que seleccionar el tipo de autenticación que se ajuste a nuestra aplicación. Por ejemplo, si nuestra aplicación utiliza un formulario de inicio de sesión, seleccionaremos "Autenticación basada en formularios".

Una vez seleccionado, debemos completar los campos necesarios, como la URL de inicio de sesión, el nombre de usuario y la contraseña. También podemos configurar las URLs de inicio de sesión y cierre de sesión, así como los parámetros del formulario.

<div style={{textAlign: 'center'}}>
![Form Authentication](/img/owasp/form_auth.png)
</div>

Ahora nos dirigimos a la seccion de `Users` donde podemos añadir los usuarios que se utilizarán para las pruebas de autenticación. Hacemos clic en `Add User` y completamos los campos necesarios, como el nombre de usuario y la contraseña.

<div style={{textAlign: 'center'}}>
![Add User](/img/owasp/add_user.png)
</div>

Nos falta añadir el contexto a nuestro proyecto. Para ello, hacemos clic en `Add Context` y completamos los campos necesarios, como el nombre del contexto y la URL base de la aplicación.

<div style={{textAlign: 'center'}}>
![Add Context](/img/owasp/add_context.png)
</div>

Ahora en el menu de abajo seleccionamos el `+` y en el menu desplegable selecionamos `Automation` esto nos abrira un ventana donde podemos configurar las opciones de automatización.

<div style={{textAlign: 'center'}}>
![Automation Options](/img/owasp/automation_options.png)
</div>

Con la automatización creada vamos a configurar sus diferentes opciones, si hacemos click sobre cada una de las tareas que hemos creado, podemos ver las diferentes opciones que tenemos para configurar.

<div style={{textAlign: 'center'}}>
![Automation Tasks](/img/owasp/automation_tasks.png)
</div>

Aqui ya depende de nuestras necesidades de  la aplicación por lo que mejor que veas el [vídeo](https://www.youtube.com/watch?v=TTiW5NPJlwY) para ver como se configura cada una de las tareas.

La unica tarea que vamos a revisar aquí es la de reporte para configurarla y poder generar el reporte en XML y mandarla al DefectDojo, para ello hacemos click en la tarea de `Report` y configuramos las opciones de salida del reporte en la pestaña `Plantilla` donde selectionamos `Traditional XML Report`

<div style={{textAlign: 'center'}}>
![Automation Report](/img/owasp/automation_report_report.png)
</div>

Cuando tengamos todo configurado, podemos hacer click en `Save Plan...` para guardar la configuración de la automatización, esto nos generara un fichero `yaml` con la configuración de la automatización que podremos usar en nuestro pipeline de CI.

En la configuración apareceran la URL de despliegue, el usuario y la contraseña que hemos configurado en el contexto, así como las tareas que hemos creado.

```yaml title="zap.yaml" showLineNumbers
env:
  contexts:
  - name: Contexto predeterminado
    urls:
    - URL_DEPLOY
    includePaths:
    - URL_DEPLOY.*
    authentication:
      method: json
      parameters:
        loginPageUrl: URL_DEPLOY/login
        loginRequestUrl: URL_DEPLOY/login
        loginRequestBody: "{\"email\":\"{%username%}\",\"password\":\"{%password%}\"\
          ,\"remember\":\"\"}"
      verification:
        method: autodetect
        pollFrequency: 60
        pollUnits: requests
        pollUrl: ""
        pollPostData: ""
    sessionManagement:
      method: cookie
    technology: {}
    structure: {}
    users:
    - name: ADMIN
      credentials:
        password: PASSWORD
        username: PASSWORD
  parameters: {}
jobs:
- type: passiveScan-config
  parameters: {}
- type: spider
  parameters:
    context: Contexto predeterminado
    user: ADMIN
    url: URL_DEPLOY
    maxDepth: 0
    handleODataParametersVisited: true
    maxParseSizeBytes: 11000000
    parseDsStore: null
  tests:
  - name: Al menos 100 URLs encontradas
    type: stats
    onFail: INFO
    statistic: automation.spider.urls.added
    operator: '>='
    value: 100
- type: spiderAjax
  parameters:
    context: Contexto predeterminado
    user: ADMIN
    url: URL_DEPLOY
    numberOfBrowsers: 1
    browserId: null
  tests:
  - name: Al menos 100 URLs encontradas
    type: stats
    onFail: INFO
    statistic: spiderAjax.urls.added
    operator: '>='
    value: 100
- type: passiveScan-wait
  parameters: {}
- type: report
  parameters:
    template: traditional-xml
    theme: null
    reportTitle: ZAP por Informe de Escaneo Checkmarx
    reportDir: "CI_PROJECT_DIR"
    reportFile: DD_SCAN_FILE
  risks:
  - info
  - low
  - medium
  - high
  confidences:
  - falsepositive
  - low
  - medium
  - high
  - confirmed
```

Para evitar que el fichero tenga información sensible, como el usuario y la contraseña, podemos usar variables de entorno en el fichero `yaml` que se sustituirán por los valores reales en el momento de la ejecución del pipeline.

## GitLab

```bash title=".gitlab-ci/zap_automation_baseline_scan.yaml" showLineNumbers
#!/bin/bash

URL_DEPLOY="https://${CI_COMMIT_REF_SLUG}-app.opensecdevops.com"

sed -i "s|PASSWORD|${PASSWORD_ZAP}|g" .gitlab-ci/zap.yaml
sed -i "s|USERNAME|${USERNAME_ZAP}|g" .gitlab-ci/zap.yaml
sed -i "s|URL_DEPLOY|${URL_DEPLOY}|g" .gitlab-ci/zap.yaml
sed -i "s|DD_SCAN_FILE|${DD_SCAN_FILE}|g" .gitlab-ci/zap.yaml

ESCAPED_CI_PROJECT_DIR=$(sed -e 's/[&\\/]/\\&/g; s/$/\\/' -e '$s/\\$//' <<<"$CI_PROJECT_DIR")
sed -i "s/CI_PROJECT_DIR/$ESCAPED_CI_PROJECT_DIR/g" .gitlab-ci/zap.yaml

/zap/zap.sh -cmd -autorun $CI_PROJECT_DIR/.gitlab-ci/zap.yaml
```

Este script Bash está diseñado para automatizar la ejecución de OWASP ZAP en un pipeline de GitLab CI, personalizando dinámicamente el archivo de configuración `zap.yaml` antes de lanzar el escaneo. A continuación se explica cada parte:

- **Definición de variables:** `URL_DEPLOY` define la URL de despliegue de la aplicación que se va a analizar.
- **Sustitución de variables sensibles y de entorno:**  Utiliza el comando `sed` para reemplazar en el archivo `.gitlab-ci/zap.yaml` los siguientes valores por sus correspondientes variables de entorno:
  - `PASSWORD` se sustituye por el valor de `${PASSWORD_ZAP}`.
  - `USERNAME` se sustituye por el valor de `${USERNAME_ZAP}`.
  - `URL_DEPLOY` se sustituye por el valor de `${URL_DEPLOY}`.
  - `DD_SCAN_FILE` se sustituye por el valor de `${DD_SCAN_FILE}`.
- **Sustitución de la ruta del proyecto:** Escapa correctamente la variable `CI_PROJECT_DIR` para evitar problemas con caracteres especiales y la reemplaza en el archivo de configuración.
- **Ejecución de OWASP ZAP:** Finalmente, ejecuta OWASP ZAP en modo automático (`-cmd -autorun`) usando el archivo de configuración ya personalizado, lanzando el escaneo sobre la aplicación desplegada.

```yaml title=".gitlab-ci.yml" showLineNumbers
zap-automation-baseline-scan:
  stage: dast_osdo
  variables:
    DD_SCAN_FILE: zap-result.xml
  image:
    name: zaproxy/zap-stable
    entrypoint: [""]
  script:
    - bash .gitlab-ci/zap_automation_baseline_scan.sh
  artifacts:
    when: always
    expire_in: 1 day
    paths:
      - ${CI_PROJECT_DIR}/${DD_SCAN_FILE}
```

- **image**: Utiliza la imagen oficial de OWASP ZAP (`zaproxy/zap-stable`), que incluye todas las herramientas necesarias para ejecutar escaneos de seguridad automatizados sobre aplicaciones web.
- **variables**: Define variables de entorno necesarias para el proceso y la integración con DefectDojo:
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por ZAP (`zap-result.xml`).
- **script**: Ejecuta los comandos principales del job:
  - Llama al script `zap_automation_baseline_scan.sh`, que personaliza el archivo de configuración de ZAP con las variables de entorno y ejecuta el escaneo automatizado sobre la aplicación desplegada.
- **artifacts**: Especifica que el archivo de reporte generado (`zap-result.xml`) debe conservarse como artefacto durante 1 día, permitiendo su revisión o uso en otros jobs, incluso si el job falla (`when: always`).
- **stage**: Es importante que el stage no se llame simplemente `dast` si no se dispone de la versión premium de GitLab, ya que en la versión gratuita este nombre está reservado y puede provocar errores en la ejecución del pipeline. Se recomienda utilizar un nombre alternativo como `dast_osdo` o similar.

### DefectDojo {#gitlab-defectdojo}

```yaml title=".gitlab-ci.yml" showLineNumbers
zap-automation-baseline-scan:
  stage: dast_osdo
  dependencies: ["defectdojo_create_engagement"]
  variables:
    DD_SCAN_TYPE: "ZAP Scan"
    DD_PRODUCT_NAME: "ZAP Scan"
    DD_SCAN_ACTIVE: "true"
    DD_SCAN_VERIFIED: "false"
    DD_SCAN_FILE: zap-result.xml
  image:
    name: zaproxy/zap-stable
    entrypoint: [""]
  script:
    - bash .gitlab-ci/zap_automation_baseline_scan.sh
  after_script:
    - bash .gitlab-ci/defectdojo-finding.sh
  artifacts:
    when: always
    expire_in: 1 day
    paths:
      - ${CI_PROJECT_DIR}/${DD_SCAN_FILE}
```

- **image**: Utiliza la imagen oficial de OWASP ZAP (`zaproxy/zap-stable`), que incluye todas las herramientas necesarias para ejecutar escaneos de seguridad automatizados sobre aplicaciones web.
- **dependencies**: Indica que este job depende del job `defectdojo_create_engagement`, asegurando que el engagement en DefectDojo esté creado antes de subir los resultados del escaneo.
- **variables**: Define variables de entorno necesarias para el proceso y la integración con DefectDojo:
  - **DD_SCAN_TYPE**: Tipo de escaneo realizado, en este caso "ZAP Scan".
  - **DD_PRODUCT_NAME**: Nombre del producto o herramienta, aquí "ZAP Scan".
  - **DD_SCAN_ACTIVE** y **DD_SCAN_VERIFIED**: Estado del hallazgo en DefectDojo.
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por ZAP (`zap-result.xml`).
- **script**: Ejecuta los comandos principales del job:
  - Llama al script `zap_automation_baseline_scan.sh`, que personaliza el archivo de configuración de ZAP con las variables de entorno y ejecuta el escaneo automatizado sobre la aplicación desplegada.
- **after_script**: Ejecuta el script `defectdojo-finding.sh` para subir el reporte generado a DefectDojo, permitiendo su gestión y visualización centralizada.
- **artifacts**: Especifica que el archivo de reporte generado (`zap-result.xml`) debe conservarse como artefacto durante 1 día, permitiendo su revisión o uso en otros jobs, incluso si el job falla (`when: always`).
- **stage**: Es importante que el stage no se llame simplemente `dast` si no se dispone de la versión premium de GitLab, ya que en la versión gratuita este nombre está reservado y puede provocar errores en la ejecución del pipeline. Se recomienda utilizar un nombre alternativo como `dast_osdo` o similar.

## GitHub

```bash title=".github/workflows/ci.sh" showLineNumbers
  dast:
    runs-on: ubuntu-latest
    env:
      PASSWORD_ZAP: ${{ secrets.PASSWORD_ZAP }}
      USERNAME_ZAP: ${{ vars.USERNAME_ZAP }}
      DD_SCAN_FILE: 'dast_scan.xml'
      DD_PRODUCT_NAME: 'ZAP Scan'
      DD_SCAN_TYPE: 'ZAP Scan'
      DD_SCAN_ACTIVE: 'true'
      DD_SCAN_VERIFIED: 'false'
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          sparse-checkout: .github/

      - name: Prepare config
        run: |
          echo "DAST configuration is set up."
          bash .github/scripts/zap_automation_baseline_scan.sh

      - name: Ejecutar OWASP ZAP Baseline Scan
        run: |
          docker run -v ${{ github.workspace }}/.github/scripts:/zap/wrk/:rw -t zaproxy/zap-stable zap.sh -cmd -autorun wrk/zap.yml
          
      - name: Upload DAST report to DefectDojo
        run: |
          bash .github/scripts/defectdojo-finding.sh
```

- **name**: Define el nombre del job como `dast`, facilitando su identificación dentro del workflow de GitHub Actions.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **env**: Define variables de entorno necesarias para la ejecución del escaneo DAST y la integración con DefectDojo:
  - **PASSWORD_ZAP**: Contraseña para autenticación en ZAP, almacenada como secreto.
  - **USERNAME_ZAP**: Usuario para autenticación en ZAP, almacenado como variable.
  - **DD_SCAN_FILE**: Nombre del archivo de reporte generado por ZAP.
  - **DD_PRODUCT_NAME**: Nombre del producto o herramienta, aquí "ZAP Scan".
  - **DD_SCAN_TYPE**: Tipo de escaneo realizado, en este caso "ZAP Scan".
  - **DD_SCAN_ACTIVE** y **DD_SCAN_VERIFIED**: Estado del hallazgo en DefectDojo.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Checkout repo**: Usa la acción `actions/checkout@v4` para clonar el repositorio, limitando la descarga a la carpeta `.github/` mediante `sparse-checkout`.
  - **Prepare config**: Ejecuta un script que prepara la configuración de ZAP, sustituyendo variables sensibles y de entorno en el archivo de configuración antes de lanzar el escaneo.
  - **Ejecutar OWASP ZAP Baseline Scan**: Ejecuta el contenedor oficial de ZAP (`zaproxy/zap-stable`) con el comando necesario para lanzar el escaneo automatizado usando el archivo de configuración preparado.
  - **Upload DAST report to DefectDojo**: Ejecuta un script que sube el reporte generado por ZAP a DefectDojo para su gestión y visualización centralizada.

Esta estructura permite automatizar el escaneo de seguridad DAST con OWASP ZAP en GitHub Actions, integrando los resultados con DefectDojo y manteniendo la seguridad de las credenciales mediante el uso de secretos y variables.
