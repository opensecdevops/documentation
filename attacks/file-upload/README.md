# File Upload

La carga de archivos representa un riesgo significativo para las aplicaciones. Es una de las vías más comunes para introducir código no autorizado en un sistema. Una vez que se logra cargar un archivo, el siguiente paso para un atacante suele ser encontrar la forma de ejecutarlo. Por este motivo, la gestión adecuada de la carga de archivos es fundamental para la seguridad de cualquier aplicación.

Las consecuencias de permitir la carga de archivos sin restricciones pueden ser diversas, incluyendo la toma de control del sistema, sobrecarga del sistema de archivos o base de datos, reenvío de ataques a sistemas en segundo plano, ataques del lado del cliente o modificaciones no autorizadas. Estas consecuencias dependen de cómo la aplicación maneje el archivo cargado y, especialmente, de dónde lo almacene.

Existen dos tipos principales de problemas asociados con la carga de archivos. El primero se refiere a los metadatos del archivo, como la ruta y el nombre, que son proporcionados por el transporte (por ejemplo, la codificación HTTP multipart). Si no se validan adecuadamente, pueden permitir sobrescribir archivos críticos o almacenar archivos en ubicaciones no previstas.

El segundo tipo de problema está relacionado con el tamaño o contenido del archivo. Los riesgos asociados dependen de cómo la aplicación utilice el archivo. Es importante analizar todo el proceso de manejo de archivos y considerar qué procesos e intérpretes están involucrados para protegerse frente a este tipo de ataques.

## Ataques en la plataforma de aplicaciones

1. **Subir archivo .gif para cambiar de tamaño:** Puede explotar vulnerabilidades en bibliotecas de procesamiento de imágenes.
2. **Cargar archivo .jsp en el árbol web:** El código JSP se ejecuta con los permisos del usuario web.
3. **Subir archivos de gran tamaño:** Puede provocar una denegación de servicio por falta de espacio en disco.
4. **Cargar archivo usando una ruta o nombre malicioso:** Puede sobrescribir archivos críticos en el sistema.
5. **Subir archivo que contiene datos personales:** Puede exponer información sensible a otros usuarios.
6. **Subir archivo que contiene "etiquetas":** Puede ejecutarse como parte de la inclusión en una página web.
7. **Cargar archivo .rar para ser analizado por antivirus:** Puede ejecutar comandos en un servidor con software antivirus vulnerable.

## Ataques en otros sistemas

1. **Cargar archivo .exe en el árbol web:** Las personas usuarias pueden descargar el ejecutable y comprometer sus sistemas.
2. **Subir archivo infectado con malware:** Puede infectar los sistemas de quienes descarguen el archivo.
3. **Cargar archivo .html con scripts:** Puede provocar ataques de Cross-site Scripting (XSS).
4. **Cargar archivo .jpg que contiene un objeto Flash:** Puede facilitar el secuestro de contenido entre sitios.
5. **Cargar archivo .rar para ser analizado por antivirus:** Puede ejecutar comandos en un cliente con software antivirus vulnerable.

El ejemplo proporcionado muestra diferentes niveles de seguridad (bajo, medio y alto) y cómo se pueden explotar las vulnerabilidades en cada nivel al cargar archivos no autorizados. En cada caso, se utilizan diversas técnicas, como el uso de OWASP ZAP, la concatenación de archivos y la manipulación de números mágicos, para eludir las restricciones de carga y ejecutar código en el sistema objetivo.

## Bajo

En este nivel de seguridad, al acceder a la sección correspondiente, se presenta un campo para cargar archivos. Se puede aprovechar esta funcionalidad para realizar pruebas de carga de archivos no autorizados.

<div style={{textAlign: 'center'}}>
    ![Uso normal input](/img/attacks/file-upload/file-upload-low-input.png)
</div>

Se crea una shell con un mensaje simple, diseñada para demostrar la capacidad de carga y ejecución de archivos en el sistema.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Shell DVWA</title>
</head>
<body>
    <h1>Shell low</h1>
