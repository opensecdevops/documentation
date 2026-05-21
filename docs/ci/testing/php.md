---
title: PHPUnit
description: PHPUnit es un popular framework de pruebas unitarias para PHP que se utiliza ampliamente en el desarrollo de aplicaciones PHP. Su principal función es facilitar la escritura y ejecución de pruebas unitarias automatizadas para verificar el comportamiento y la calidad del código PHP.
keywords:
  - PHP
  - PHPUnit
  - Pruebas unitarias
  - Framework de pruebas
  - Desarrollo de software
---

PHPUnit es un popular framework de pruebas unitarias para PHP que se utiliza ampliamente en el desarrollo de aplicaciones PHP. Su principal función es facilitar la escritura y ejecución de pruebas unitarias automatizadas para verificar el comportamiento y la calidad del código PHP.

## Características

- **Framework de pruebas robusto:** PHPUnit proporciona una infraestructura sólida para la creación y ejecución de pruebas unitarias. Permite a los desarrolladores escribir pruebas de manera efectiva para verificar el funcionamiento de funciones, métodos y clases en su código.
- **Soporte para diversas funcionalidades:** Además de las pruebas unitarias básicas, PHPUnit admite una variedad de tipos de pruebas, como pruebas de integración y pruebas funcionales. Esto permite evaluar diferentes aspectos del software, desde la lógica interna de las funciones hasta la interacción de componentes completos.
- **Generación de informes de pruebas:** PHPUnit genera informes detallados de las pruebas, lo que facilita la identificación de fallas y errores en el código. Estos informes ayudan a los desarrolladores a depurar y corregir problemas de manera más eficiente.
- **Herramientas de cobertura de código:** PHPUnit ofrece herramientas de medición de cobertura de código que permiten evaluar qué porcentaje del código fuente se ha ejecutado durante las pruebas. Esto ayuda a identificar áreas no probadas y a mejorar la calidad del código.
- **Compatibilidad con CI/CD:** PHPUnit se puede integrar con una variedad de marcos de trabajo y herramientas de CI/CD, lo que facilita la incorporación de pruebas automatizadas en flujos de trabajo de desarrollo y garantiza que las pruebas se ejecuten de manera consistente.
- **Extensibilidad:** PHPUnit es altamente extensible y permite a los desarrolladores crear sus propias extensiones y personalizaciones para satisfacer sus necesidades específicas de prueba.

## GitLab

```yml title=".gitlab-ci.yml" showLineNumbers
phpunit:
  stage: test
  image: harbor.opensecdevops.com/osdo/php-ci@sha256:c4d27b1286fb998148f7439533f83c2ca40f0358bbda6009a6a3f069e14086c0
  dependencies: ['composer']
  variables:
    XDEBUG_MODE: coverage
  script:
    - ./vendor/bin/phpunit --coverage-text --colors=never --log-junit phpunit-report.xml --coverage-clover coverage-report.xml
  artifacts:
    paths:
      - phpunit-report.xml
      - coverage-report.xml
    reports:
      junit: phpunit-report.xml
    expire_in: 30 min
```

- **image**: Utiliza una imagen de contenedor específica que incluye PHP, PHPUnit y las extensiones necesarias para ejecutar las pruebas y generar los informes. El uso de un hash sha256 garantiza la consistencia de la imagen utilizada.
- **dependencies**: Indica que este job depende del job llamado `composer`, asegurando que las dependencias del proyecto estén instaladas antes de ejecutar las pruebas.
- **variables**: Define la variable de entorno `XDEBUG_MODE` en modo `coverage` para habilitar la generación de informes de cobertura.
- **script**: Ejecuta PHPUnit con las opciones necesarias para generar el informe en formato texto, el reporte JUnit (`phpunit-report.xml`) y el reporte de cobertura (`coverage-report.xml`).
- **artifacts**:
  - **paths**: Especifica los archivos que se guardarán como artefactos tras la ejecución del job, permitiendo su consulta o uso en etapas posteriores.
  - **reports**: Informa a GitLab de la ubicación del reporte JUnit para su visualización en la interfaz.
  - **expire_in**: Define el tiempo de retención de los artefactos generados.

---

## GitHub

```yml title=".github/workflows/ci.yml" showLineNumbers
  phpunit:
    name: test phpunit
    runs-on: ubuntu-latest
    needs: [composer,npm]
    env:
      XDEBUG_MODE: coverage
    steps:
      - name: Clonar
        uses: actions/checkout@v4

    - name: Recuperar artifacts
      uses: actions/download-artifact@v4

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: dom, curl, libxml, mbstring, zip, pcntl, pdo, sqlite, pdo_sqlite, bcmath, soap, intl, gd, exif, iconv, imagick
        coverage: xdebug
        tools: composer, phpunit

      - name: Preparar env testing
        run: php artisan key:generate --env=testing

      - name: Ejecutar PHPUnit
        run: |
          phpunit --coverage-text --colors=never \
            --log-junit phpunit-report.xml \
            --coverage-clover coverage-report.xml

      - name: Subir reports
        uses: actions/upload-artifact@v4
        with:
          name: phpunit-reports
          path: |
            phpunit-report.xml
            coverage-report.xml
```

