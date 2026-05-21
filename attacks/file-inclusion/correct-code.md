# Código Correcto

Para evitar este tipo de ataques, es recomendable no cargar archivos a través de una URL proporcionada por la persona usuaria. En caso de que sea necesario permitir la inclusión de archivos, se debe validar que solo se puedan cargar archivos permitidos. Esto se puede lograr almacenando la lista de archivos válidos en un array y utilizando la función `in_array` para comprobar que la opción seleccionada es válida, o mediante una estructura condicional que verifique explícitamente cada caso permitido.
