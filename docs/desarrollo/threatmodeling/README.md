# Threat Modeling

**Threat Modeling** es una práctica fundamental para incorporar la seguridad desde las fases iniciales de diseño de un sistema. Su objetivo es analizar de manera estructurada los riesgos potenciales y las vulnerabilidades, permitiendo planificar defensas antes de que los problemas puedan manifestarse.

## ¿Qué es Threat Modeling?

Threat Modeling responde a preguntas clave de seguridad en el desarrollo de software:

1. **¿Qué se está construyendo?**
   Identificar los activos clave (datos, sistemas, procesos) y comprender cómo interactúan los componentes del sistema.
1. **¿Qué estamos construyendo?**
   Identificar los activos clave (datos, sistemas, procesos) y entender cómo interactúan los componentes del sistema.
2. **¿Qué podría salir mal?**
   Identificar posibles amenazas que puedan explotar vulnerabilidades o debilidades en el diseño.
3. **¿Qué se está haciendo para mitigarlo?**
   Diseñar y aplicar controles de seguridad para prevenir, detectar o responder a las amenazas.
4. **¿Se ha hecho lo suficiente?**
   Validar que los controles implementados son adecuados y evaluar el riesgo residual.
   Identificar posibles amenazas que puedan explotar vulnerabilidades o debilidades en el diseño.
3. **¿Qué estamos haciendo para mitigarlo?**
   Diseñar y aplicar controles de seguridad para prevenir, detectar o responder a las amenazas.
4. **¿Hemos hecho suficiente?**
   Validar que los controles implementados son adecuados y evaluar el riesgo residual.

Threat Modeling es un proceso iterativo. A medida que el sistema evoluciona, es importante revisar y actualizar el modelo con los nuevos cambios.

## Ventajas de Threat Modeling

1. **Reducción de riesgos:** Identificar vulnerabilidades en las fases tempranas del desarrollo ahorra tiempo y dinero en comparación con mitigarlas en producción.
2. **Defensas proactivas:** Permite pensar en cómo mitigar amenazas antes de que estas ocurran, en lugar de reaccionar a incidentes.
3. **Mejora la colaboración:** Fomenta una comunicación más efectiva entre desarrolladores, equipos de seguridad y partes interesadas.
4. **Cumplimiento normativo:** Apoya el cumplimiento de estándares como ISO 27001, GDPR, CRA o NIST2.
5. **Optimización del desarrollo:** Facilita un diseño más robusto desde el principio, reduciendo retrabajos en el código.

## Metodologías en Threat Modeling

Las metodologías son guías estructuradas para llevar a cabo Threat Modeling. Cada una tiene un enfoque diferente y puede ser más adecuada según las necesidades del proyecto. A continuación, se describen algunas de las utilizadas en la herramienta Threat Dragon:

### STRIDE

**STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)** es una metodología desarrollada por Microsoft que clasifica las amenazas en seis categorías principales, orientada a proteger la funcionalidad y los datos de los sistemas.

1. **Spoofing (Suplantación):**
   
   - Amenaza: Un atacante se hace pasar por otra identidad legítima en el sistema.
   - Ejemplo: Acceso no autorizado mediante credenciales robadas.
   - Controles típicos: Autenticación fuerte (MFA), gestión de identidades y políticas de acceso.
2. **Tampering (Manipulación):**
   
   - Amenaza: Alteración maliciosa de datos o procesos en el sistema.
   - Ejemplo: Modificación de un archivo de configuración para deshabilitar la seguridad.
   - Controles típicos: Firmas digitales, integridad de datos y mecanismos de validación.
3. **Repudiation (Repudio):**
   
   - Amenaza: Negación de acciones realizadas en el sistema por parte de un usuario.
   - Ejemplo: Un usuario que niega haber enviado un correo electrónico.
   - Controles típicos: Registro de auditorías y no repudio mediante técnicas como logs firmados.
4. **Information Disclosure (Divulgación de Información):**
   
   - Amenaza: Exposición no autorizada de información sensible.
   - Ejemplo: Datos confidenciales enviados en texto plano.
   - Controles típicos: Cifrado en tránsito y reposo, y políticas de privacidad.
5. **Denial of Service (Denegación de Servicio):**
   
   - Amenaza: Interrupción del acceso legítimo al sistema.
   - Ejemplo: Ataque DDoS que inutiliza un servidor web.
   - Controles típicos: Escalabilidad, balanceo de carga y mitigación de ataques DDoS.
