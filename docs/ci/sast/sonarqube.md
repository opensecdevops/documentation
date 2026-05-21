# SonarQube

SonarQube es una plataforma de código abierto utilizada para evaluar y mejorar la calidad del código fuente de aplicaciones y proyectos de software. Ofrece una solución integral para identificar y corregir problemas de código, garantizar la conformidad con buenas prácticas de codificación y mejorar la seguridad y confiabilidad del software.

## Características principales

- **Análisis estático del código:** SonarQube realiza análisis estáticos exhaustivos del código fuente en busca de vulnerabilidades, errores y problemas de calidad sin necesidad de ejecutar la aplicación.
- **Detección de vulnerabilidades:** Identifica vulnerabilidades comunes de seguridad, como inyecciones SQL, problemas de seguridad de datos, autenticación y autorización, entre otros.
- **Medición de la complejidad:** Evalúa la complejidad del código, identificando áreas que pueden ser difíciles de mantener y propensas a errores.
- **Integración continua y entrega continua (CI/CD):** Puede integrarse en pipelines de CI/CD, permitiendo la evaluación automática del código en cada etapa del ciclo de desarrollo.
- **Calidad del código:** Proporciona puntuaciones y métricas de calidad del código, ayudando a los equipos a mantener un estándar definido.
- **Soporte para múltiples lenguajes:** SonarQube es compatible con una amplia gama de lenguajes de programación, incluidos Java, C#, JavaScript, Python, Ruby y más.
- **Gestión de deuda técnica:** Identifica y prioriza la deuda técnica, permitiendo a los equipos abordar problemas críticos primero.
- **Paneles de control personalizables:** Ofrece paneles de control personalizables y visualizaciones de datos para un seguimiento y toma de decisiones efectivos.
- **Escaneos programados:** Permite la programación de escaneos regulares para mantener la calidad del código a lo largo del tiempo.
- **Integración con IDEs:** Proporciona extensiones para IDEs populares, permitiendo a los desarrolladores identificar y solucionar problemas de código mientras escriben.
- **Seguridad y conformidad:** Ayuda a cumplir con regulaciones de seguridad y conformidad al identificar y solucionar problemas de seguridad.
- **Integración con otras herramientas:** Se integra con otras herramientas de desarrollo, como sistemas de control de versiones, gestión de proyectos y gestión de dependencias.

## Uso

Para comenzar, es necesario crear un proyecto en SonarQube. Accede a la interfaz web de SonarQube y selecciona `Create Project -> Manually`. Esta opción es útil si ya existe un proyecto en SonarQube o si se prefiere hacerlo manualmente. No es necesario realizar una integración global, ya que no todos los proyectos pueden estar en el mismo proveedor de repositorios, como GitLab o GitHub.

<div style={{textAlign: 'center'}}>
![Crear proyecto](/img/sonarqube/create_project.png)
</div>

A continuación, se solicitará la siguiente información:

<div style={{textAlign: 'center'}}>
![Datos proyecto](/img/sonarqube/create_project_add_data.png)
</div>

- Nombre del proyecto.
- Clave única del proyecto (Key).
- Rama principal del proyecto.

Con estos datos, se configura cómo tratar el código nuevo. Existen varias opciones:

- "Versión previa": Considera como código nuevo cualquier cambio desde la versión anterior.
- "Número de días": Considera como código nuevo cualquier cambio realizado en los últimos x días.
- "Rama de referencia": Elige una rama como base para el código nuevo.

<div style={{textAlign: 'center'}}>
![Datos proyecto](/img/sonarqube/new_code.png)
</div>
Una vez creado el proyecto, se puede integrarlo con el sistema de Integración Continua (CI) para diferentes proveedores de CI.

<div style={{textAlign: 'center'}}>
![Configuración repositiro analizar](/img/sonarqube/analyze_repository.png)
</div>

### GitLab

El primer paso es generar un token, ajustando su duración según las necesidades. Es importante guardar este token, ya que solo se muestra una vez.

<div style={{textAlign: 'center'}}>
![Primer paso wizard](/img/sonarqube/gitlab-wizard-1.png)
</div>

<div style={{textAlign: 'center'}}>
![Crear Token](/img/sonarqube/create_token.png)
</div>

Agregamos el token generado en el campo correspondiente de las variables de CI/CD de GitLab. Para ello, se accede a la sección de configuración del proyecto en GitLab, se selecciona "CI/CD" y luego "Variables". Aquí se crea una nueva variable llamada `SONAR_TOKEN` y se pega el token generado.

<div style={{textAlign: 'center'}}>
![Gitlab variable](/img/sonarqube/gitlab-variable.png)
</div>

Luego, se selecciona el tipo de proyecto y se muestran configuraciones adaptadas. En este caso, se explica cómo enviar los resultados de las pruebas realizadas en el stage de testing para visualizar fácilmente los porcentajes de cobertura.

