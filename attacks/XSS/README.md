# XSS

XSS (Cross-site scripting) es un tipo de vulnerabilidad común en aplicaciones web que permite la inyección de código JavaScript u otros lenguajes similares (por ejemplo, VBScript) en páginas web visitadas por personas usuarias, eludiendo medidas de control como la Política de mismo origen.

Las vulnerabilidades de Cross-Site Scripting pueden encontrarse en aplicaciones que presentan información en un navegador web u otro contenedor de páginas web. No se limitan únicamente a sitios web disponibles en Internet, ya que también pueden afectar a aplicaciones locales vulnerables a XSS o incluso al propio navegador.

XSS es un vector de ataque que puede ser utilizado para robar información sensible, secuestrar sesiones y comprometer el navegador, afectando la integridad del sistema. Estas vulnerabilidades han existido desde los primeros días de la Web.

Esta situación suele deberse a una validación insuficiente de los datos de entrada utilizados en ciertas aplicaciones, o a una limpieza inadecuada de la salida antes de su presentación en la página web. Las vulnerabilidades XSS pueden manifestarse de las siguientes maneras:

- **Reflejada:** Ocurre al modificar valores que la aplicación utiliza para pasar variables entre páginas, sin utilizar sesiones. Suele suceder cuando se incluye un mensaje o una ruta en la URL del navegador.
- **Persistente:** Se produce por un filtrado deficiente y consiste en insertar código HTML peligroso en sitios que lo permiten, incluyendo etiquetas como `<script>` o `<iframe>`.
- **DOM Based XSS:** Es un caso en el que el código JavaScript se oculta en la URL y se extrae mediante JavaScript en la página durante su procesamiento, en lugar de insertarse directamente en la página al publicarse. Esto puede hacerlo más difícil de detectar por mecanismos como WAF u otras protecciones que solo analizan el cuerpo de la página.
