# Reflejado

## Bajo

En el primer nivel, al ingresar, se presenta un campo de entrada que solicita el nombre. Al introducirlo, el sistema imprime directamente lo que se ha ingresado en el campo. Esto ocurre porque el código recoge la variable y la imprime sin ningún proceso de validación o saneamiento. Esta situación puede presentar un riesgo de seguridad, ya que permite la inserción de código no deseado que se ejecutará en el navegador.

<div style={{textAlign: 'center'}}>
    ![Input XSS básico](/img/attacks/XSS/reflected/input-basic.png)
</div>

```php
<?php 

// Is there any input? 
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) { 
    // Feedback for end user 
    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>'; 
} 

?>
```

Dado este comportamiento, una de las primeras pruebas para detectar la vulnerabilidad XSS consiste en introducir el siguiente código:

```html
<script>alert(1);</script>
```

Este código intenta inyectar un script JavaScript que ejecuta una alerta en el navegador. Si al introducir este código en el campo de entrada y enviarlo, la página muestra una alerta, se confirma que la aplicación es vulnerable a ataques de Cross-Site Scripting, ya que la entrada no está siendo debidamente validada o saneada antes de ser renderizada.

<div style={{textAlign: 'center'}}>
    ![Ataque básico](/img/attacks/XSS/reflected/attack-basic.png)
</div>

Si al insertar el código en el campo de entrada este se refleja en la barra de direcciones, indica que se trata de un caso de XSS reflejado, donde el código inyectado se transmite a través de la URL.

<div style={{textAlign: 'center'}}>
    ![Ataque básico url](/img/attacks/XSS/reflected/url-basic.png)
</div>

Si se comparte este enlace y otra persona lo abre en su navegador, el código XSS introducido se ejecutará automáticamente. Esto puede permitir el robo de información, secuestro de sesión, entre otros riesgos, dependiendo del código XSS utilizado. Es fundamental que las aplicaciones web validen y limpien correctamente todas las entradas para evitar estas vulnerabilidades.

## Medio

En el nivel medio, la vulnerabilidad XSS reflejada inicial ya no se ejecuta utilizando el método tradicional debido a una medida de mitigación implementada en el código PHP del servidor.

<div style={{textAlign: 'center'}}>
    ![Ataque básico en medio](/img/attacks/XSS/reflected/attack-basic-in-medium.png)
</div>

El código relevante que implementa esta protección es:

```php
<?php

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = str_replace( '<script>', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

Esta parte del código utiliza [str_replace](http://php.net/manual/es/function.str-replace.php) para eliminar específicamente la cadena `<script>` del nombre ingresado. Sin embargo, la función `str_replace` es sensible a mayúsculas y minúsculas, por lo que solo eliminará las etiquetas `<script>` escritas exactamente así.

Para probar la robustez de esta medida, se puede intentar un ataque XSS que eluda esta mitigación cambiando el caso de las letras en la etiqueta `<script>`:

```javascript
<SCRIPT>alert("medium")</SCRIPT>
```

Si al ejecutar este código se produce la alerta, se confirma que el ataque XSS ha sido exitoso.

<div style={{textAlign: 'center'}}>
    ![Ataque medio](/img/attacks/XSS/reflected/attack-medium.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Ataque medio url](/img/attacks/XSS/reflected/url-medium.png)
</div>

Esto indica que, aunque se haya implementado una medida de seguridad, su efectividad es limitada debido a su incapacidad para manejar variaciones en el caso de las letras. Esto demuestra la importancia de implementar métodos de saneamiento más robustos y sensibles al caso, o enfoques más exhaustivos como el uso de listas blancas o la codificación de salida para caracteres especiales en HTML.

## Alto

En el último nivel de los ataques XSS reflejados, los métodos de inyección directa utilizando etiquetas `<script>` ya no son efectivos debido a la implementación de una expresión regular más robusta en el código PHP, que filtra eficazmente estas etiquetas sin importar las variaciones de mayúsculas y minúsculas:

<div style={{textAlign: 'center'}}>
    ![Ataque alto con básico y medio](/img/attacks/XSS/reflected/attack-basic-medium-in-high.png)
</div>

```php
<?php

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

Este enfoque evita el uso de etiquetas `<script>` manipulando las letras y los espacios intermedios. Sin embargo, esta medida todavía deja abierta la posibilidad de utilizar otros vectores de ataque que no dependen directamente de estas etiquetas. Una técnica común en estos casos es el uso de eventos HTML que pueden desencadenar JavaScript de forma indirecta.

### Uso del atributo `onerror` en una etiqueta `<img>`

Una alternativa es explotar atributos como `onerror` en elementos HTML que ejecutan código JavaScript cuando ocurre un error, como al cargar una imagen:

```html
<img src=x onerror="alert('High')">
```

En este caso, dado que `"x"` no es una URL válida de imagen, el navegador intentará cargarla, fallará y luego ejecutará el código JavaScript dentro del atributo `onerror`, mostrando una alerta.

<div style={{textAlign: 'center'}}>
    ![Ataque alto img](/img/attacks/XSS/reflected/attack-high.png)
</div>

### Uso de SVG para ejecución de JavaScript

Otra opción es el uso de elementos SVG, que también permiten la inclusión de JavaScript:

```html
<svg/onload=alert('High2')>
```

Aquí, el evento `onload` dentro de un elemento SVG se utiliza para ejecutar JavaScript cuando el SVG se carga, lo cual sucede inmediatamente, ya que los SVG se procesan como parte del DOM.

<div style={{textAlign: 'center'}}>
    ![Ataque con svg](/img/attacks/XSS/reflected/attack-high-svg.png)
</div>

Ambos métodos demuestran que, aunque las mitigaciones específicas para etiquetas `<script>` pueden ser efectivas contra ciertas formas de ataques XSS, es importante considerar y proteger contra otros vectores que utilizan diferentes elementos y atributos HTML. Se recomienda adoptar un enfoque de seguridad en capas, que incluya tanto la validación y el saneamiento de entradas como también políticas de seguridad de contenido (CSP) que restrinjan la ejecución de scripts no autorizados.

## Ampliación de técnicas

Para quienes deseen profundizar en la prevención y mitigación de ataques de Cross-Site Scripting (XSS), se recomienda consultar los siguientes recursos:

- [**XSS Cheat Sheet de PortSwigger**](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet): guía detallada con técnicas y ejemplos prácticos para entender y probar defensas contra XSS.
- [**XSS Filter Evasion Cheat Sheet de OWASP**](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html): compendio de estrategias para evadir filtros de XSS, útil para diseñadores y auditores de seguridad.

Estos recursos son útiles para quienes buscan fortalecer la seguridad de aplicaciones web frente a ataques XSS.
