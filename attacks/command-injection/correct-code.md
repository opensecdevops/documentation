# Código Correcto

Es recomendable reservar la ejecución de comandos a nivel de sistema como último recurso durante el desarrollo de aplicaciones. En caso de ser necesario, es fundamental extremar las precauciones con los parámetros que se pasan a estos comandos. Esto implica filtrar exhaustivamente toda entrada de datos y verificar su validez, especialmente cuando provienen de fuentes externas.

Por ejemplo, en el código que maneja el ping en el nivel de seguridad más alto, se adopta un enfoque preventivo. Primero, se descompone la dirección IP proporcionada en sus componentes individuales (octetos). Luego, se verifica cada uno de estos octetos por separado para asegurarse de que contengan únicamente valores numéricos. Finalmente, se reensambla la dirección IP. Este proceso garantiza que la dirección IP utilizada sea válida antes de proceder con cualquier operación adicional.

Este enfoque riguroso de verificación de datos es esencial para mantener la integridad y seguridad de las aplicaciones, especialmente en entornos donde la ejecución de comandos del sistema operativo es necesaria. Al seguir estas buenas prácticas de desarrollo seguro, se reduce significativamente el riesgo de vulnerabilidades y se mejora la robustez del sistema frente a posibles ataques.

A continuación se muestra un ejemplo de código que implementa esta validación:

```php
$target = stripslashes($target);

// Dividir la IP en 4 octetos
$octets = explode(".", $target);

// Verificar si cada octeto es un número entero y si hay exactamente 4 octetos
if (count($octets) == 4 && ctype_digit($octets[0]) && ctype_digit($octets[1]) && ctype_digit($octets[2]) && ctype_digit($octets[3])) {
    // Si los 4 octetos son enteros, vuelva a armar la IP.
    $target = implode('.', $octets);
} else {
    // Si la IP no es válida, manejar el error o tomar medidas apropiadas.
    // Por ejemplo, registrar el intento de ataque o mostrar un mensaje de error.
    die("Dirección IP no válida.");
}
```
