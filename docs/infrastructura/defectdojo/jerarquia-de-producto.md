---
title: Jerarquía de productos
---

DefectDojo utiliza cinco clases principales de datos para organizar tu trabajo: Tipos de Producto, Productos, Compromisos (Engagements), Pruebas (Tests) y Hallazgos (Findings).

DefectDojo está diseñado para ser flexible y adaptarse a tu equipo, en lugar de obligar a tu equipo a adaptarse a la herramienta. Una vez que entiendas cómo se pueden utilizar estas clases de datos para organizar tu trabajo, podrás diseñar un entorno de trabajo sólido y adaptable.

<div style={{textAlign: 'center'}}>
![Jerarquía de producto](/img/defectdojo/jerarquia_de_producto.webp)
</div>

## Tipo de producto

En DefectDojo, un "tipo de producto" es la categoría principal utilizada para organizar y clasificar los productos dentro de la plataforma. Los tipos de producto permiten agrupar productos según criterios relevantes para la organización, facilitando la gestión, la visibilidad y la aplicación de controles de acceso.

Un tipo de producto puede representar diferentes dimensiones, como:

- **Dominio de negocio:** Agrupar productos según el área funcional o el sector al que pertenecen (por ejemplo, Finanzas, Recursos Humanos, Infraestructura, etc.).
- **Equipo de desarrollo:** Clasificar productos en función del equipo responsable de su desarrollo o mantenimiento.
- **Equipo de seguridad:** Organizar productos según el equipo encargado de su evaluación o gestión de seguridad.
- **Etapa del ciclo de vida:** Definir tipos de producto para reflejar el estado de desarrollo, como "En desarrollo", "En pruebas" o "En producción".
- **Proyecto o solución global:** En casos donde un proyecto de software tiene múltiples versiones o despliegues, se puede crear un tipo de producto que abarque todo el proyecto y definir cada versión como un producto independiente.

Los tipos de producto pueden tener reglas de control de acceso basadas en roles (RBAC), lo que permite limitar la visibilidad y la capacidad de interacción de los miembros del equipo tanto sobre el tipo de producto como sobre los productos, engagements, tests y findings asociados.

La elección de cómo organizar los tipos de producto depende de las necesidades y estructura de cada organización. Es posible adaptar la jerarquía de DefectDojo para que refleje la realidad operativa y los objetivos de los equipos de seguridad, desarrollo o negocio. Esta flexibilidad permite que la plataforma se ajuste a distintos modelos de gestión y facilite la colaboración entre áreas.

## Producto

En DefectDojo, un "producto" es una entidad que representa cualquier proyecto, programa o aplicación que está siendo evaluado o sometido a pruebas de seguridad. El producto actúa como el contenedor principal de todo el trabajo de seguridad y el historial de pruebas relacionadas con ese objetivo, permitiendo organizar, centralizar y gestionar las vulnerabilidades asociadas a cada activo. Esta estructura facilita el seguimiento, la priorización y la administración de la seguridad a lo largo del ciclo de vida del software, y ayuda a mantener una visión clara del estado de seguridad de cada aplicación o sistema, así como a coordinar las acciones de remediación y cumplimiento.

Cada producto en DefectDojo cuenta con:

- **Nombre único:** Identifica de forma exclusiva el producto dentro de la plataforma.
- **Descripción:** Explica la funcionalidad, propósito o alcance del producto.
- **Tipo de producto:** Permite agrupar productos similares o relacionados, facilitando la organización y el filtrado.
- **Configuración de SLA:** Define los acuerdos de nivel de servicio para la gestión de incidencias de seguridad.

Los productos pueden ser tan amplios o específicos como se desee, dependiendo de las necesidades de la organización. Por ejemplo, se puede crear un producto separado para diferentes versiones de una misma aplicación (por ejemplo, versiones para Windows, Mac y Cloud), para versiones que utilizan componentes de software distintos, o cuando diferentes equipos gestionan distintas variantes y requieren permisos de acceso diferenciados.

Por defecto, los productos son objetos independientes dentro de la jerarquía de DefectDojo y no interactúan entre sí. Las funcionalidades inteligentes de la plataforma, como la deduplicación de findings, solo se aplican dentro del contexto de un único producto. Además, los productos pueden tener reglas de control de acceso basadas en roles (RBAC), lo que permite limitar la visibilidad y la capacidad de interacción de los miembros del equipo tanto sobre el producto como sobre los engagements, tests y findings asociados.

