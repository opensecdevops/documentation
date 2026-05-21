---

title: CI/CD
description: "Guía para configurar y utilizar CI/CD en GitHub Actions, incluyendo la estructura de workflows, jobs y la integración de scripts personalizados."
---

El CI/CD de GitHub se basa en la definición de workflows mediante archivos YAML ubicados en la carpeta `.github/workflows` del repositorio. Estos workflows permiten automatizar tareas como la construcción, prueba y despliegue de aplicaciones cada vez que se produce un evento relevante en el repositorio (por ejemplo, un push, pull request o publicación de una release).

## Estructura básica de un workflow

Un workflow de GitHub Actions está compuesto por uno o varios jobs, que a su vez contienen pasos (steps) que definen las acciones a ejecutar. Los elementos principales son:

- **name:** Define el nombre del workflow o del job, facilitando su identificación en la interfaz de GitHub.
- **on:** Especifica los eventos que activarán la ejecución del workflow, como `push`, `pull_request`, `schedule`, entre otros.
- **jobs:** Agrupa los diferentes jobs que se ejecutarán dentro del workflow. Cada job puede ejecutarse en paralelo o depender de la finalización de otros jobs.
- **runs-on:** Indica el sistema operativo o runner donde se ejecutará el job (por ejemplo, `ubuntu-latest`, `windows-latest`, `macos-latest`).
- **steps:** Lista los pasos a ejecutar dentro de un job. Cada step puede ejecutar comandos de shell o utilizar acciones predefinidas de la comunidad o propias.
- **uses:** Permite reutilizar acciones de terceros o propias, facilitando la integración de herramientas y la automatización de tareas comunes.
- **env:** Define variables de entorno que estarán disponibles durante la ejecución del job o de pasos específicos.
- **needs:** Permite establecer dependencias entre jobs, asegurando que un job no se ejecute hasta que otro haya finalizado correctamente.
- **with:** Proporciona parámetros de configuración para las acciones utilizadas en los steps.

## Ejemplo básico de workflow en GitHub Actions

```yaml
nname: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    container:
      image: node:14
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Instalar dependencias
        run: npm install

      - name: Construir aplicación
        run: npm run build

      - name: Guardar artifacts de build
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: build/

  test:
    name: Test
    runs-on: ubuntu-latest
    container:
      image: node:14
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Descargar artifacts de build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: build/

      - name: Ejecutar pruebas
        run: npm test

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Descargar artifacts de build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: build/

      - name: Ejecutar despliegue
        run: ./deploy.sh
```

En este ejemplo:

- El workflow se activa en cada push o pull request a la rama `main`.
- El pipeline está compuesto por tres jobs: `build`, `test` y `deploy`.
- Cada job puede especificar el entorno de ejecución, en este caso usando la imagen de Docker `node:14` para las etapas de build y test, asegurando un entorno consistente para la compilación y pruebas.
- En el job **build**, se clona el repositorio, se instalan las dependencias y se construye la aplicación. Los archivos generados en la carpeta `build/` se guardan como artifacts mediante la acción `actions/upload-artifact`, permitiendo que estén disponibles para jobs posteriores.
- El job **test** depende del job `build` (usando `needs: build`), descarga los artifacts generados y ejecuta los tests de la aplicación.
- El job **deploy** depende del job `test` (usando `needs: test`), descarga los artifacts de build y ejecuta el script de despliegue (`./deploy.sh`).
- La estructura declarativa del workflow facilita la organización, reutilización y mantenimiento del pipeline, permitiendo además la integración con otras herramientas y la extensión de funcionalidades según las necesidades del proyecto.

Se recomienda revisar la [documentación oficial de GitHub Actions](https://docs.github.com/en/actions) para ampliar las capacidades y personalizar los workflows según los requisitos de tu entorno.

Para mantener el workflow limpio y reutilizable, puedes crear una carpeta llamada `.github/scripts` o similar donde almacenar scripts auxiliares y funciones comunes, evitando la repetición de código y simplificando la definición de los jobs.
