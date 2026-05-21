---
title: Proyecto
description: "Guía para la instalación y configuración del proyecto GlitchTip, incluyendo la estructura de carpetas, dependencias y configuración de servicios."
keywords:
  - GlitchTip
  - Proyecto
  - Instalación
  - Configuración
---

Un proyecto en GlitchTip es una instancia que nos agrupa los errores, monitorización y performance de una aplicacion. Cada proyecto tiene su propia configuración, incluyendo el nombre, la clave de acceso y las opciones de notificación.

Lo primero que tenemos que hacer es crear una organización donde agrupemos los proyectos, nada mas entrar en una instalacón nueva de GlitchTip, nos pedirá que creemos una organización. Una vez creada, podemos crear un proyecto dentro de esa organización.

<div style={{textAlign: 'center'}}>
![Crear primera organización](/img/glitchtip/create_new_organization.png)
</div>

<div style={{textAlign: 'center'}}>
![Crear organización](/img/glitchtip/create_organization.png)
</div>

Ahora vamos a crear un proyecto dentro de la organización. Para ello, vamos a la sección de proyectos y hacemos clic en "Create Project". En el formulario nos dejara selecionar el nombre del proyecto, la plataforma (por ejemplo, Python, Node.js, etc.) y el equipo que  lo gestionará.

<div style={{textAlign: 'center'}}>
![Crear proyecto](/img/glitchtip/select_type_project.png)
</div>

Una vez creado el proyecto, se nos proporcionará una clave de acceso (DSN) que necesitaremos para integrar GlitchTip con nuestra aplicación. Esta clave es esencial para que los errores y eventos se envíen correctamente al proyecto.

<div style={{textAlign: 'center'}}>
![Clave de acceso del proyecto](/img/glitchtip/project_created.png)
</div>

Ahora  que tenemos el proyecto creado, podemos proceder a integrar GlitchTip en nuestra aplicación. Dependiendo del lenguaje y framework que estemos utilizando, la integración puede variar, pero generalmente implica instalar un paquete o librería específica y configurar la clave DSN en el código de la aplicación.

Finalizada la integración, GlitchTip comenzará a recibir eventos y errores de nuestra aplicación, permitiéndonos monitorizar su rendimiento y solucionar problemas de manera eficiente.

<div style={{textAlign: 'center'}}>
![Lista de issues del proyecto](/img/glitchtip/issues_list.png)
</div>

Si accedemos al "Issue" de un proyecto, veremos información detallada sobre el error, incluyendo la pila de llamadas, el mensaje de error y cualquier contexto adicional que se haya capturado. Esto nos ayudará a diagnosticar y solucionar problemas de manera más efectiva.

<div style={{textAlign: 'center'}}>
![Detalle de un issue](/img/glitchtip/issue_detail.png)
</div>
