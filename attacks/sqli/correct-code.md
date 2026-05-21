# Código correcto

Utilizar PDO (PHP Data Objects) es una práctica recomendada para prevenir inyecciones SQL en PHP, ya que permite el uso de consultas preparadas (*prepared statements*). Este método separa los datos de las instrucciones SQL, evitando que se ejecute código no autorizado. A continuación se describen las principales recomendaciones para utilizar PDO de forma segura en aplicaciones PHP:

## Conexión a la Base de Datos con PDO

Para establecer una conexión segura con la base de datos usando PDO, se recomienda manejar excepciones para detectar errores de conexión de manera efectiva.

```php
<?php
$servername = "localhost";
$username = "usuario";
$password = "contraseña";
$dbname = "base_de_datos";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Establece el modo de error a excepción para capturar y manejar errores adecuadamente
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

## Consultas seguras utilizando Prepared Statements

Los *prepared statements* aseguran que los datos proporcionados por las personas usuarias no se evalúen como código SQL, evitando así la ejecución de inyecciones SQL.

### Consultar datos

```php
<?php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
$email = 'user@example.com';
$password = 'user_password';
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
?>
```

### Insertar datos

```php
<?php
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
$username = 'nuevo_usuario';
$email = 'nuevo@example.com';
$password = 'nueva_contraseña';
$stmt->bindParam(':username', $username);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->execute();
?>
```

### Actualizar datos

```php
<?php
$stmt = $conn->prepare("UPDATE users SET email = :email, password = :password WHERE id = :id");
$email = 'actualizado@example.com';
$password = 'contraseña_actualizada';
$id = 1;
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);
$stmt->bindParam(':id', $id);
$stmt->execute();
?>
```

### Eliminar datos

```php
<?php
$stmt = $conn->prepare("DELETE FROM users WHERE id = :id");
$id = 2;
$stmt->bindParam(':id', $id);
$stmt->execute();
?>
```

## Buenas prácticas y consideraciones adicionales

- **Validación de datos:** Además de usar consultas preparadas, valida y sanea los datos de entrada para reforzar la seguridad.
- **Gestión de contraseñas:** Para almacenar contraseñas, utiliza funciones de hashing seguras como `password_hash()` y `password_verify()` en PHP.
- **Configuración segura:** Revisa la configuración de PHP y la base de datos para minimizar riesgos adicionales.
- **Actualización continua:** Mantente al día con las mejores prácticas y vulnerabilidades siguiendo recursos como OWASP.

Implementar estas medidas contribuye a mejorar la seguridad y robustez de las aplicaciones.
