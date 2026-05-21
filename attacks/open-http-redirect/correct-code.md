# Código Correcto

La forma adecuada y segura de implementar redirecciones HTTP es evitar que la persona usuaria controle directamente la URL de destino mediante parámetros no validados.

```php showLineNumbers
$target = "";

if (array_key_exists("redirect", $_GET) && is_numeric($_GET['redirect'])) {
    switch (intval($_GET['redirect'])) {
        case 1:
            $target = "info.php?id=1";
            break;
        case 2:
            $target = "info.php?id=2";
            break;
        case 99:
            $target = "https://digi.ninja";
            break;
    }
    if ($target != "") {
        header("Location: " . $target);
        exit;
    } else {
        ?>
        Unknown redirect target.
        <?php
        exit;
    }
}

?>
Missing redirect target.
```

En lugar de confiar directamente en la entrada proporcionada por la persona usuaria, el código implementa una lista fija (whitelist) de destinos permitidos. Esto se logra utilizando una estructura de control (`switch`) que limita los valores válidos del parámetro `redirect` a opciones específicas, conocidas y previamente definidas:

- Si el parámetro recibido coincide con alguna de las opciones válidas (por ejemplo, 1, 2 o 99), se asigna una URL objetivo predefinida.
- En caso contrario, no se produce ninguna redirección y se muestra un mensaje de error explícito ("Unknown redirect target" o "Missing redirect target").

Gracias a este mecanismo, incluso si se manipula el parámetro `redirect` intentando redirigir a un destino no autorizado, el sistema ignorará la entrada no válida, impidiendo intentos de redirección abierta.

Esta técnica de validación estricta (whitelisting) es una práctica recomendada para mitigar ataques de tipo Open HTTP Redirect.
