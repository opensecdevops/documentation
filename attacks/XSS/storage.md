# Almacenado

## Bajo

Este tipo de XSS implica que el código malicioso se almacena en el servidor y se muestra a las personas usuarias cuando acceden a una página específica. En el primer nivel se presenta un libro de visitas, donde el código relevante de PHP maneja la entrada y la almacena en una base de datos. Al introducir datos, el sistema imprime directamente lo ingresado en los campos de nombre y mensaje.

<div style={{textAlign: 'center'}}>
    ![Libro de visitas](/img/attacks/XSS/stored/guestbook.png)
</div>

```php
<?php
if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );
    // Sanitize message input
    $message = stripslashes( $message );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    // Sanitize name input
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );
    //mysql_close();
}
?>
```

Analizando el código, el mensaje y el nombre son "sanitizados" utilizando `mysqli_real_escape_string()`, que es adecuado para proteger contra SQL injection pero no necesariamente contra XSS. La función `stripslashes` elimina las barras de un string con comillas escapadas, pero esto puede no ser suficiente para prevenir un ataque XSS persistente.

Por esta razón, se realizan pruebas similares a las del XSS reflejado, introduciendo el siguiente código en el campo de comentario:

```js
<script>alert("low")</script>
```

Este código permite evaluar si existe una vulnerabilidad XSS persistente y si es posible ejecutar código en la aplicación. Si al introducir este código en el campo de mensaje y enviarlo, la página muestra una alerta con el mensaje "low", queda claro que la aplicación es vulnerable a ataques de Cross-Site Scripting, ya que la entrada no está siendo debidamente validada o saneada antes de ser renderizada.

<div style={{textAlign: 'center'}}>
    ![Input ataque básico](/img/attacks/XSS/stored/attack-basic.png)
</div>

## Medio

En este nivel, se incrementa la complejidad al intentar ejecutar un ataque XSS almacenado. La vulnerabilidad inicial ya no se ejecuta utilizando el método tradicional debido a una medida de mitigación implementada en el código PHP del servidor.

```js
<script>alert("medium")</script>
```

<div style={{textAlign: 'center'}}>
    ![Ataque medio no funcional](/img/attacks/XSS/stored/attack-medium-not-work.png)
</div>

Aunque la estrategia inicial no tiene éxito, se pueden explorar nuevas técnicas para superar las medidas de seguridad implementadas.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/input-medium.png)
</div>

Se observa que existe una limitación en el campo del nombre, restringido a 10 caracteres, lo que dificulta la posibilidad de inyectar un script más largo.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/input-maxlength.png)
</div>

Una posible solución consiste en modificar el atributo maxlength del campo de entrada. Al cambiar este valor a uno mayor, como 100 caracteres, se permite la entrada de una mayor cantidad de texto.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/input-maxlength-modify.png)
</div>

```php
<?php
if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = strip_tags( addslashes( $message ) );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );

    // Sanitize name input
    $name = str_replace( '<script>', '', $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}
?>
```

La solución propuesta implica ajustar la restricción del campo de entrada. Si la limitación también está presente en la base de datos, se puede ampliar el tamaño del campo correspondiente para evitar restricciones adicionales.

```js
<SCRIPT>alert("medium")</SCRIPT>
```

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/attack-medium.png)
</div>

En situaciones donde la limitación del campo de entrada está controlada por JavaScript y el código está ofuscado, puede resultar complicado encontrar el punto de validación. En estos casos, se pueden utilizar herramientas como OWASP ZAP para interceptar y modificar las solicitudes antes de que lleguen al servidor.

Para utilizar la intercepción de peticiones mediante OWASP ZAP, se abre el navegador controlado desde OWASP ZAP y se activa la intercepción. Después de introducir los textos en los campos de entrada, se pueden modificar antes de enviar la solicitud al servidor. Al hacer clic en "Forward", la solicitud modificada se envía al servidor.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/owasp-zap-icons.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/owasp-zap-intercept.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/owasp-zap-request.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/attack-medium-owasp-zap.png)
</div>

Este enfoque permite realizar pruebas y explotar vulnerabilidades de XSS persistente de manera controlada, ayudando a comprender las posibles implicaciones de seguridad y a desarrollar estrategias de mitigación.

## Alto

En el nivel alto, se repite el proceso utilizado en el nivel medio, utilizando OWASP ZAP para aprovechar sus capacidades de interceptación y modificación de solicitudes.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/owasp-zap-request-high-fail.png)
</div>

Al abordar el nivel alto, se observa una diferencia en la forma en que se manejan los campos de nombre y mensaje. Al analizar el código fuente, se identifica que uno de los campos se sanea correctamente, mientras que el otro presenta una vulnerabilidad similar a la de los niveles anteriores.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/attack-high-fail.png)
</div>

```php
<?php
if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );
    // Sanitize message input
    $message = strip_tags( addslashes( $message ) );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );
    // Sanitize name input
    $name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );
    //mysql_close();
}
?>
```

En este caso, se puede intentar el ataque utilizando una etiqueta `img`. Se recomienda probar en ambos campos, ya que no siempre es posible conocer el código exacto que se ejecuta en el servidor.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/owasp-zap-request-high.png)
</div>

Si el ataque tiene éxito, se consigue ejecutar el XSS.

<div style={{textAlign: 'center'}}>
    ![Input medio](/img/attacks/XSS/stored/attack-high.png)
</div>

Este proceso de retroalimentación y aprendizaje continuo es fundamental en el ámbito de la seguridad informática. Enfrentarse a desafíos y adaptarse a nuevas circunstancias permite fortalecer habilidades y desarrollar estrategias más efectivas para identificar y mitigar vulnerabilidades en aplicaciones web.
