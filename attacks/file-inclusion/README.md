# File Inclusion

Una vulnerabilidad de inclusión de archivos (File Inclusion) es un tipo de vulnerabilidad que afecta principalmente a aplicaciones web que dependen de un motor de ejecución de scripts.

Este problema ocurre cuando una aplicación construye una ruta de acceso a código ejecutable utilizando una variable controlada por la persona usuaria, lo que puede permitir que se ejecute un archivo no previsto en tiempo de ejecución.

Existen dos tipos principales de ataques asociados a esta vulnerabilidad:

- **Local File Inclusion (LFI):** Permite cargar archivos locales presentes en el servidor.
- **Remote File Inclusion (RFI):** Permite cargar archivos de manera remota, desde ubicaciones externas al servidor.

Al acceder a la sección correspondiente, se muestra una lista de archivos disponibles para su inclusión.

<div style={{textAlign: 'center'}}>
    ![Listado de ficheros para la inclusión](/img/attacks/file-inclusion/file-inclusion.png)
</div>

Al hacer clic sobre uno de estos archivos, su contenido se carga y se ejecuta el código correspondiente.

<div style={{textAlign: 'center'}}>
    ![Fichero cargado](/img/attacks/file-inclusion/load-file-inclusion.png)
</div>

Si se observa la URL, se puede ver que contiene el nombre del archivo seleccionado.

<div style={{textAlign: 'center'}}>
    ![Url archivo incluye](/img/attacks/file-inclusion/url-file-inclusion.png)
</div>
