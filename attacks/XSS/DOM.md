# DOM

## Bajo

En el nivel bajo del análisis de XSS, se presenta una prueba de XSS basada en el DOM. Aquí, se encuentra un elemento select en la interfaz de usuario que, al ser activado, genera una URL con un parámetro "default" establecido en un valor específico, en este caso, "French".

```html
http://localhost/vulnerabilities/xss_d/?default=French
```

<div style={{textAlign: 'center'}}>
    ![Input XSS básico](/img/attacks/XSS/DOM/input-dom.png)
</div>

Siguiendo el enfoque utilizado en niveles anteriores, se realiza un ataque básico de XSS agregando un script de alerta en la URL para observar la reacción de la aplicación. Al incluir el script en la URL como valor para el parámetro "default", se observa que el ataque tiene éxito y se muestra una alerta en la página.

```js
http://localhost/vulnerabilities/xss_d/?default=French<script>alert("low")</script>
```

Esto confirma la existencia de una vulnerabilidad XSS en el nivel bajo de la aplicación.

<div style={{textAlign: 'center'}}>
    ![Ataque básico](/img/attacks/XSS/DOM/attack-basic.png)
</div>

Este resultado demuestra una vulnerabilidad de XSS en el DOM. Aunque este tipo de ataques pueden parecer simples, representan un riesgo significativo si no se gestionan adecuadamente. Identificar y corregir estas vulnerabilidades es fundamental para la seguridad de las aplicaciones web.

## Medio

En el nivel medio, se sigue el enfoque habitual de comenzar con un ataque simple para verificar si existen vulnerabilidades. Sin embargo, se observa que el ataque básico utilizado anteriormente no tiene éxito en este nivel.

<div style={{textAlign: 'center'}}>
    ![Input XSS básico](/img/attacks/XSS/DOM/input-dom.png)
</div>

Esto sugiere que el nivel medio cuenta con medidas de seguridad más robustas. Es posible que se hayan implementado controles adicionales o filtros más estrictos para prevenir ataques XSS.

Dado que el ataque más simple no funciona, es necesario adoptar un enfoque más avanzado o explorar otras técnicas para identificar posibles vulnerabilidades de XSS en este nivel. Esto puede implicar analizar el código fuente de la aplicación, identificar posibles puntos de entrada y probar diferentes vectores de ataque.

Al examinar el código fuente relevante, se observa que se utiliza la función `stripos`, que encuentra la posición de la primera aparición de una subcadena en una cadena sin distinguir entre mayúsculas y minúsculas. Esta función se utiliza probablemente para validar o procesar el valor del parámetro proporcionado en la URL.

```php
# Do not allow script tags
if (stripos ($default, "<script") !== false) {
    header ("location: ?default=English");
    exit;
}
```

Al intentar inyectar la etiqueta **script** en la URL para ejecutar un script de XSS, la función `stripos` detecta la presencia de esta cadena, lo que resulta en una redirección a la URL por defecto o a una acción predefinida en el código. Esto indica que se han implementado medidas de seguridad para detectar y evitar intentos de XSS mediante la inspección del contenido de la URL.

Como en otros ejemplos de XSS, se puede utilizar un evento HTML. Por ejemplo, se prueba la siguiente URL:

```js
English<img src=x onerror=alert("medium")>
```

En este caso, el código insertado en la URL se muestra dentro de un elemento option, por lo que es necesario cerrar el option y el select para que el código se ejecute fuera de estos elementos.

```url
English"></option></select><img src=x onerror=alert("medium")>
```

Al hacer esto, la inyección de código es exitosa.

<div style={{textAlign: 'center'}}>
    ![Ataque medio](/img/attacks/XSS/DOM/attack-medium.png)
</div>

## Alto

En el nivel alto, al aplicar los mismos ataques que en los niveles anteriores, el elemento select de la interfaz de usuario no reacciona a los intentos de inyección de código. Esto sugiere que las medidas de seguridad implementadas en este nivel son más estrictas y efectivas para prevenir ataques XSS.

<div style={{textAlign: 'center'}}>
    ![Input DOM](/img/attacks/XSS/DOM/input-dom.png)
</div>

Al revisar el código relevante, se observa que se utiliza una estructura `switch` para validar si el valor proporcionado es uno de los permitidos.

```php
switch ($_GET['default']) {
    case "French":
    case "English":
    case "German":
    case "Spanish":
        # ok
        break;
    default:
        header ("location: ?default=English");
        exit;
}
```

El uso de un `switch` en este contexto indica que solo se aceptan ciertos valores predefinidos, lo que constituye una medida de seguridad para evitar la manipulación de datos inesperados.

En las URL, las anclas se utilizan para identificar y desplazarse a secciones específicas dentro de una página web. La parte de la URL que sigue al símbolo "#" (fragmento) no se envía al servidor cuando se realiza una solicitud HTTP.

```url
http://localhost/vulnerabilities/xss_d/?default=English#dvwa
```

Debido a que el fragmento de la URL no se envía al servidor, no puede ser filtrado o procesado por lógica del servidor. Esto significa que los caracteres o contenido presentes después del "#" no son considerados en la respuesta del servidor. Por lo tanto, los ataques de inyección de código, como XSS, no pueden ser prevenidos o mitigados mediante la filtración del fragmento de la URL en el lado del servidor.

Al probar la siguiente URL, se observa que el contenido se muestra en el select.

<div style={{textAlign: 'center'}}>
    ![Ataque alto inicial](/img/attacks/XSS/DOM/attack-high-initial.png)
</div>

Esto se debe a una mala implementación del JavaScript que renderiza la página.

```js
if (document.location.href.indexOf("default=") >= 0) {
    var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
    document.write("<option value='" + lang + "'>" + decodeURI(lang) + "</option>");
    document.write("<option value='' disabled='disabled'>----</option>");
}
```

Como se puede ver, el valor recibido en el parámetro `default` se inserta directamente en el HTML, lo que permite la ejecución de código si se utiliza el fragmento de la URL:

```url
http://localhost/vulnerabilities/xss_d/?default=English#<script>alert("high")</script>
```

Esto permite realizar el ataque.

<div style={{textAlign: 'center'}}>
    ![Ataque alto](/img/attacks/XSS/DOM/attack-high.png)
</div>

Es importante tener en cuenta esta limitación al diseñar medidas de seguridad para aplicaciones web. Aunque el fragmento de la URL no representa un riesgo de seguridad directo en el lado del servidor, es fundamental implementar otras medidas de seguridad, como la validación y el filtrado de la entrada, la sanitización de datos y el uso de políticas de seguridad de contenido, para protegerse contra posibles vulnerabilidades, incluidos los ataques XSS.