- **name**: Define el nombre del job como `test phpunit`, facilitando su identificación dentro del workflow.
- **runs-on**: Especifica el sistema operativo del runner donde se ejecutará el job, en este caso `ubuntu-latest`, asegurando un entorno limpio y consistente para cada ejecución.
- **needs**: Indica que este job depende de los jobs `composer` y `npm`, por lo que no se ejecutará hasta que la instalación de dependencias haya finalizado correctamente.
- **env**: Define la variable de entorno `XDEBUG_MODE` en modo `coverage` para habilitar la generación de informes de cobertura.
- **steps**: Lista los pasos que se ejecutarán en el job:
  - **Clonar**: Usa la acción `actions/checkout@v4` para clonar el repositorio.
  - **Recuperar artifacts**: Usa la acción `actions/download-artifact@v4` para recuperar artefactos generados en etapas previas, como las dependencias instaladas.
  - **Setup PHP**: Usa la acción `shivammathur/setup-php@v2` para instalar PHP 8.2 y Composer en el runner, junto con las extensiones y herramientas necesarias.
  - **Preparar env testing**: Ejecuta el comando para generar la clave de entorno de pruebas si es necesario.
  - **Ejecutar PHPUnit**: Ejecuta PHPUnit con las opciones para generar los informes de resultados y cobertura.
  - **Subir reports**: Usa la acción `actions/upload-artifact@v4` para subir los archivos de reporte generados como artefactos para su consulta posterior.

---

## Jenkins

```groovy title="Jenkinsfile" showLineNumbers
stage('Test') {
            environment {
                XDEBUG_MODE     = "coverage"
            }
            steps {
                unstash 'deps'

                sh """docker run --rm \
                        -v /workspace/${JOB_NAME}:/app \
                        -w /app \
                        harbor.opensecdevops.com/osdo/php-ci@sha256:84efd71c4e19ee63e1a08ef6884b6016182af23e35b9a6cba6fe3cf647f665fe php artisan key:generate --env=testing
                    """
                sh """docker run --rm \
                        -e XDEBUG_MODE=${XDEBUG_MODE} \
                        -v /workspace/${JOB_NAME}:/app \
                        -w /app \
                        harbor.opensecdevops.com/osdo/php-ci@sha256:84efd71c4e19ee63e1a08ef6884b6016182af23e35b9a6cba6fe3cf647f665fe \
                        ./vendor/bin/phpunit \
                        --coverage-text \
                        --colors=never \
                        --log-junit phpunit-report.xml \
                        --coverage-cobertura cobertura-report.xml \
                        --coverage-clover coverage-report.xml
                    """
                sh """sed -i 's|/app/app|${WORKSPACE}/app|g' cobertura-report.xml
                    """
                sh """sed -i 's|/app/app|app|g' coverage-report.xml
                    """
             
                
                archiveArtifacts artifacts: '**/*-report.xml', fingerprint: true
            }
            post {
                always {
                    junit 'phpunit-report.xml'
                    recordCoverage(
                        tools: [
                        [ parser: 'COBERTURA', pattern: '**/cobertura-report.xml' ]
                        ],
                        enabledForFailure: true,
                        failOnError: false,
                        ignoreParsingErrors: true
                    )
                }
            }
        }
```

- **environment**: Define la variable de entorno `XDEBUG_MODE` en modo `coverage` para habilitar la generación de informes de cobertura.
- **unstash 'deps'**: Recupera las dependencias previamente almacenadas en una etapa anterior del pipeline, asegurando que estén disponibles para el análisis.
- **sh ... php artisan key:generate --env=testing**: Prepara el entorno de pruebas generando la clave necesaria.
- **sh ... ./vendor/bin/phpunit ...**: Ejecuta PHPUnit dentro de un contenedor Docker, generando los informes de resultados (`phpunit-report.xml`), cobertura en formato Clover (`coverage-report.xml`) y Cobertura (`cobertura-report.xml`).
- **sed ...**: Ajusta las rutas de los archivos de cobertura para que sean compatibles con Jenkins.
- **archiveArtifacts**: Guarda los archivos de reporte como artefactos del build, permitiendo su consulta y trazabilidad.
- **post > always**:
  - **junit**: Publica el reporte JUnit en la interfaz de Jenkins.
  - **recordCoverage**: Publica el informe de cobertura utilizando el archivo Cobertura, permitiendo visualizar los porcentajes de cobertura en Jenkins.
