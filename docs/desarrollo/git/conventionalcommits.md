# Conventional Commits

Los [commits convencionales](https://www.conventionalcommits.org/es/) son una forma de escribir mensajes de commit que siguen una estructura predefinida. Esta estructura facilita la comprensión del historial de commits, tanto para los humanos como para las herramientas automatizadas.

## Ventajas

1. **Claridad y organización:** Los mensajes de commit estandarizados son más fáciles de leer y comprender, lo que facilita el seguimiento de los cambios realizados en el proyecto.
2. **Colaboración efectiva:** Los commits convencionales facilitan la comunicación entre los miembros del equipo, ya que todos entienden lo que significa cada tipo de commit.
3. **Automatización:** Los mensajes de commit estandarizados pueden ser utilizados por herramientas automatizadas para generar changelogs, determinar cambios de versión y ejecutar scripts de integración continua.
4. **Mantenimiento y seguimiento:** Los commits convencionales facilitan el mantenimiento del proyecto a largo plazo, ya que el historial de commits es más organizado y comprensible.
5. **Adopción universal:** Este estándar es ampliamente adoptado por la comunidad de desarrollo, lo que facilita la colaboración con otros equipos y la integración con herramientas de terceros.

## Estructura

Un commit convencional se compone de tres partes principales:

### Tipo

El tipo de commit indica el tipo de cambio que se ha realizado. Los tipos más comunes son:

- **feat:** Introduce una nueva característica o funcionalidad.
- **fix:** Corrige un error.
- **chore:** Tareas de mantenimiento que no afectan al código fuente (ej. actualizar dependencias).
- **docs:** Cambios en la documentación.
- **style:** Cambios de formato en el código (ej. sangrías, espacios en blanco).
- **refactor:** Reorganización del código sin cambiar su funcionalidad.
- **test:** Añade o modifica pruebas.
- **build:** Cambios en el sistema de compilación o dependencias.
- **ci:** Cambios en la configuración de integración continua.

### Alcance (opcional)

El alcance indica la parte del código que se ha visto afectada por el cambio. Es un campo opcional, pero puede ser útil para identificar rápidamente los cambios relevantes.

### Descripción

La descripción es una breve frase que resume el cambio realizado. Debe ser clara y concisa, y debe proporcionar suficiente información para que alguien pueda entender el cambio sin necesidad de leer el código.

Ejemplo de un Conventional Commit:

> feat: Implementar nueva función de login

Este commit introduce una nueva característica de login en el proyecto.

Tipos de commits adicionales:

BREAKING CHANGE: Indica un cambio que rompe la compatibilidad con versiones anteriores. Se debe incluir en el pie de página del mensaje de commit.

## Herramientas

Existen diversas herramientas que te ayudan a trabajar con Conventional Commits en tu proyecto.

### Validación de mensajes de commit

- **[Commitlint](https://commitlint.js.org/)** Te permite configurar reglas para validar que los mensajes de commit sigan la convención.
- **[Husky](https://typicode.github.io/husky/)** Integra Commitlint en tu flujo de trabajo Git, evitando que se realicen commits con mensajes no válidos.

### Generación de mensajes de commit

- **[Commitizen](https://commitizen-tools.github.io/commitizen/):** Te ayuda a escribir mensajes de commit interactivos siguiendo la convención.
- **[Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)** Genera automáticamente un changelog a partir de los mensajes de commit.

### Otras herramientas

- **[Semantic Release](https://semantic-release.gitbook.io/semantic-release/)** Te ayuda a automatizar la generación de releases y la gestión de versiones a partir de los mensajes de commit.
- **Visual Studio Code:** Puedes instalar extensiones como "[vscode-conventional-commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)" para ayudarte a escribir mensajes de commit siguiendo la convención.
Elegir la herramienta adecuada:

La mejor herramienta para ti dependerá de las necesidades específicas de tu proyecto. Algunos factores a considerar son:

- Tamaño del equipo: Si trabajas en un equipo grande, es importante tener una herramienta que ayude a garantizar la consistencia en los mensajes de commit.
- Flujo de trabajo: Si usas una herramienta de integración continua, es importante encontrar una herramienta que se integre con ella.
- Preferencias personales: Algunas personas prefieren escribir mensajes de commit manualmente, mientras que otras prefieren usar una herramienta que les ayude.
