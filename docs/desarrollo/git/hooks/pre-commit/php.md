---
title: PHP
---

# PHP

Aprovechando los hooks de Git, vamos a realizar análisis de seguridad y comprobaciones de estilo en nuestra aplicación antes de subirla al repositorio para minimizar los riesgos. Para lograrlo, vamos a configurar el archivo pre-commit con el siguiente script en Bash, que buscará contraseñas, realizará un análisis estático de seguridad (SAST), ejecutará un linter de código y lanzará los Test. Sólo si ninguna de estas comprobaciones arroja errores se permitirá realizar el commit.

```bash
#!/bin/bash

# Ruta al ejecutable de Gitleaks
docker run --rm -v $(pwd):/code zricethezav/gitleaks detect --source=/code -v

# Comprueba el código de salida de Gitleaks
if [ $? -ne 0 ]; then
    echo "Se detectaron posibles fugas de contraseñas. Por favor, corrige los problemas antes de confirmar."
    exit 1
fi


# Ejecutar el linter (ejemplo: PHP_CodeSniffer)
# Asegúrate de que el linter esté instalado en tu sistema
# Reemplaza 'phpcs' con el comando adecuado para tu linter
docker run --rm -v "$(pwd):/app"  osdo/php-pre-commit:8.1 /bin/sh -c "phpcs --standard=phpcs.xml --extensions=php"

# Comprobar el código de salida del linter
if [ $? -ne 0 ]; then
   echo "Se encontraron problemas de estilo de código. Por favor, corrige los problemas antes de confirmar."
   exit 1
fi

# Ejecutar análisis estático de seguridad (SAST) (ejemplo: PHPStan)
# Asegúrate de que la herramienta SAST esté instalada en tu sistema
# Reemplaza 'phpstan' con el comando adecuado para tu herramienta SAST
docker run --rm -v "$(pwd):/app"  osdo/php-pre-commit:8.1 /bin/sh -c "phpstan analyze www"

# Comprobar el código de salida de SAST
if [ $? -ne 0 ]; then
   echo "Se detectaron vulnerabilidades de seguridad en el código. Por favor, corrige los problemas antes de confirmar."
   exit 1
fi

# Ejecutar pruebas unitarias (ejemplo: PHPUnit)
# Asegúrate de que PHPUnit esté instalado en tu sistema
# Reemplaza 'phpunit' con el comando adecuado para ejecutar tus pruebas unitarias
docker run --rm -v "$(pwd):/app"  osdo/php-pre-commit:8.1 /bin/sh -c "phpunit -c www/phpunit.xml"

# Comprobar el código de salida de las pruebas unitarias
if [ $? -ne 0 ]; then
   echo "Las pruebas unitarias no pasaron. Por favor, corrige los problemas antes de confirmar."
   exit 1
fi

# Si todas las verificaciones anteriores pasaron sin problemas, permite la confirmación
exit 0
```
