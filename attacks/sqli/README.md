# SQL Injection

La inyección SQL es una técnica de ataque que explota vulnerabilidades en la validación de entradas de las aplicaciones para ejecutar código no autorizado en las bases de datos. Este ataque ocurre cuando los controles de seguridad son insuficientes o cuando las variables no son adecuadamente filtradas, y puede afectar a cualquier lenguaje de programación o script que interactúe con bases de datos.

La inyección SQL se produce cuando una persona atacante inserta código SQL a través de entradas no validadas. Por ejemplo, considere el parámetro "nombreUsuario" en una consulta SQL vulnerable:

```sql
SELECT * FROM usuarios WHERE nombre = '" + nombreUsuario + "';
```

Si el valor de "nombreUsuario" es simplemente "Alicia", la consulta funciona como se espera. Sin embargo, una persona atacante podría introducir un valor como:

```sql
Alicia'; DROP TABLE usuarios; SELECT * FROM datos WHERE nombre LIKE '%
```

Esto transformaría la consulta original en una secuencia de comandos no previstos:

```sql
SELECT * FROM usuarios WHERE nombre = 'Alicia'; DROP TABLE usuarios; SELECT * FROM datos WHERE nombre LIKE '%';
```

Este tipo de ataque puede provocar la exposición de información, la eliminación de tablas o la manipulación de datos.

Para prevenir la inyección SQL, es fundamental implementar consultas preparadas y una validación rigurosa de las entradas. Estas prácticas de programación segura son esenciales para proteger las bases de datos y mantener la integridad de los sistemas.
