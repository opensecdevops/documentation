# Herramientas

Para implementar el flujo de trabajo descrito anteriormente, se emplean diversas herramientas especializadas en cada etapa del proceso. A continuación se detallan las principales herramientas utilizadas, junto con una breve descripción de su función y aportes al ciclo de vida del desarrollo seguro.

El uso combinado de estas herramientas permite cubrir diferentes aspectos de la seguridad y calidad del software, desde la detección temprana de errores y vulnerabilidades hasta la protección de la cadena de suministro y la validación continua en todo el ciclo de vida del desarrollo.

## Búsqueda de fugas de contraseñas

- **Herramienta:** Gitleaks  
- **Descripción:** Gitleaks escanea el repositorio de código en busca de posibles fugas de contraseñas, claves de API, tokens y otros datos sensibles. Permite la detección temprana de información confidencial expuesta accidentalmente, ayudando a prevenir incidentes de seguridad y facilitando la remediación antes de que el código llegue a producción. Gitleaks puede integrarse en pipelines de CI/CD y configurarse con reglas personalizadas para adaptarse a las necesidades del proyecto.

## Análisis de dependencias (SBOM)

- **Herramienta:** CycloneDX  
- **Descripción:** CycloneDX genera un Software Bill of Materials (SBOM), proporcionando un inventario detallado de todas las dependencias, bibliotecas y componentes de terceros utilizados en el proyecto. Esta herramienta facilita la identificación de vulnerabilidades conocidas, la gestión de licencias y el cumplimiento normativo. CycloneDX soporta múltiples lenguajes y formatos, y puede integrarse en procesos automatizados para mantener actualizado el inventario de componentes.

## Pruebas unitarias e integración

- **Herramienta:** PHPUnit  
- **Descripción:** PHPUnit es un framework para la creación y ejecución de pruebas unitarias en proyectos PHP. Permite validar el comportamiento de funciones, métodos y clases de manera aislada, así como realizar pruebas de integración para verificar la interacción entre diferentes módulos. PHPUnit genera informes detallados sobre los resultados de las pruebas, facilitando la identificación de errores y la mejora continua del software.

## Análisis de código estático (SAST)

- **Herramienta:** SonarQube  
- **Descripción:** SonarQube realiza un análisis estático del código fuente para identificar vulnerabilidades de seguridad, errores de codificación, malas prácticas y problemas de calidad. Ofrece métricas, informes y recomendaciones para mejorar la seguridad y mantenibilidad del código. SonarQube soporta múltiples lenguajes y puede integrarse en pipelines de CI/CD para asegurar la revisión continua del código.

## Análisis de Dockerfile

- **Herramienta:** Hadolint  
- **Descripción:** Hadolint analiza los archivos Dockerfile en busca de errores de sintaxis, configuraciones inseguras y desviaciones de las buenas prácticas recomendadas para la construcción de imágenes de contenedor. Ayuda a reducir la superficie de ataque y a mejorar la seguridad y eficiencia de las imágenes generadas.

## Construcción de contenedores

- **Herramienta:** kaniko  
- **Descripción:** kaniko permite la construcción de imágenes de contenedor en entornos donde no se dispone de acceso a privilegios de root, como en sistemas de CI/CD o en la nube. Facilita la creación de imágenes reproducibles y seguras, soportando la integración con diferentes registros de contenedores y flujos de trabajo automatizados.

## Análisis de contenedores

- **Herramienta:** Trivy  
- **Descripción:** Trivy analiza imágenes de contenedor, sistemas de archivos y repositorios de código en busca de vulnerabilidades conocidas, configuraciones inseguras y componentes obsoletos. Proporciona información detallada sobre los riesgos detectados y recomendaciones para su mitigación. Trivy es compatible con múltiples plataformas y puede integrarse en pipelines de CI/CD para análisis automatizados.

## Firmado de contenedores

- **Herramienta:** Cosign  
- **Descripción:** Cosign permite firmar digitalmente imágenes de contenedor, asegurando su autenticidad e integridad. Facilita la verificación de la procedencia de las imágenes y la protección frente a modificaciones no autorizadas. Cosign puede integrarse en procesos de construcción y despliegue, contribuyendo a la confianza en la cadena de suministro de software.

## Análisis dinámico (DAST)

- **Herramienta:** OWASP ZAP  
- **Descripción:** OWASP ZAP (Zed Attack Proxy) es una herramienta para el análisis dinámico de seguridad de aplicaciones web y APIs. Simula ataques en tiempo real sobre el código en ejecución para identificar vulnerabilidades como inyecciones, fallos de autenticación, exposición de datos sensibles y otros riesgos. OWASP ZAP puede utilizarse tanto de forma manual como automatizada, integrándose en pipelines de CI/CD y facilitando la validación continua de la seguridad en entornos de desarrollo y producción.
