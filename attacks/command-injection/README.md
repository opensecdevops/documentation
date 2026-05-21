# Command Injection

El ataque de inyección de comandos, conocido como "Command Injection", representa una amenaza de seguridad relevante. Este tipo de vulnerabilidad permite que una persona atacante ejecute comandos no autorizados en el sistema operativo a través de una aplicación que no valida correctamente las entradas proporcionadas por el usuario. Esto puede comprometer la integridad y confidencialidad del sistema.

A continuación, se explica cómo esta técnica puede manifestarse en diferentes niveles de seguridad.

## Bajo

En este nivel, no existe validación ni filtrado de la entrada del usuario. Al acceder a la sección de command injection, se presenta un campo para realizar pings, donde se introduce una IP y se ejecuta el comando correspondiente.

<div style={{textAlign: 'center'}}>
    ![Uso normal input comandos](/img/attacks/command-injection/normal-use.png)
</div>

Si la aplicación no implementa medidas para validar las entradas, es posible concatenar comandos como en una terminal. A continuación, se muestran algunas combinaciones comunes de comandos y sus acciones:

| Comandos | Acción                                                                | Ejemplo                   |
| -------- | --------------------------------------------------------------------- | ------------------------- |
| \|       | La salida del primero es la entrada del segundo                       | cat xxx \| grep yyy       |
| \|\|     | El segundo comando se ejecuta si el primero termina sin éxito         | ping 18.2.2 \|\| cat xxxx |
| &        | Ejecuta dos o más comandos de manera simultánea                       | ls xxx & cat yyyy         |
| &&       | El segundo comando se ejecuta solo si el primero finaliza con éxito   | ping 8.8.8.8 && cat ggggg |
| ;        | El segundo comando se ejecuta sin importar el resultado del primero   | ls tttt; cat yyyy         |

Si no se validan correctamente estas combinaciones, pueden ser aprovechadas para ejecutar comandos no autorizados, ya que el código ejecuta directamente lo que introduce el usuario.

Esto permite probar diferentes combinaciones en el campo de entrada y, si se utilizan las anteriores, el ataque funcionará.

<div style={{textAlign: 'center'}}>
    ![Input Command ataque básico](/img/attacks/command-injection/attack-basic.png)
</div>

Como resultado, se listan los archivos, lo que demuestra el riesgo de ejecutar comandos arbitrarios en el sistema.

## Medio

En este nivel, al probar el mismo comando que funcionó en el nivel anterior, no se obtiene el mismo resultado.

<div style={{textAlign: 'center'}}>
    ![Input Command Injection ataque Medio](/img/attacks/command-injection/attack-medium.png)
</div>

Aquí, el código de la aplicación filtra las opciones `&&` y `;`:

```php
    $substitutions = array( '&&' => '', ';'  => '', );
```

Dado que estas opciones están bloqueadas, es necesario explorar otras alternativas. Por ejemplo, ejecutar comandos en paralelo puede permitir que la inyección tenga éxito nuevamente.

Esto resalta la importancia de implementar múltiples capas de seguridad y no depender únicamente de la filtración de ciertos caracteres. Es recomendable utilizar validación estricta de entradas, listas blancas en lugar de listas negras y mecanismos de control de acceso adecuados.

<div style={{textAlign: 'center'}}>
    ![Input Command Injection otro ataque Medio](/img/attacks/command-injection/other-attack-medium.png)
</div>

## Alto

En el nivel alto de seguridad, al probar todas las combinaciones anteriores, no se obtiene un resultado válido.

<div style={{textAlign: 'center'}}>
    ![Input Command Injection ataque Alto fallido](/img/attacks/command-injection/attack-high-fail.png)
</div>

En este caso, el código utiliza una lista negra más amplia:

```php
    $substitutions = array( '&'  => '', ';'  => '', '| ' => '', '-'  => '', '$'  => '', '('  => '', ')'  => '', '`'  => '', '||' => '', );
```

Sin embargo, el operador `|` tiene un espacio después de él en la lista negra. Esto permite intentar ejecutar el comando sin espacio después del operador, lo que puede evadir la restricción y lograr la inyección.

<div style={{textAlign: 'center'}}>
    ![Input Command Injection ataque Alto](/img/attacks/command-injection/attack-high.png)
</div>

En resumen, la inyección de comandos del sistema operativo es una técnica que puede permitir la ejecución de comandos arbitrarios en un servidor web. Para prevenir este tipo de ataques, es importante aplicar buenas prácticas de programación, como la validación adecuada de las entradas del usuario y el uso de listas blancas para filtrar comandos y caracteres no deseados.
