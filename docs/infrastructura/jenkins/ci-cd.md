---
title: CI/CD
description: "Guía para configurar y utilizar CI/CD en Jenkins con un Jenkinsfile Declarativo."
---

El pipeline de Jenkins se define en un archivo llamado `Jenkinsfile` que debe residir en la raíz de tu repositorio. Para que Jenkins detecte y ejecute automáticamente este Jenkinsfile al producirse cambios, es necesario conectar Jenkins al repositorio (GitLab o GitHub) mediante el plugin correspondiente y configurar las credenciales y un webhook en la plataforma de Git, o bien habilitar el “polling” del repositorio desde Jenkins.

## Estructura Básica de un Jenkinsfile

Dentro de un Jenkinsfile Declarativo encontraremos varias secciones clave:

- **pipeline** Bloque raíz que engloba toda la definición del pipeline.  
- **agent**  Define el nodo o entorno donde se ejecuta el pipeline (por ejemplo `any`, etiqueta de nodo o contenedor Docker).  
- **environment** Variables de entorno globales para todas las etapas.  
- **parameters** Parámetros de entrada que permiten personalizar la ejecución (p. ej. rama, versión).  
- **options** Opciones de ejecución, como tiempo máximo (`timeout`) o número de reintentos (`retry`).  
- **stages** Conjunto de bloques `stage`, cada uno con su propio `steps` (comandos a ejecutar).  
- **post**  Acciones que se disparan tras la ejecución, según el resultado (`success`, `failure`, `always`).

## Ejemplo de skeleton de Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker { image 'node:14' }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        stage('Test') {
            agent {
                docker { image 'node:14' }
            }
            steps {
                sh 'npm test'
            }
            // En Jenkins, los artifacts del stage anterior están disponibles si se usan archiveArtifacts y se recuperan manualmente si es necesario.
        }

        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

En este ejemplo:

- El pipeline está compuesto por tres stages: "Build", "Test" y "Deploy".
- Cada stage puede especificar el entorno de ejecución, en este caso usando la imagen de Docker node:14 para las etapas de build y test, asegurando un entorno consistente para la compilación y pruebas.
- En el stage Build, se instalan las dependencias y se construye la aplicación. Los archivos generados en la carpeta build/ se archivan como artifacts mediante archiveArtifacts, permitiendo que estén disponibles para etapas posteriores.
- El stage Test ejecuta los tests de la aplicación utilizando también la imagen node:14. En Jenkins, los artifacts generados en etapas previas pueden ser recuperados manualmente si es necesario.
- El stage Deploy ejecuta el script de despliegue (./deploy.sh). No se especifica una imagen Docker, por lo que se utiliza el agente configurado por defecto en Jenkins.
- La estructura declarativa del Jenkinsfile facilita la organización, reutilización y mantenimiento del pipeline, permitiendo además la integración con otras herramientas y la extensión de funcionalidades según las necesidades del proyecto.

Es recomendable revisar la [documentación oficial de Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/) para ampliar las capacidades y personalizar los pipelines según los requisitos de tu entorno.

Para mantener el pipeline limpio y reutilizable, puedes crear una carpeta llamada jenkins-scripts o similar donde almacenar scripts auxiliares y funciones comunes, evitando la repetición de código y simplificando la definición de los stages.