```yml title=".gitlab-ci.yml" showLineNumbers
sonarqube-check:
  stage: test
  dependencies: ['phpunit']
  image: 
    name: sonarsource/sonar-scanner-cli:latest
    entrypoint: [""]
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"  # Defines the location of the analysis task cache
    GIT_DEPTH: "0"  # Tells git to fetch all the branches of the project, required by the analysis task
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script: 
    - sonar-scanner
  allow_failure: true
```

Finalmente, se llega al último paso y el sistema quedará a la espera de que se realice el primer commit de código para su análisis. Durante el análisis, se puede obtener información sobre errores, código problemático, vulnerabilidades, revisiones de seguridad, líneas duplicadas y cobertura de código.

<div style={{textAlign: 'center'}}>
![Tercer paso wizard](/img/sonarqube/gitlab-wizard-3.png)
</div>

<div style={{textAlign: 'center'}}>
![Analisis](/img/sonarqube/analysis.png)
</div>

### GitHub

Para integrar SonarQube con GitHub, se debe generar un token de acceso personal en GitHub y configurarlo en SonarQube. Este token se utilizará para autenticar las solicitudes de análisis.

<div style={{textAlign: 'center'}}>
![Crear Token GitHub](/img/sonarqube/github-wizard-1.png)
</div>

<div style={{textAlign: 'center'}}>
![Crear Token](/img/sonarqube/create_token.png)
</div>

Agregamos el token generado en el campo correspondiente de las variables de GitHub Actions. Para ello, se accede a la configuración del repositorio en GitHub, se selecciona `Settings -> Secrets and variables -> Actions`. Aquí se crea un nuevo secreto llamado `SONAR_TOKEN` y una variable llamada `SONAR_HOST_URL` con la URL del servidor SonarQube (por ejemplo, `https://sonar.opensecdevops.com`).

<div style={{textAlign: 'center'}}>
![GitHub variable](/img/sonarqube/github-secret.png)
</div>

<div style={{textAlign: 'center'}}>
![GitHub variable](/img/sonarqube/github-variable.png)
</div>

Luego, se configura el archivo de flujo de trabajo de GitHub Actions (`.github/workflows/ci.yml`) para ejecutar el análisis de SonarQube. A continuación se muestra un ejemplo de configuración:

```yaml title=".github/workflows/ci.yml" showLineNumbers
sonarqube:
    name: SonarQube
    runs-on: self-hosted
    needs: [composer, npm, phpunit]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Necesario para SonarQube
      - uses: SonarSource/sonarqube-scan-action@v5
        continue-on-error: true
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ vars.SONAR_HOST_URL }}
```

Finalmente, se llega al último paso y el sistema quedará a la espera de que se realice el primer commit de código para su análisis. Durante el análisis, se puede obtener información sobre errores, código problemático, vulnerabilidades, revisiones de seguridad, líneas duplicadas y cobertura de código.

<div style={{textAlign: 'center'}}>
![Analisis](/img/sonarqube/analysis.png)
</div>

### Jenkins

Para integrar SonarQube con Jenkins, podemos hacerlo de dos maneras: utilizando el plugin de SonarQube para Jenkins o ejecutando el análisis directamente desde un contenedor Docker. En este caso, se opta por la segunda opción, que permite una mayor flexibilidad y control sobre el entorno de ejecución.

Creamos el token de acceso en SonarQube, que se utilizará para autenticar las solicitudes de análisis desde Jenkins. Este token se generará en la sección de configuración del usuario en SonarQube.
<div style={{textAlign: 'center'}}>
![Crear Token](/img/sonarqube/create_token.png)
</div>

Para ello, es necesario tener instalado Docker en el servidor de Jenkins y configurar las credenciales de SonarQube en Jenkins. Esto se hace accediendo a `Jenkins -> Manage Jenkins -> Configure System` y añadiendo las credenciales de SonarQube como un "Secret text" con el ID `SONAR_TOKEN`.

<div style={{textAlign: 'center'}}>
![Configurar SonarQube en Jenkins](/img/sonarqube/jenkins-secret.png)
</div>

Después de la configuración, se puede agregar un paso de análisis de SonarQube en el pipeline de Jenkins. Esto se hace añadiendo un bloque `stage` en el archivo `Jenkinsfile` que ejecuta el análisis de SonarQube.

```groovy title="Jenkinsfile" showLineNumbers
stage('SonarQube SAST') {
    environment {
        SONARQUBE_URL       = "https://sonar.opensecdevops.com"
    }
    steps {
        unstash 'deps'
        script {
            def uid = sh(returnStdout: true, script: 'id -u').trim()
            def gid = sh(returnStdout: true, script: 'id -g').trim()
            echo "→ Ejecutaré Docker como UID=${uid} GID=${gid}"

            withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                sh '''docker run \
                    --rm \
                        -u ${uid}:${gid} \
                    -e SONAR_HOST_URL="${SONARQUBE_URL}" \
                    -e SONAR_TOKEN="${SONAR_TOKEN}" \
                    -v "/workspace/${JOB_NAME}:/usr/src" \
                    sonarsource/sonar-scanner-cli -Dsonar.sources=/usr/src/app
                '''
            }
        }
        

    }
}
```
