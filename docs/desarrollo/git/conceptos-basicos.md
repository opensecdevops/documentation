---
title: Conceptos básicos
---

Git es una herramienta de control de versiones distribuido que permite a los desarrolladores gestionar y registrar los cambios en un proyecto de software de manera colaborativa y eficiente.

## Comandos básicos

- `git init`: Inicializa un nuevo repositorio en un directorio.

    - **Ejemplo**: Si tienes una carpeta llamada mi_proyecto, puedes inicializar un repositorio dentro de ella usando:

    ```
    git init
    ```

Esto creará un nuevo repositorio vacío en el directorio actual, permitiéndote empezar a versionar tu proyecto.

- `git remote add`: Añade un repositorio remoto al que se pueden enviar los cambios.

    - **Ejemplo**: Para añadir un repositorio remoto llamado origin, puedes usar:

    ```
    git remote add origin https://domain.com/usuario/repo.git
    ```

Esto enlaza tu repositorio local con el repositorio remoto especificado, lo cual te permitirá posteriormente usar comandos como `git push` o `git pull` para interactuar con el repositorio remoto.


- `git clone`: Clona un repositorio existente desde un servidor o ubicación remota.

    - **Ejemplo**: Para clonar un repositorio desde un repositorio remoto, puedes usar:

    ```
    git clone https://domain.com/usuario/repo.git
    ```

Esto descargará una copia local del repositorio remoto especificado.

- `git add`: Añade archivos al área de preparación (staging area) para que sean parte del próximo commit.

    - **Ejemplo**: Si has modificado un archivo llamado index.html, puedes añadirlo al área de preparación con:

    ```
    git add index.html
    ```

Esto indica que quieres incluir index.html en el próximo commit.

- `git commit`: Guarda los cambios preparados en el historial del repositorio, creando un "snapshot" del estado actual.

    - **Ejemplo**: Para hacer un commit con un mensaje descriptivo, puedes usar:

    ```
    git commit -m "Añadir nueva funcionalidad a la página principal"
    ```

Esto guardará los cambios en el historial con el mensaje proporcionado.

- `git status`: Muestra el estado actual del área de trabajo, los archivos modificados, y aquellos listos para ser "committeados".

    - **Ejemplo**: Para ver qué archivos han cambiado o están listos para ser añadidos, simplemente ejecuta:

    ```
    git status
    ```

Esto te dará una visión clara del estado actual del repositorio.

- `git push`: Envía los commits locales a un repositorio remoto.

    - **Ejemplo**: Para enviar tus cambios a la rama principal del repositorio remoto, usa:

    ```
    git push origin main
    ```

Esto actualizará el repositorio remoto con los cambios locales.

- `git pull`: Actualiza el repositorio local con los cambios de la rama remota.

    - **Ejemplo**: Para sincronizar los cambios más recientes de la rama principal, usa:

    ```
    git pull origin main
    ```

Esto descargará y fusionará los cambios del repositorio remoto en tu rama local.

- `git branch`: Gestiona ramas del proyecto, permite crear, listar o eliminar ramas.

    - **Ejemplo**: Para crear una nueva rama llamada nueva_funcionalidad, usa:

    ```
    git branch nueva_funcionalidad
    ```

También puedes listar todas las ramas existentes con git branch sin parámetros.

- `git merge`: Fusiona cambios de una rama con otra, integrando modificaciones realizadas por diferentes desarrolladores.

    - **Ejemplo**: Si deseas fusionar la rama nueva_funcionalidad con la rama actual, usa:

    ```
    git merge nueva_funcionalidad
    ```

Esto integrará los cambios de la rama nueva_funcionalidad en la rama en la que te encuentras.

Para aprender de forma interactiva y poner en práctica estos comandos, te recomendamos visitar [Learn Git Branching](https://learngitbranching.js.org), una plataforma que te permite experimentar con diferentes comandos en un entorno seguro y amigable.

Con estos conceptos básicos, podrás comenzar a usar Git en tus proyectos y beneficiarte de sus ventajas en la gestión del código y colaboración efectiva.