# Flujo de trabajo

Para asegurar un proceso de desarrollo seguro dentro de este marco de trabajo, se describen diversas etapas que pueden ser implementadas. Es importante considerar que estas etapas deben adaptarse a las particularidades de cada proyecto, reconociendo que no todas son obligatorias en todos los casos. Este enfoque flexible permite alcanzar niveles óptimos de seguridad según las necesidades de cada proyecto y facilita la integración progresiva de controles y buenas prácticas.

La aplicación de estas fases contribuye a construir aplicaciones más seguras y confiables, reduciendo los riesgos asociados a vulnerabilidades y brechas de seguridad. Cada etapa aporta valor al proceso de desarrollo, orientándolo hacia la protección de los sistemas y los datos, y facilitando la adaptación a los requisitos y desafíos de cada proyecto.

## Búsqueda de fugas de contraseñas

En esta fase se emplean herramientas especializadas para detectar posibles filtraciones de información sensible, como contraseñas, claves de API o tokens, en el repositorio de código. Esta medida ayuda a evitar la exposición accidental de datos confidenciales, lo que podría derivar en vulnerabilidades, accesos no autorizados o divulgación de información crítica. La integración de este análisis en los flujos de trabajo automatizados permite una detección temprana y la corrección inmediata de hallazgos antes de que lleguen a producción.

## Análisis de dependencias (SBOM - Software Bill of Materials)

Se realiza un análisis exhaustivo de las dependencias del proyecto utilizando herramientas específicas que generan un inventario detallado (SBOM) de bibliotecas, frameworks y componentes de terceros. Este análisis proporciona una visión clara de los elementos utilizados, facilita la identificación de posibles vulnerabilidades conocidas en las dependencias y ayuda a gestionar licencias y cumplimiento normativo. Además, permite evaluar el impacto de actualizaciones o cambios en los componentes y contribuye a la trazabilidad y transparencia en la cadena de suministro de software.

## Pruebas unitarias e integración

Se ejecutan pruebas unitarias para validar el funcionamiento de las distintas partes del código de forma aislada, permitiendo identificar y resolver problemas en etapas tempranas y contribuyendo a la solidez de la aplicación. Además, se realizan pruebas de integración para asegurar la correcta interacción entre los diferentes módulos y componentes, garantizando un desempeño coherente y confiable del sistema. La automatización de estas pruebas es clave para mantener la calidad y facilitar la detección de regresiones a lo largo del ciclo de desarrollo.

## Análisis de código estático (SAST - Static Application Security Testing)

Se aplica un análisis estático de seguridad al código mediante herramientas especializadas, con el objetivo de identificar vulnerabilidades conocidas, errores de codificación, malas prácticas y problemas de calidad. La detección temprana de vulnerabilidades en las primeras etapas del desarrollo contribuye a prevenir posibles brechas de seguridad y reduce el coste de corrección. Este análisis puede incluir la revisión de configuraciones, la búsqueda de patrones inseguros y la verificación del cumplimiento de estándares de codificación.

## Análisis de Dockerfile

En esta etapa se analiza la creación de imágenes de contenedor, poniendo énfasis en la seguridad y el cumplimiento de buenas prácticas. Se evalúan los Dockerfiles para identificar posibles problemas o configuraciones que puedan afectar la seguridad, como el uso de imágenes base desactualizadas, permisos excesivos o exposición innecesaria de puertos y servicios. Este análisis contribuye a que las imágenes de contenedor sigan recomendaciones establecidas, minimicen la superficie de ataque y reduzcan la exposición a riesgos desde el inicio del proceso de construcción.

## Construcción de contenedores

La construcción de contenedores implica la creación de imágenes que encapsulan aplicaciones y sus dependencias en entornos portátiles y reproducibles. Mediante archivos Dockerfile y buenas prácticas, se configuran entornos de ejecución seguros y eficientes. Durante este proceso, se automatiza la construcción, se verifica la integridad de los componentes y se pueden aplicar firmas digitales para garantizar la autenticidad. Esta fase establece las bases para implementaciones coherentes y confiables en producción, facilitando la escalabilidad y la gestión de versiones.

## Análisis de contenedores

Tras la construcción del contenedor, se realiza un análisis de seguridad para evaluar los componentes incluidos en la imagen. Se examinan las bibliotecas, binarios y configuraciones en busca de vulnerabilidades conocidas, configuraciones inseguras o componentes obsoletos. La información obtenida permite tomar medidas proactivas para abordar posibles puntos de mejora antes de su despliegue en producción, reduciendo el riesgo de explotación de vulnerabilidades en el entorno operativo.

## Firmado de contenedores

Para reforzar la seguridad, se aplica el firmado digital de los contenedores. Las firmas digitales permiten verificar la autenticidad e integridad de las imágenes, asegurando que no hayan sido modificadas y que provengan de una fuente confiable. Este proceso facilita la trazabilidad, la auditoría y la confianza en la cadena de suministro, y es especialmente relevante en entornos donde se utilizan imágenes de terceros o se distribuyen aplicaciones a múltiples entornos.

## Análisis dinámico (DAST - Dynamic Application Security Testing)

En esta etapa se realiza un análisis dinámico de seguridad mediante pruebas que simulan ataques en tiempo real sobre el código desplegado. Este proceso ayuda a identificar vulnerabilidades y riesgos que podrían ser explotados en un entorno real, como fallos de autenticación, autorización, gestión de sesiones o validación de entradas. Al explorar activamente posibles debilidades durante la ejecución de la aplicación, se pueden tomar medidas preventivas para fortalecer su seguridad en producción y cumplir con requisitos regulatorios o de clientes.