> **Nota:** Las variaciones dentro de un mismo producto, como diferentes versiones o plataformas, también pueden gestionarse a nivel de Engagement, aunque los controles de acceso se aplican principalmente a nivel de Producto y Tipo de Producto.

### Creación de un producto

Para crear un producto en DefectDojo, accede a la barra lateral, haz clic en el icono de tres puntos con tres guiones y selecciona "Add product". Esto abrirá un formulario donde se deben completar los siguientes campos:

- **Name:** Nombre del activo o producto. Es un campo obligatorio y debe ser único para facilitar su identificación.
- **Description:** Breve descripción del producto, su funcionalidad o propósito dentro de la organización. Campo obligatorio.
- **Tags:** Etiquetas que permiten clasificar y filtrar productos según criterios como grupo de trabajo, criticidad, tecnología, etc.
- **Product manager:** Persona responsable de la gestión general del producto, encargada de coordinar acciones y decisiones relacionadas con la seguridad.
- **Technical contact:** Persona de contacto técnico para consultas o incidencias relacionadas con el producto.
- **Team manager:** Responsable del equipo que gestiona el producto, facilitando la coordinación entre áreas.
- **Product Type:** Tipo de producto (por ejemplo, sistema, aplicación web, API, infraestructura). Es posible definir y seleccionar varios tipos según la naturaleza del activo. Campo obligatorio.
- **SLA Configuration:** Configuración del Acuerdo de Nivel de Servicio (SLA), que define los tiempos de respuesta y resolución para las incidencias de seguridad. Campo obligatorio.
- **Regulations:** Normativas, estándares o bases legales aplicables al producto (por ejemplo, GDPR, PCI DSS, ISO 27001), lo que facilita el cumplimiento y la trazabilidad.
- **Business criticality:** Nivel de criticidad del producto para la organización, lo que ayuda a priorizar la gestión de riesgos y vulnerabilidades.
- **Platform:** Plataforma tecnológica sobre la que se ejecuta el producto (por ejemplo, Windows, Linux, Cloud, Mobile).
- **Lifecycle:** Estado o fase del ciclo de vida del producto (desarrollo, pruebas, producción, mantenimiento, etc.).
- **Origin:** Origen del software, indicando si es de código abierto, desarrollado internamente, adquirido a terceros, etc.
- **User records:** Número estimado de personas usuarias o registros gestionados por la aplicación, útil para evaluar el impacto potencial de una vulnerabilidad.
- **Revenue:** Beneficio estimado o valor económico generado por la aplicación, lo que puede influir en la priorización de acciones de seguridad.
- **External audience:** Indica si el producto está orientado a usuarios internos o externos, lo que puede afectar el nivel de exposición y riesgo.
- **Enable Product Tag Inheritance:** Si se activa, las etiquetas asignadas al producto se heredan automáticamente en los Engagements, Tests y Findings asociados, facilitando la organización y el filtrado.
- **Internet accessible:** Indica si el producto es accesible desde internet, lo que puede aumentar su exposición a amenazas externas.
- **Enable simple risk acceptance:** Permite aceptar riesgos de manera simplificada para findings específicos, agilizando la gestión de excepciones.
- **Enable full risk acceptance:** Permite aceptar riesgos de forma completa, documentando la justificación y el alcance de la aceptación.
- **Disable SLA breach notifications:** Si se activa, se desactivan las notificaciones automáticas por incumplimiento de los plazos definidos en el SLA.

<div style={{textAlign: 'center'}}>
![Agregar producto](/img/defectdojo/new_product.png)
</div>

Una vez creado el producto, se pueden asociar vulnerabilidades detectadas, gestionar findings, realizar seguimientos de remediación, generar informes y visualizar métricas de seguridad específicas para ese producto. El dashboard del producto proporciona una visión centralizada del estado de seguridad, facilitando la toma de decisiones y la priorización de acciones.

<div style={{textAlign: 'center'}}>
![Dashboard de producto](/img/defectdojo/dashboard_product.png)
</div>

## Engagement

En DefectDojo, un "engagement" es una entidad que representa un periodo o conjunto de actividades dedicadas a la realización de pruebas de seguridad sobre un producto específico. Los engagements permiten organizar, documentar y programar los esfuerzos de evaluación, facilitando la trazabilidad, el seguimiento y la mejora continua de la seguridad en el ciclo de vida del software.

Cada engagement está asociado a un producto y cuenta con:

