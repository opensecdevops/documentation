---
title: Git Flow
---

# Git Flow

Git Flow es una metodología de flujo de trabajo que facilita la organización y gestión del desarrollo de software en proyectos colaborativos. Esta metodología se basa en el uso estructurado de ramas para gestionar diferentes tipos de cambios y versiones del software, brindando una estrategia clara para el desarrollo y lanzamiento de funcionalidades, corrección de errores y versiones finales.

## Instalación de Git Flow

Para usar Git Flow, primero debes instalar la herramienta. Dependiendo de tu sistema operativo, puedes seguir los siguientes pasos:

- **Linux (Debian/Ubuntu)**:

  ```bash
  sudo apt-get install git-flow
  ```

- **macOS** (usando Homebrew):

  ```bash
  brew install git-flow
  ```

- **Windows**: Puedes usar [Git for Windows](https://gitforwindows.org/) que incluye soporte para Git Flow, o utilizar herramientas como `scoop`:

  ```bash
  scoop install git-flow
  ```

## Uso de Git Flow

Una vez instalada la herramienta, puedes inicializar Git Flow en tu repositorio ejecutando:

```bash
git flow init
```

Este comando configurará la estructura básica de ramas (`main`, `develop`, etc.) y te pedirá algunas configuraciones iniciales, como el nombre de las ramas.

## Ramas en Git Flow

Git Flow define un conjunto de ramas con roles específicos que ayudan a mantener el proyecto organizado:

- **`main`**: Esta es la rama principal que siempre contiene el código estable y listo para ser lanzado a producción. Representa el estado actual del software en producción.

- **`develop`**: Esta rama sirve como la base del desarrollo. Contiene el código que está en preparación para la próxima versión estable. Cuando se decide lanzar una nueva versión, se fusiona la rama `develop` con la rama `main`.

- **`feature`**: Las ramas de características (o `feature`) se utilizan para desarrollar nuevas funcionalidades. Estas ramas parten de `develop` y, una vez completadas, se fusionan nuevamente con `develop`.
  - **Ejemplo con Git Flow**: Para crear una nueva rama de característica, puedes usar el siguiente comando:

    ```bash
    git flow feature start nueva_funcionalidad
    ```

    Cuando la nueva funcionalidad esté lista, puedes finalizarla usando:

    ```bash
    git flow feature finish nueva_funcionalidad
    ```

    Esto fusionará la rama `feature` con `develop` y la eliminará.

- **`release`**: Las ramas de lanzamiento (`release`) se crean cuando el código en `develop` está listo para ser lanzado y se necesita preparar una versión.
  - **Ejemplo con Git Flow**: Para crear una rama de lanzamiento para la versión 1.0, se usa:

    ```bash
    git flow release start 1.0
    ```

    Después de realizar los ajustes necesarios y estar listo para el lanzamiento, puedes finalizar la rama de lanzamiento con:

    ```bash
    git flow release finish 1.0
    ```

    Esto fusionará la rama con `main` y `develop`, y etiquetará la versión en `main`.

- **`hotfix`**: Las ramas de corrección rápida (`hotfix`) se utilizan para solucionar problemas críticos que aparecen en producción.
  - **Ejemplo con Git Flow**: Para crear una rama de corrección rápida, usa:

    ```bash
    git flow hotfix start correccion_critica
    ```

    Una vez solucionado el problema, puedes finalizar la corrección rápida con:

    ```bash
    git flow hotfix finish correccion_critica
    ```

    Esto fusionará la corrección con `main` y `develop`, y etiquetará la versión en `main`.

## Flujo de Trabajo

1. **Inicializar Git Flow**: Configura la estructura básica del proyecto con `git flow init`.
2. **Desarrollo de nuevas funcionalidades**: Se crean ramas de características (`feature`) para trabajar en nuevas funcionalidades sin afectar el código base.
3. **Preparación de una versión**: Cuando el desarrollo está listo, se crea una rama de lanzamiento (`release`) para realizar pruebas y ajustes finales antes de pasar a producción.
4. **Lanzamiento a producción**: La rama `release` se fusiona con `main` y se etiqueta con el número de versión correspondiente.
5. **Corrección de errores críticos**: En caso de problemas urgentes, se crea una rama `hotfix` para corregirlos rápidamente y se actualizan las ramas `main` y `develop`.

Git Flow proporciona una estructura clara para el desarrollo de software, facilitando el trabajo colaborativo, la integración continua y la entrega de software estable. Esta metodología es particularmente útil en proyectos donde se necesita mantener un ciclo de versiones claro y gestionar múltiples versiones en paralelo.

Para más información sobre Git Flow y cómo implementarlo en tus proyectos, puedes consultar la hoja de referencia de Git Flow o explorar herramientas como [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/index.es_ES.html), que automatizan la gestión de ramas según esta metodología.
