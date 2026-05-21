# Proyecto

En Dependency-Track, un "proyecto" es una entidad que representa una aplicación, servicio o componente específico que está siendo desarrollado y monitorizado. Sirve para organizar y aislar los componentes, bibliotecas y otras dependencias que son relevantes para el desarrollo y mantenimiento de esa aplicación en particular.

Un proyecto en Dependency-Track permite a los equipos de desarrollo y seguridad gestionar vulnerabilidades, licencias y otros aspectos relacionados con las dependencias utilizadas en ese proyecto. Cada proyecto puede tener múltiples versiones, lo que facilita el seguimiento de la evolución de las dependencias a lo largo del tiempo.

Los proyectos solo admiten un fichero SBOM por proyecto, por lo que si se dispone de una solución con diferentes tecnologías (por ejemplo, backend, frontend, etc.), es recomendable crear un proyecto por cada una de ellas. Estos proyectos pueden agruparse para visualizar el estado general de la aplicación en el dashboard.

## Creación

Para crear un proyecto, dirígete a la barra lateral y haz clic en `Projects`, lo que mostrará la lista de proyectos existentes. En la página que aparece, haz clic en el botón "Create Project", lo que abrirá la siguiente ventana:

<div style={{textAlign: 'center'}}>
![Crear proyecto](/img/dependency-track/create_project.png)
</div>

En este formulario se deben completar los siguientes campos:

- **Project Name:** Nombre del activo (obligatorio).
- **Version:** Número de versión de la aplicación.
- **Classifier:** Especifica el tipo de componente.
- **Team:** Selecciona el equipo al que pertenece el proyecto.
- **Project Collection Logic:** Permite agrupar proyectos según su lógica de colección, como por ejemplo, si es un proyecto de frontend o backend.
- **Description:** Descripción del proyecto.
- **Tags:** Etiquetas para catalogación.

Una vez creado, el proyecto estará disponible para cargar las dependencias mediante la técnica [SBOM](../../ci/sbom/README.md).

<div style={{textAlign: 'center'}}>
![Nuevo proyecto](/img/dependency-track/new_project.png)
</div>

Para llevar un seguimiento de la evolución de la aplicación cuando se crea una nueva versión, es necesario crear el mismo proyecto pero con una versión diferente. Esto permite agruparlos dentro del mismo conjunto, y en el dashboard general se visualizarán como entradas independientes.

<div style={{textAlign: 'center'}}>
![Lista proyecto](/img/dependency-track/same_project.png)
</div>

Sin embargo, una vez dentro del proyecto, las versiones estarán agrupadas en un desplegable para facilitar la navegación.

<div style={{textAlign: 'center'}}>
![Desplegable versiones](/img/dependency-track/group_project.png)
</div>

### Proyectos hijos

Existen varias opciones para crear proyectos hijos, que son proyectos asociados a un proyecto principal. Esto es útil para organizar proyectos relacionados o para gestionar versiones específicas de un proyecto.

Para ello, en el proyecto que actuará como principal (padre) y en el que se haya seleccionado una lógica de colección en la opción `Project Collection Logic`, se debe crear un nuevo proyecto y asociarlo como hijo del proyecto principal.

<div style={{textAlign: 'center'}}>
![Crear proyecto hijo](/img/dependency-track/create_child_project.png)
</div>

Al cargar los SBOMs de los proyectos hijos, estos se agruparán bajo el proyecto principal en el dashboard, lo que facilita la visualización y gestión de las dependencias y vulnerabilidades asociadas a todos los proyectos relacionados.

<div style={{textAlign: 'center'}}>
![Proyectos hijos](/img/dependency-track/child_projects.png)
</div>