- Un **nombre único** que lo identifica.
- Fechas objetivo de **inicio y fin**, que permiten planificar y registrar el periodo de pruebas.
- Un **estado** (por ejemplo, No iniciado, En progreso, Cancelado, Completado) que refleja el avance de la actividad.
- Un **Testing Lead** o responsable de las pruebas.
- El **producto** al que se asocia el engagement.

DefectDojo distingue principalmente dos tipos de engagement, adaptados a diferentes metodologías y necesidades:

### Interactive Engagement (Compromiso interactivo)

Este tipo de engagement suele ser gestionado por un ingeniero o equipo de seguridad y está enfocado en pruebas manuales o semiautomatizadas sobre la aplicación en funcionamiento. Incluye actividades como pruebas de penetración, auditorías manuales, revisiones de código o cualquier acción que implique la interacción directa con la funcionalidad de la aplicación. Los Interactive Engagements permiten agrupar y documentar los resultados de diferentes pruebas realizadas en un periodo concreto, facilitando la elaboración de informes y la comunicación con los equipos responsables.

### CI/CD Engagement (Compromiso CI/CD)

Pensado para la integración automatizada con pipelines de CI/CD, este tipo de engagement está orientado a la importación automática de resultados de pruebas de seguridad generadas durante el proceso de integración y entrega continua. Los CI/CD Engagements suelen ser abiertos o de duración indefinida, permitiendo añadir resultados de pruebas cada vez que se ejecuta una acción relevante en el pipeline, como un nuevo despliegue o una actualización de software. Esto facilita la evaluación continua y sistemática de la seguridad ante cada cambio en el código.

### Organización y gestión de engagements

Los engagements pueden representar tanto esfuerzos de pruebas planificados y acotados en el tiempo (por ejemplo, una campaña de pruebas de seguridad para una versión concreta de un software), como procesos continuos de evaluación automatizada. Cada engagement puede contener uno o varios tests, que agrupan los resultados de herramientas o actividades específicas (por ejemplo, escaneos de vulnerabilidades, auditorías de dependencias, pruebas de penetración, etc.).

La flexibilidad de DefectDojo permite organizar los engagements según las necesidades del equipo o la organización. Por ejemplo:

- Un engagement puede agrupar todas las pruebas realizadas durante una versión o lanzamiento específico de un producto.
- En el caso de CI/CD, un engagement puede recoger los resultados de cada ejecución del pipeline, añadiendo nuevos tests con cada despliegue o commit relevante.

Todos los engagements asociados a un producto pueden ser visualizados por el equipo responsable, y DefectDojo ofrece vistas como el calendario para facilitar la planificación y el seguimiento de las actividades de seguridad.

Además, DefectDojo permite gestionar múltiples engagements activos, hacer seguimiento del progreso de remediación, generar informes y visualizar métricas clave para la toma de decisiones y la mejora continua. Para entornos automatizados, es posible emplear integraciones o scripts personalizados que creen y actualicen engagements de forma automática, adaptándose a los flujos de trabajo de cada organización.

## Tests

En DefectDojo, un "test" es una agrupación de actividades realizadas por ingenieros o herramientas automatizadas con el objetivo de identificar fallos o vulnerabilidades en un producto. Los tests permiten organizar y documentar los distintos esfuerzos de evaluación de seguridad, facilitando la trazabilidad y el análisis de los resultados obtenidos.

Cada test en DefectDojo cuenta con:

- **Título único:** Identifica de manera precisa el test dentro del engagement.
- **Tipo de test:** Especifica la naturaleza de la prueba realizada, como por ejemplo "API Test", "Nessus Scan", "Burp Scan", entre otros. Esto ayuda a clasificar y filtrar los diferentes métodos de evaluación aplicados.
- **Entorno de test:** Indica el entorno en el que se ha realizado la prueba (por ejemplo, desarrollo, preproducción, producción), proporcionando contexto sobre las condiciones bajo las cuales se identificaron los hallazgos.
- **Engagement asociado:** Todo test está vinculado a un engagement, lo que permite agrupar los resultados dentro de un periodo o conjunto de actividades de evaluación de seguridad.

Los tests pueden crearse de diferentes maneras:

- **Importación de datos de escaneo:** Los resultados de herramientas de análisis pueden importarse directamente a un engagement, lo que genera automáticamente un nuevo test que contiene esos datos.
- **Creación manual:** Es posible crear tests por adelantado, sin datos de escaneo, como parte de la planificación de futuros engagements o para registrar pruebas manuales.
- **Importación ad-hoc:** Si se añade un test directamente a un producto sin un engagement asociado, DefectDojo crea automáticamente un engagement genérico para contener ese test, permitiendo la importación puntual de datos.

