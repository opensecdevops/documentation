# Open HTTP Redirect

El ataque de Open HTTP Redirect ocurre cuando una aplicación web redirige a los usuarios hacia una URL arbitraria proporcionada por la persona atacante. Este tipo de vulnerabilidad surge debido a una validación insuficiente o inexistente de los parámetros que controlan las redirecciones HTTP.

Este tipo de vulnerabilidad puede ser aprovechado para llevar a cabo ataques de phishing, ya que permite engañar a las personas usuarias para que visiten sitios no deseados bajo la apariencia de enlaces legítimos.

En una vulnerabilidad Open HTTP Redirect típica, la aplicación recibe un parámetro de URL para definir la dirección de destino después de una acción, como un inicio de sesión o una operación exitosa. Por ejemplo:

```bash
https://example.com/login?redirect=http://malicious-site.com
```

Si la aplicación no valida correctamente el parámetro `redirect`, la persona usuaria será redirigida directamente al sitio proporcionado.

## Bajo

En este nivel de seguridad, al ingresar en la sección correspondiente, se encuentran dos enlaces que dirigen hacia otra parte de la web.

<div style={{textAlign: 'center'}}>
    ![Links](/img/attacks/open-http-redirect/open-http-redirect-low-links.png)
</div>

Al analizar el código de los enlaces, se observa que se realiza una redirección al fichero `info.php` con un parámetro `id=1`:

```html
<a href="source/low.php?redirect=info.php?id=1">Quote 1</a>
```

Si se modifica el enlace utilizando otra dirección, como la de OSDO, el enlace llevará al sitio web de OSDO en lugar de cargar la página prevista por la aplicación:

```html
<a href="source/low.php?redirect=http://opensecdevops.com">Quote 1</a>
```

## Medio

En este nivel de seguridad, si se intenta nuevamente el ataque realizado en el nivel bajo, se obtiene un mensaje indicando que no se pueden usar URLs absolutas.

<div style={{textAlign: 'center'}}>
    ![Ataque bajo en nivel medio](/img/attacks/open-http-redirect/open-http-redirect-medium-low-attack.png)
</div>

Al revisar el código fuente, se comprueba que la aplicación verifica explícitamente que la URL proporcionada no sea absoluta:

```php showLineNumbers
<?php

if (array_key_exists ("redirect", $_GET) && $_GET['redirect'] != "") {
 if (preg_match ("/http:\/\/|https:\/\//i", $_GET['redirect'])) {
  http_response_code (500);
  ?>
  <p>Absolute URLs not allowed.</p>
  <?php
  exit;
 } else {
  header ("location: " . $_GET['redirect']);
  exit;
 }
}

http_response_code (500);
?>
<p>Missing redirect target.</p>
<?php
exit;
?>
```

Gracias a esta comprobación, se puede probar utilizando una [URL relativa al protocolo](https://en.wikipedia.org/wiki/Wikipedia:Protocol-relative_URL). Modificando el enlace de la siguiente forma, se consigue realizar la redirección:

```html
<a href="source/medium.php?redirect=//opensecdevops.com">Quote 1</a>
```

## Alto

En este nivel, al intentar cualquiera de los ataques anteriores, aparece un mensaje de error indicando que únicamente se puede redirigir hacia la página info.

<div style={{textAlign: 'center'}}>
    ![Ataque medio en nivel alto](/img/attacks/open-http-redirect/open-http-redirect-high-medium-attack.png)
</div>

Al analizar el código de la aplicación, se observa que realiza una comprobación buscando explícitamente la cadena `info.php` en la URL proporcionada:

```php showLineNumbers
<?php

if (array_key_exists ("redirect", $_GET) && $_GET['redirect'] != "") {
 if (strpos($_GET['redirect'], "info.php") !== false) {
  header ("location: " . $_GET['redirect']);
  exit;
 } else {
  http_response_code (500);
  ?>
  <p>You can only redirect to the info page.</p>
  <?php
  exit;
 }
}

http_response_code (500);
?>
<p>Missing redirect target.</p>
<?php
exit;
?>
```

Dado que los enlaces utilizan el archivo `info.php`, se puede pasar como parámetro "válido" a otro dominio para evadir esta restricción:

```html
<a href="source/high.php?redirect=//opensecdevops.com?info.php=1">Quote 1</a>
```
