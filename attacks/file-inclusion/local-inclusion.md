# LFI

## Bajo

Este tipo de ataque consiste en cargar archivos locales a través de la aplicación. Para realizar pruebas, se puede acceder a la URL principal y buscar archivos como `robots.txt`. Si existe, es necesario averiguar su ubicación, lo que se logra navegando por los directorios. Por ejemplo, utilizando el siguiente código:

```bash
../../robots.txt
```

Se puede observar que se carga el archivo con los permisos correspondientes.

<div style={{textAlign: 'center'}}>
    ![Ataque básico fichero robots](/img/attacks/file-inclusion/LFI/attack-basic-robots.png)
</div>

A continuación, se puede seguir explorando diferentes niveles de carpetas hasta llegar a información sensible, como el archivo `/etc/passwd`:

```bash
../../../../../etc/passwd
```

<div style={{textAlign: 'center'}}>
    ![Ataque básico fichero passwd](/img/attacks/file-inclusion/LFI/attack-basic-passwd.png)
</div>

## Medio

En el siguiente nivel, si se vuelve a probar la ruta de `robots.txt`, se observa que esta vez no funciona.

<div style={{textAlign: 'center'}}>
    ![Fallo ataque medio](/img/attacks/file-inclusion/LFI/attack-medium-fail.png)
</div>

Al revisar el código, se observa que se realiza una sustitución con `str_replace`, impidiendo el uso de `../` para moverse entre directorios:

```php
$file = str_replace( array( "../", "..\"" ), "", $file );
```

Sin embargo, como `str_replace` no es recursivo, es posible evadir esta restricción utilizando variantes como:

```bash
....//
```

Esto elimina el `../` pero deja el resto, permitiendo que el ataque funcione nuevamente.

<div style={{textAlign: 'center'}}>
    ![Ataque medio](/img/attacks/file-inclusion/LFI/attack-medium.png)
</div>

## Alto

En el nivel más alto, al intentar los ataques anteriores, no se obtiene el resultado esperado.

<div style={{textAlign: 'center'}}>
    ![Fallo ataque basico en nivel alto](/img/attacks/file-inclusion/LFI/attack-high-fail-basic.png)
</div>

<div style={{textAlign: 'center'}}>
    ![Fallo ataque medio en nivel alto](/img/attacks/file-inclusion/LFI/attack-high-fail-medium.png)
</div>

Al revisar el código, se observa la siguiente validación:

```php
if( !fnmatch( "file*", $file ) && $file != "include.php" ) {
    // This isn't the page we want!
    echo "ERROR: File not found!";
    exit;
}
```

Aquí se utiliza la función `fnmatch` para comprobar si la ruta contiene la palabra "file". Por lo tanto, se puede emplear el esquema `file://`, que da acceso al sistema de archivos local en PHP y cumple con la condición de contener "file":

```bash
file:///var/www/html/robots.txt
```

<div style={{textAlign: 'center'}}>
    ![Ataque alto robots](/img/attacks/file-inclusion/LFI/attack-high-robots.png)
</div>

```bash
file:///etc/passwd
```

<div style={{textAlign: 'center'}}>
    ![Ataque alto passwd](/img/attacks/file-inclusion/LFI/attack-high-passwd.png)
</div>