### Interacción y gestión de tests

- Los tests agrupan los datos de pruebas y los organizan en findings, facilitando la gestión de los hallazgos detectados.
- Es habitual que los equipos de seguridad repitan los mismos tipos de pruebas de forma periódica. DefectDojo permite reimportar los resultados de un test dentro del mismo engagement, comparando los datos y evitando la creación de findings duplicados.
- Si se ejecuta el mismo tipo de test en diferentes engagements sobre un mismo producto, DefectDojo compara los resultados con los tests previos para identificar findings duplicados y mantener el historial de hallazgos mitigados o aceptados como riesgo.

## Findings

En DefectDojo, un "finding" es un registro que representa un hallazgo o descubrimiento concreto de un problema de seguridad identificado durante la realización de pruebas sobre una aplicación, sistema o infraestructura. Los findings permiten documentar, clasificar y gestionar de forma estructurada las vulnerabilidades, debilidades o riesgos detectados, facilitando su revisión, priorización y seguimiento a lo largo del ciclo de vida del software.

Los findings pueden ser generados automáticamente a partir de la importación de resultados de herramientas de análisis (como escáneres de vulnerabilidades, análisis estático o dinámico, etc.) o añadidos manualmente por profesionales de seguridad, testers o desarrolladores durante la ejecución de pruebas específicas.

Cada finding en DefectDojo incluye información clave para su gestión:

- **Nombre único del finding:** Identifica de manera precisa el hallazgo, facilitando su referencia y seguimiento.
- **Fecha de detección:** Indica el momento en que se descubrió el problema, lo que ayuda a contextualizar el hallazgo y priorizar su resolución.
- **Estado:** Cada finding puede tener varios estados asociados, como Activo, Verificado, Falso Positivo, Mitigado, o Cerrado. Estos estados permiten gestionar el ciclo de vida del hallazgo y su evolución desde la detección hasta la resolución.
- **Test asociado:** Todo finding está vinculado a un test específico, lo que permite rastrear el origen del hallazgo y relacionarlo con la actividad o herramienta que lo identificó.
- **Nivel de severidad:** Los findings se clasifican según su impacto potencial en la seguridad, utilizando categorías como Crítico, Alto, Medio, Bajo e Informativo. Esta clasificación ayuda a priorizar la corrección de los problemas más relevantes.
- **Tipo de vulnerabilidad:** Se especifica la naturaleza del problema, como inyección SQL, falta de validación de entradas, configuraciones inseguras, exposición de datos sensibles, entre otros.
- **Ubicación:** Proporciona detalles sobre dónde se encuentra el problema, como archivos de código, rutas, endpoints, configuraciones o componentes afectados.
- **Descripción detallada:** Explica el hallazgo, su contexto y posibles implicaciones, facilitando su comprensión por parte de los equipos técnicos y de gestión.
- **Evidencias y contexto adicional:** Se pueden adjuntar pruebas, capturas de pantalla, fragmentos de código, registros o cualquier información relevante que respalde el hallazgo y ayude a su análisis.
- **Asignación de responsabilidad:** Permite designar a una persona o equipo responsable de la revisión y corrección del finding, asegurando la trazabilidad y el seguimiento de las acciones.
- **Historial y auditoría:** Se registra el historial de cambios, comentarios y actualizaciones sobre el finding, permitiendo una auditoría completa del proceso de gestión.
- **Comentarios y discusión:** Los miembros del equipo pueden añadir comentarios, discutir posibles soluciones o aclarar dudas directamente en el registro del finding.
- **Priorización y planificación:** Los findings pueden ser priorizados y planificados en función de su criticidad, impacto y contexto, ayudando a organizar las tareas de remediación y asignar recursos de manera eficiente.

Los findings pueden representar una amplia variedad de problemas, como vulnerabilidades en bibliotecas, configuraciones inseguras, errores de lógica, exposición de información sensible o incumplimientos de políticas de seguridad. Ejemplos de findings incluyen:

- Vulnerabilidad potencial de MiTM en OpenSSL ‘ChangeCipherSpec’
- Aplicación web potencialmente vulnerable a clickjacking
- Protección XSS del navegador web no habilitada

La gestión adecuada de los findings en DefectDojo es fundamental para mantener la seguridad y la calidad de las aplicaciones, permitiendo un seguimiento detallado, colaborativo y auditable de los problemas detectados y sus soluciones.
