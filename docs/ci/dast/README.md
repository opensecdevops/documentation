---
title: DAST
description: DAST, o Pruebas Dinámicas de Seguridad de Aplicaciones, es una técnica utilizada para evaluar la seguridad de aplicaciones web y APIs en tiempo de ejecución.
keywords:
  - DAST
  - Dynamic Application Security Testing
  - Pruebas Dinámicas de Seguridad de Aplicaciones
  - Seguridad de Aplicaciones
  - Vulnerabilidades
---

DAST (Dynamic Application Security Testing), o Pruebas Dinámicas de Seguridad de Aplicaciones, es una técnica utilizada para evaluar la seguridad de aplicaciones web y APIs en tiempo de ejecución. A diferencia de los análisis estáticos, DAST interactúa con la aplicación mientras está en funcionamiento, simulando el comportamiento de un atacante externo para identificar vulnerabilidades, configuraciones inseguras y otros riesgos de seguridad. Esta metodología permite analizar cómo responde la aplicación ante diferentes amenazas y contribuye a fortalecer sus defensas de manera proactiva.

## Características principales

- **Evaluación en tiempo de ejecución:** DAST realiza pruebas mientras la aplicación está activa, permitiendo identificar vulnerabilidades que solo se manifiestan durante la ejecución, como problemas de autenticación, autorización, gestión de sesiones y validación de entradas.
- **Escaneos automatizados y manuales:** Utiliza herramientas automatizadas para realizar escaneos exhaustivos, pero también puede complementarse con pruebas manuales para detectar vulnerabilidades complejas o específicas del contexto de la aplicación.
- **Cobertura de vulnerabilidades comunes:** Detecta una amplia gama de vulnerabilidades, incluyendo inyecciones SQL, XSS, CSRF, exposición de datos sensibles, errores de configuración, rutas de acceso inseguras y otros riesgos definidos en estándares como OWASP Top 10.
- **Identificación y evaluación de riesgos:** No solo detecta vulnerabilidades, sino que también evalúa el impacto potencial y la probabilidad de explotación, ayudando a priorizar la remediación según el riesgo real para la organización.
- **Simulación de ataques controlados:** Realiza ataques simulados y controlados para verificar la respuesta de la aplicación ante amenazas, sin afectar la disponibilidad o integridad del entorno de producción.
- **Escalabilidad y adaptabilidad:** Es adecuado para aplicaciones de cualquier tamaño y complejidad, desde proyectos pequeños hasta soluciones empresariales, y puede adaptarse a diferentes tecnologías y arquitecturas.
- **Informes detallados y trazabilidad:** Genera informes completos que incluyen descripciones de vulnerabilidades, ubicaciones, riesgos asociados, recomendaciones de mitigación y trazabilidad para facilitar el seguimiento y la corrección.
- **Integración en CI/CD:** Puede integrarse en pipelines de integración y entrega continua, permitiendo la evaluación automática y periódica de la seguridad en cada fase del ciclo de desarrollo.
- **Identificación de rutas de ataque y puntos de entrada:** Ayuda a mapear posibles rutas de ataque, puntos de entrada y superficies expuestas, proporcionando una visión más completa del perfil de riesgo de la aplicación.
- **Comprobación de seguridad continua:** Permite realizar pruebas de manera recurrente para garantizar que las aplicaciones sigan siendo seguras tras actualizaciones, cambios en el código o despliegues de nuevas funcionalidades.
- **Cumplimiento normativo y estándares:** Facilita el cumplimiento de regulaciones y estándares de seguridad (como PCI DSS, ISO/IEC 27001, NIST, entre otros) al identificar y mitigar vulnerabilidades de manera sistemática.
- **Soporte para diferentes tipos de aplicaciones:** DAST puede aplicarse tanto a aplicaciones web tradicionales como a APIs REST, SOAP y aplicaciones modernas basadas en microservicios.
- **Facilidad de uso y automatización:** Muchas herramientas DAST ofrecen interfaces intuitivas, integración con sistemas de gestión de vulnerabilidades y capacidades de automatización para optimizar el proceso de pruebas.

En resumen, DAST es una práctica fundamental para identificar y mitigar vulnerabilidades en aplicaciones en funcionamiento, complementando otras técnicas de seguridad y contribuyendo a la protección integral del software a lo largo de su ciclo de vida.
