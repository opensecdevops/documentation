# Código correcto

Para protegerse frente a ataques CSRF, es recomendable implementar un sistema con las siguientes características:

- Generar un token CSRF único para cada solicitud de formulario.
- Almacenar el token en la sesión y en una cookie con el flag HttpOnly.
- Validar el token y la URL de origen en cada solicitud POST.
- Regenerar el token después de cada solicitud exitosa.

## Generación del token CSRF

Se genera un token CSRF único y se configura como una cookie HttpOnly con una vida útil de 30 minutos.

```php
session_start();

function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        setcookie('X-XSRF-TOKEN', $token, time() + 1800, '/', '', true, true); // 30 minutos de vida, HttpOnly
    }
}

generateCSRFToken();
```

## Verificación del token CSRF y del origen de la solicitud en el servidor

Se verifica que el token CSRF enviado en la cookie coincida con el token almacenado en la sesión y que la solicitud provenga del mismo dominio.

```php
session_start();

function verifyCSRFToken() {
    if (!isset($_SESSION['csrf_token']) || !isset($_COOKIE['X-XSRF-TOKEN']) || $_COOKIE['X-XSRF-TOKEN'] !== $_SESSION['csrf_token']) {
        throw new Exception("Token CSRF no válido");
    }
}

function validateRequestOrigin() {
    if (!isset($_SERVER['HTTP_ORIGIN']) && !isset($_SERVER['HTTP_REFERER'])) {
        throw new Exception("Origen de la solicitud no válido");
    }
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_REFERER'];
    $parsed_url = parse_url($origin);
    if ($parsed_url['host'] !== 'tu-dominio.com') {
        throw new Exception("Origen de la solicitud no válido");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        validateRequestOrigin();
        verifyCSRFToken();
        // Regenerar el token para la siguiente solicitud
        generateCSRFToken();
        // Procesar el formulario
        echo "Formulario procesado correctamente.";
    } catch (Exception $e) {
        // Manejar el error
        echo $e->getMessage();
    }
}
```