6. **Elevation of Privilege (Escalamiento de Privilegios):**
   
   - Amenaza: Un atacante obtiene más privilegios de los que debería tener.
   - Ejemplo: Un usuario con permisos limitados accediendo a funciones administrativas.
   - Controles habituales: Separación de roles y control de accesos.

### LINDDUN

**LINDDUN (Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance)** es una metodología orientada a identificar amenazas relacionadas con la privacidad en los sistemas.

1. **Linkability (Vinculación):**
   
   - Amenaza: Relacionar datos que deberían permanecer separados.
   - Ejemplo: Asignar registros de usuarios anónimos a una identidad específica.
   - Controles típicos: Separación de datos y técnicas de anonimización.
2. **Identifiability (Identificación):**
   
   - Amenaza: Identificar a un individuo a partir de datos anónimos.
   - Ejemplo: Reconstruir la identidad de un usuario a partir de metadatos.
   - Controles típicos: Pseudonimización y reducción de metadatos.
3. **Non-repudiation (No repudio):**
   
   - Amenaza: Negación de acciones relacionadas con datos personales.
   - Ejemplo: Un usuario que niega haber consentido el uso de sus datos.
   - Controles típicos: Auditorías de consentimiento y registros claros.
4. **Detectability (Detectabilidad):**
   
   - Amenaza: Posibilidad de identificar la presencia de un sujeto en el sistema.
   - Ejemplo: Identificar usuarios por patrones de acceso.
   - Controles típicos: Gestión de accesos y análisis de patrones anónimos.
5. **Disclosure of Information (Divulgación de Información):**
   
   - Amenaza: Filtración de datos sensibles.
   - Ejemplo: Datos personales expuestos por un error en la configuración de la base de datos.
   - Controles típicos: Cifrado y políticas de acceso.
6. **Unawareness (Desconocimiento):**
   
   - Amenaza: Los usuarios no entienden cómo se usan sus datos.
   - Ejemplo: No informar a los usuarios sobre el procesamiento de sus datos.
   - Controles típicos: Transparencia y políticas claras.
7. **Non-compliance (No conformidad):**
   
   - Amenaza: Incumplimiento de regulaciones o estándares.
   - Ejemplo: Almacenamiento de datos sin cumplir con normativas aplicables.
   - Controles habituales: Evaluaciones regulares y cumplimiento normativo.

### CIA

La metodología **CIA (Confidentiality, Integrity, Availability)** se centra en los tres principios fundamentales de la seguridad de la información.

1. **Confidentiality (Confidencialidad):**
   
   - Garantizar que solo las personas autorizadas pueden acceder a la información.
   - Controles típicos: Cifrado, autenticación y control de accesos.
2. **Integrity (Integridad):**
   
   - Asegurar que los datos no sean alterados de forma no autorizada.
   - Controles típicos: Hashing, validación de datos y registros inmutables.
3. **Availability (Disponibilidad):**
   
   - Garantizar que los sistemas y datos estén accesibles para los usuarios legítimos.
   - Controles típicos: Alta disponibilidad, balanceo de carga y planes de recuperación.

### DIE

**DIE (Distributed, Immutable, Ephemeral)** es una metodología adaptada a arquitecturas modernas y entornos en la nube.

1. **Distributed (Distribuido):**
   
   - Sistemas diseñados para operar sin un único punto de falla.
   - Controles típicos: Réplicas y arquitecturas distribuidas.
2. **Immutable (Inmutable):**
   
   - Los sistemas no cambian después de su despliegue.
   - Controles típicos: Contenedores y despliegues inmutables.
3. **Ephemeral (Efímero):**
   
   - Los sistemas tienen vidas útiles cortas y se destruyen después de su uso.
   - Controles habituales: Autoscaling y rotación de recursos.

### PLOT4ai

**PLOT4ai (Privacy, Liveness, Ownership, Transparency for AI)** está orientada a abordar desafíos de privacidad y ética en sistemas de inteligencia artificial.

1. **Privacy (Privacidad):**
   
   - Proteger los datos utilizados por los modelos.
   - Controles típicos: Anonimización y técnicas federadas.
2. **Liveness (Vigencia):**
   
   - Mantener los sistemas actualizados.
   - Controles típicos: Retrain continuo de modelos.
3. **Ownership (Propiedad):**
   
   - Definir derechos sobre los datos y los modelos.
   - Controles típicos: Contratos claros y auditorías.
4. **Transparency (Transparencia):**
   
   - Asegurar decisiones comprensibles por los usuarios.
   - Controles típicos: Modelos interpretables y explicabilidad.

## Herramientas para Threat Modeling

1. **OWASP Threat Dragon**
2. **OWASP pytm**

