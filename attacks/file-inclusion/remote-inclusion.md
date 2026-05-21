# RFI

## Bajo

En este caso, se intenta inyectar un archivo remoto. Como ejemplo, se utiliza Google. Sabiendo que la aplicación carga el contenido que se le pasa por parámetros, se introduce la URL completa para observar el resultado.

<div style={{textAlign: 'center'}}>
    ![Url para el ataque](/img/attacks/file-inclusion/RFI/attack-basic-url.png)
</div>

Como se puede ver, la página de Google se carga dentro de la aplicación.

<div style={{textAlign: 'center'}}>
    ![Ataque exitoso](/img/attacks/file-inclusion/RFI/attack-basic.png)
</div>

## Medio

Al cambiar de nivel y volver a probar el dominio de Google, el ataque deja de funcionar.

<div style={{textAlign: 'center'}}>
    ![Ataque fallido](/img/attacks/file-inclusion/RFI/attack-medium-fail.png)
</div>

Al revisar el código, se observa que se utiliza un `str_replace` similar al de LFI, que impide el uso de `http` o `https` en la entrada:

```php
// Input validation 
$file = str_replace( array( "http://", "https://" ), "", $file );
```

Sin embargo, como `str_replace` no es recursivo, es posible evadir esta restricción modificando la forma en que se escribe el protocolo:

```bash
htthttp://p://google.es
```

Esto elimina el primer `http://`, dejando el segundo, lo que permite que el ataque vuelva a funcionar.

<div style={{textAlign: 'center'}}>
    ![Ataque exitoso](/img/attacks/file-inclusion/RFI/attack-basic.png)
</div>

## Alto

En este nivel, no es posible realizar el ataque incluyendo una URL remota directamente. Por lo tanto, es necesario utilizar otra vulnerabilidad, como la subida de archivos, y posteriormente llamar al código desde ese archivo.