</body>
</html>
```

Al subir el archivo, se verifica que la carga se realiza correctamente.

<div style={{textAlign: 'center'}}>
    ![Subida correcta fichero bajo](/img/attacks/file-upload/file-upload-low-correct-upload.png)
    Subida correcta
</div>

Después de la carga, se accede a la ruta del archivo y se confirma que la ejecución es exitosa. Esto demuestra una vulnerabilidad importante, ya que permite la ejecución de código no autorizado.

<div style={{textAlign: 'center'}}>
    ![Ejecucion Shell bajo](/img/attacks/file-upload/file-upload-low-shell.png)
    Shell nivel bajo
</div>

En resumen, en este nivel bajo, es posible cargar y ejecutar archivos no autorizados, lo que resalta la importancia de implementar controles de seguridad en la carga de archivos.

## Medio

En este nivel intermedio, al intentar subir la misma shell, se observa que la carga no se completa.

<div style={{textAlign: 'center'}}>
    ![Error subida archivo Medio](/img/attacks/file-upload/file-upload-medium-fail-upload.png)
</div>

Al revisar el código de la aplicación, se comprueba que se realiza una verificación del tipo de contenido del archivo para asegurarse de que sea una imagen JPEG o PNG y que su tamaño sea inferior a 100,000 bytes.

```php
// Is it an image?
if( ( $uploaded_type == "image/jpeg" || $uploaded_type == "image/png" ) &&
    ( $uploaded_size < 100000 ) ) {
```

Se puede utilizar OWASP ZAP para modificar el content-type del archivo y eludir la restricción.

<div style={{textAlign: 'center'}}>
    ![Codigo web Medio](/img/attacks/file-upload/file-upload-medium-code.png)
</div>

En OWASP ZAP, se identifica que el content-type es `application/octet-stream`. Se modifica este valor por uno permitido, como `image/jpeg` o `image/png`.

<div style={{textAlign: 'center'}}>
    ![Codigo modificado OWASP ZAP](/img/attacks/file-upload/file-upload-medium-code-modify-content-type.png)
</div>

Tras este ajuste, se completa la carga y se verifica que la shell se ejecuta correctamente, lo que indica una vulnerabilidad en el sistema de carga de archivos.

<div style={{textAlign: 'center'}}>
    ![Subida correcta fichero Medio](/img/attacks/file-upload/file-upload-medium-correct-upload.png)
    Subida correcta
</div>

<div style={{textAlign: 'center'}}>
    ![Ejecucion Shell Medio](/img/attacks/file-upload/file-upload-medium-shell.png)
    Shell media
</div>

En resumen, en este nivel intermedio, se logra eludir la restricción del content-type y cargar la shell, lo que evidencia la necesidad de controles adicionales.

## Alto

En este nivel, al repetir el proceso anterior, no es posible subir la shell.

<div style={{textAlign: 'center'}}>
    ![Error subida archivo Alto](/img/attacks/file-upload/file-upload-high-fail-upload.png)
</div>

El código de la aplicación verifica la extensión del archivo y utiliza la función `getimagesize` para comprobar que el archivo es una imagen válida.

```php
if( ( strtolower( $uploaded_ext ) == "jpg" || strtolower( $uploaded_ext ) == "jpeg" || 
strtolower( $uploaded_ext ) == "png" ) && ( $uploaded_size < 100000 ) && getimagesize( $uploaded_tmp ) ) {
```

Por lo tanto, solo se pueden subir archivos que sean reconocidos como imágenes.

Dadas estas restricciones, se pueden emplear dos técnicas para intentar cargar la shell:

1. **Concatenar una imagen y una shell usando `cat`:**  
   Se crea una imagen de un píxel o se utiliza cualquier imagen disponible, y se concatena con la shell mediante el siguiente comando:

   ```bash
   cat shellimagebase.png shell.php > shellfinal.png
   ```

   Esto genera una imagen que contiene la shell, la cual se sube al sistema.

   <div style={{textAlign: 'center'}}>
       ![Subida correcta archivo cat Alto](/img/attacks/file-upload/file-upload-high-correct-upload.png)
   </div>

   Al acceder a la imagen, se visualiza correctamente.

   <div style={{textAlign: 'center'}}>
       ![Imagen subida visible](/img/attacks/file-upload/file-upload-high-image-created.png)
   </div>

   Sin embargo, para ejecutar el código de la shell, es necesario combinar este ataque con File Inclusion. Al incluir el archivo, la imagen no se muestra, pero el código de la shell se ejecuta.

   <div style={{textAlign: 'center'}}>
       ![Ejecucion Shell File Inclusion Alto](/img/attacks/file-upload/file-upload-high-file-inclusion-shell.png)
       Shell alta mediante cat y File Inclusion
   </div>

2. **Modificar el "magic number" del archivo:**  
   Se agrega el código hexadecimal correspondiente a los archivos PNG al inicio de la shell. Se puede utilizar un editor hexadecimal como [hexed.it](https://hexed.it/).

   <div style={{textAlign: 'center'}}>
       ![Editor hexadecimal codigo Shell](/img/attacks/file-upload/file-upload-magic-number-hexadecimal.png)
   </div>

   El "magic number" para archivos PNG es:

   ```hex
   89 50 4E 47 0D 0A 1A 0A
   ```

   Se inserta este valor al inicio del archivo de la shell.

   <div style={{textAlign: 'center'}}>
       ![Insert codigo png en Shell](/img/attacks/file-upload/file-upload-magic-number-insert-shell.png)
   </div>

   El archivo resultante tendrá el encabezado de un PNG.

   <div style={{textAlign: 'center'}}>
       ![Editor hexadecimal codigo Shell modificado](/img/attacks/file-upload/file-upload-magic-number-hexadecimal-shell.png)
   </div>

   Tras modificar el archivo, se sube al sistema.

   <div style={{textAlign: 'center'}}>
       ![Subida correcta archivo magic number Alto](/img/attacks/file-upload/file-upload-magic-number-correct-upload.png)
       Subida correcta
   </div>

   En este caso, la imagen no se carga visualmente, ya que solo está presente la cabecera para que el sistema la reconozca como imagen.

   <div style={{textAlign: 'center'}}>
       ![Shell subida pero no visible](/img/attacks/file-upload/file-upload-magic-number-no-visible-shell.png)
       Shell subida pero no visible
   </div>

   Sin embargo, si se incluye el archivo mediante File Inclusion, la shell se ejecuta correctamente, lo que demuestra la eficacia de combinar técnicas de evasión con otras vulnerabilidades.

   <div style={{textAlign: 'center'}}>
       ![Ejecucion Shell File Inclusion Alto](/img/attacks/file-upload/file-upload-magic-number-file-inclusion-shell.png)
       Shell cargada mediante File Inclusion
   </div>
