---
title: CI/CD
description: "Guía para configurar y utilizar CI/CD en GitLab, incluyendo la estructura de stages, jobs y la integración de scripts personalizados."
---

El CI/CD de GitLab se basa en la definición de un archivo llamado `.gitlab-ci.yml`, que reside en el repositorio de tu proyecto. Este archivo contiene instrucciones detalladas sobre cómo se debe construir, probar y entregar tu aplicación. Cuando se realiza un cambio en el repositorio, GitLab CI/CD detecta automáticamente la actualización y ejecuta el flujo definido en el archivo `.gitlab-ci.yml`.

## Estructura básica de un Stage

Dentro del archivo `.gitlab-ci.yml`, los stages están organizados en una estructura jerárquica y suelen contener varias configuraciones clave.

- **stage:** En GitLab CI/CD, los `stages` son una forma de organizar y dividir el flujo de trabajo en etapas lógicas. Cada stage representa una fase específica de tu proceso de CI/CD, como construcción, pruebas o implementación. Por ejemplo, podrías tener stages llamados "build", "test" y "deploy" para representar las fases típicas de un proceso de CI/CD. Los jobs se agrupan en estos stages según su función y se ejecutan en un orden específico. El concepto de `stage` te permite definir y controlar el flujo de trabajo de manera granular.
- **image:** La configuración `image` te permite especificar la imagen de Docker que se utilizará para ejecutar los jobs en un stage particular. Si no se tiene imagen definida en el stage se usara la configurada en el gitlab runner
- **script:** Este bloque contiene los comandos principales que se ejecutarán en el stage. Aquí es donde realizas las acciones específicas, como construir, probar o implementar.
- **artifacts:** Los `artifacts` son archivos generados por un job que deseas conservar para su uso posterior en otros stages o para su descarga desde la interfaz de GitLab. Puedes definir los `artifacts` que deseas conservar en un stage y, luego, acceder a ellos en stages posteriores o descargarlos manualmente si es necesario. Los `artifacts` son útiles para compartir resultados de pruebas, informes o cualquier otro tipo de archivo generado durante tu pipeline de CI/CD.
- **dependencies** es una característica que te permite establecer dependencias entre diferentes jobs dentro de tu pipeline. Cuando un job tiene una dependencia de otro, significa que el job dependiente no se ejecutará hasta que el job del que depende haya terminado con éxito. Esto te permite controlar el flujo de trabajo y asegurarte de que ciertos jobs se ejecuten en un orden específico o que dependan de la finalización exitosa de otros jobs.

## Ejemplo básico del pipeline

```yml
stages:
  - build
  - test
  - deploy

job_build:
  stage: build
  image: node:14
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - build/

job_test:
  stage: test
  image: node:14
  script:
    - npm test
  dependencies:
    - job_build

job_deploy:
  stage: deploy
  script:
    - ./deploy.sh
```

En este ejemplo:

- Tenemos tres stages: "build", "test" y "deploy".
- Cada job especifica la imagen de Docker a utilizar.
- El job `job_build` crea un artefacto (`build/`) que es necesario para el job `job_test`.
- El job `job_test` tiene una dependencia explícita en `job_build` para acceder a los artifacts generados en ese job.
- El job `job_deploy` no requiere una imagen específica y utilizad ala configurada en el gitlab runner y ejecuta un script de implementación.

Es recomendable revisar la documentación oficial de [GitLab CI/CD](https://docs.gitlab.com/ee/topics/build\_your\_application.html) para poder ampliar sus capacidades, aunque estas se expandirán en el resto de la documentación actual.

Para poder reutilizar funciones en el CI/CD y evitar la repetición innecesaria de código, así como mantener nuestros stages lo más sencillos posible, vamos a crear una carpeta llamada `.gitlab-ci` donde almacenaremos los scripts y extensiones de nuestro CI.
