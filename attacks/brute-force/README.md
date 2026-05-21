# Fuerza Bruta

El ataque de fuerza bruta es un método utilizado para descifrar contraseñas, claves de cifrado o acceder a sistemas vulnerables probando exhaustivamente todas las combinaciones posibles hasta encontrar la correcta. Este ataque se basa en la simplicidad de intentar todas las opciones sin utilizar atajos ni heurísticas.

- **Prueba exhaustiva de combinaciones:** Se utiliza software para probar todas las combinaciones posibles de caracteres hasta encontrar la contraseña correcta. Este método garantiza el éxito si se dispone de tiempo suficiente y recursos computacionales.
- **Ataques de diccionario:** Utilizan listas predefinidas de palabras comunes y frases potenciales que suelen emplearse como contraseñas. Este enfoque es más rápido que probar todas las combinaciones posibles, pero menos exhaustivo.
- **Automatización:** Se emplean herramientas y scripts que automatizan el proceso de prueba, permitiendo realizar millones de intentos por segundo, lo que acelera significativamente el tiempo de descifrado.

## Bajo

En el nivel inicial, se presenta un formulario de inicio de sesión. Al probar con un usuario y contraseña cualquiera, se observa que la información se envía mediante una petición GET.

<div style={{textAlign: 'center'}}>
    ![Formulario de Login](/img/attacks/brute-force/form-login.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Url básica](/img/attacks/brute-force/basic-url.png)
</div>

Para interceptar peticiones mediante OWASP ZAP y aplicar fuerza bruta, se debe abrir el navegador controlado desde OWASP ZAP haciendo clic en el icono correspondiente, como se muestra en la imagen resaltada en rojo.

Desde el navegador abierto, se accede a la web que se desea interceptar y se activa la intercepción haciendo clic en el icono verde, resaltado en azul en la imagen.

<div style={{textAlign: 'center'}}>
    ![iconos OWASP ZAP](/img/attacks/brute-force/owasp-zap-icons.png)
</div>

Una vez en la URL deseada, se envía la petición al Fuzzer para automatizar el proceso de fuerza bruta.

<div style={{textAlign: 'center'}}>
    ![Enviar petición al Fuzzer](/img/attacks/brute-force/send-requests-to-fuzzing.png)
</div>

Esto abre una ventana donde se debe seleccionar la parte de la petición a fuzzear.

<div style={{textAlign: 'center'}}>
    ![Configuración Fuzzer](/img/attacks/brute-force/fuzzer-basic-configuration.png)
</div>

Se selecciona la parte de la petición a fuzzear y se hace clic en `Add`, lo que abre la ventana de configuración del payload. Se puede agregar un nuevo payload y cargar un diccionario con usuarios y contraseñas.

<div style={{textAlign: 'center'}}>
    ![Configurar payload usuarios](/img/attacks/brute-force/config-payloads-user.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Agregar payload usuarios](/img/attacks/brute-force/add-payload-users.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Agregar payload contraseñas](/img/attacks/brute-force/add-payload-password.png)
</div>

Una vez configurado el ataque, se inicia el Fuzzer. En la parte inferior de OWASP ZAP aparecerá una pestaña con el progreso del ataque.

<div style={{textAlign: 'center'}}>
    ![Resultados ataque](/img/attacks/brute-force/basic-attack-result.png)
</div>

Al finalizar, se debe observar la columna `Size Resp. Body` y buscar cuál es diferente en tamaño; esa será la contraseña correcta.

<div style={{textAlign: 'center'}}>
    ![Tamaño respuesta](/img/attacks/brute-force/size-response.png)
</div>

Las respuestas repetidas mostrarán el mensaje habitual de error en el formulario.

<div style={{textAlign: 'center'}}>
    ![Tamaño respuesta](/img/attacks/brute-force/basic-attack-fail.png)
</div>

Si se revisa la respuesta con un tamaño diferente, se observará que el contenido ha cambiado.

<div style={{textAlign: 'center'}}>
    ![Tamaño respuesta](/img/attacks/brute-force/basic-attack-success.png)
</div>

Finalmente, se puede probar el usuario y contraseña para acceder a la página protegida.

<div style={{textAlign: 'center'}}>
    ![Área protegida](/img/attacks/brute-force/protected-area.png)
</div>

## Medio

En el nivel medio, el funcionamiento es similar al nivel bajo. Sin embargo, al revisar el código, se observa que se añade un `sleep(2)` en caso de fallo de usuario o contraseña, lo que ralentiza el proceso de fuerza bruta.

```php
<?php

if( isset( $_GET[ 'Login' ] ) ) {
    // Sanitise username input
    $user = $_GET[ 'username' ];
    $user = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $user ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Sanitise password input
    $pass = $_GET[ 'password' ];
    $pass = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = md5( $pass );

    // Check the database
    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    if( $result && mysqli_num_rows( $result ) == 1 ) {
        // Get users details
        $row    = mysqli_fetch_assoc( $result );
        $avatar = $row["avatar"];

        // Login successful
        echo "<p>Welcome to the password protected area {$user}</p>";
        echo "<img src=\"{$avatar}\" />";
    }
    else {
        // Login failed
        sleep( 2 );
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

La diferencia principal es la ralentización del proceso de fuerza bruta debido al retardo introducido.

<div style={{textAlign: 'center'}}>
    ![Ataque medio](/img/attacks/brute-force/attack-medium.png)
</div>

## Alto

En este nivel, al probar un usuario y contraseña, se observa que la URL contiene un token para evitar ataques CSRF.

<div style={{textAlign: 'center'}}>
    ![Url nivel alto](/img/attacks/brute-force/high-url.png)
</div>

OWASP ZAP dispone de un sistema para detectar tokens CSRF y gestionarlos, pero en este caso solo es válido para parámetros de tipo FORM y no para tokens en la URL.

<div style={{textAlign: 'center'}}>
    ![Anti CSRF](/img/attacks/brute-force/config-anti-csrf.png)
</div>

Para solucionar esto, se puede utilizar la funcionalidad de scripting de OWASP ZAP y adaptar un script de la comunidad para gestionar el token CSRF en la URL, como se describe en el [FAQ de OWASP ZAP](https://www.zaproxy.org/faq/details/setting-up-zap-to-test-dvwa/).

Primero, se debe abrir el gestor de scripts en la barra lateral.

<div style={{textAlign: 'center'}}>
    ![Abrir scripts](/img/attacks/brute-force/icon-open-scripts.png)
</div>

En la sección de Fuzzer HTTP Processor, se crea un nuevo script seleccionando `New Script...`.

<div style={{textAlign: 'center'}}>
    ![Abrir scripts](/img/attacks/brute-force/new-script.png)
</div>

Al crearlo, se genera un esqueleto inicial para el script.

A continuación, se reemplaza el contenido por el siguiente código, que permite actualizar el token CSRF dinámicamente en cada petición:

```js
// Auxiliary variables/constants needed for processing.
var count = 1;

/**
 * Processes the fuzzed message (payloads already injected).
 * 
 * Called before forwarding the message to the server.
 * 
 * @param {HttpFuzzerTaskProcessorUtils} utils - A utility object that contains functions that ease common tasks.
 * @param {HttpMessage} message - The fuzzed message, that will be forward to the server.
 */
function processMessage(utils, message) {
 // To obtain the list of payloads:
 //    utils.getPayloads()
 // To obtain original message:
 //    utils.getOriginalMessage()
 // To stop fuzzer:
 //    utils.stopFuzzer()
 // To increases the error count with a reason:
 //    utils.increaseErrorCount("Reason Error Message...")
 // To send a message, following redirects:
 //    utils.sendMessage(myMessage)
 // To send a message, not following redirects:
 //    utils.sendMessage(myMessage, false)
 // To add a message previously sent to results:
 //    utils.addMessageToResults("Type Of Message", myMessage)
 // To add a message previously sent to results, with custom state:
 //    utils.addMessageToResults("Type Of Message", myMessage, "Key Custom State", "Value Custom State")
 // The states' value is shown in the column 'State' of fuzzer results tab
 // To get the values of the parameters configured in the Add Message Processor Dialog.
 //    utils.getParameters() 
 // A map is returned, having as keys the parameters names (as returned by the getRequiredParamsNames()
 // and getOptionalParamsNames() functions below)
 // To get the value of a specific configured script parameter
 //    utils.getParameters().get("exampleParam1")

 // Process fuzzed message...
 message.getRequestHeader().setHeader("X-Unique-Id", count);
 count++;
}

/**
 * Processes the fuzz result.
 * 
 * Called after receiving the fuzzed message from the server.
 * 
 * @param {HttpFuzzerTaskProcessorUtils} utils - A utility object that contains functions that ease common tasks.
 * @param {HttpFuzzResult} fuzzResult - The result of sending the fuzzed message.
 * @return {boolean} Whether the result should be accepted, or discarded and not shown.
 */
function processResult(utils, fuzzResult){
 // All the above 'utils' functions are available plus:
 // To raise an alert:
 //    utils.raiseAlert(risk, confidence, name, description)
 // To obtain the fuzzed message, received from the server:
 //    fuzzResult.getHttpMessage()
 // To get the values of the parameters configured in the Add Message Processor Dialog.
 //    utils.getParameters() 
 // A map is returned, having as keys the parameters names (as returned by the getRequiredParamsNames()
 // and getOptionalParamsNames() functions below)
 // To get the value of a specific configured script parameter
 //    utils.getParameters().get("exampleParam1")

 var condition = true;
 if (condition)
  fuzzResult.addCustomState("Key Custom State", "Message Contains X")
 
 return true;
}


/**
 * This function is called during the script loading to obtain a list of the names of the required configuration parameters,
 * that will be shown in the Add Message Processor Dialog for configuration. They can be used
 * to input dynamic data into the script, from the user interface
*/
function getRequiredParamsNames(){
 return ["exampleParam1", "exampleParam2"];
}

/**
 * This function is called during the script loading to obtain a list of the names of the optional configuration parameters,
 * that will be shown in the Add Message Processor Dialog for configuration. They can be used
 * to input dynamic data into the script, from the user interface
*/
function getOptionalParamsNames(){
 return ["exampleParam3"];
}
```

Una vez cargado el script, se configura antes de lanzar el ataque, siguiendo los pasos habituales para definir los payloads.

<div style={{textAlign: 'center'}}>
    ![Configurar message processor](/img/attacks/brute-force/message-processors-fuzzer.png)
</div>

Al lanzar el ataque, el script se encarga de recuperar el token y enviarlo en cada petición, permitiendo realizar el ataque de fuerza bruta incluso con protección CSRF.

<div style={{textAlign: 'center'}}>
    ![Ataque alto](/img/attacks/brute-force/attack-high.png)
</div>
