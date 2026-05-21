---
title: Cuentas automáticas
description: Guía para crear y gestionar cuentas automáticas (Robot Accounts) en Harbor, incluyendo su uso y configuración de permisos.
---

Las cuentas automáticas, conocidas como Robot Accounts en Harbor, son cuentas de servicio diseñadas para permitir la automatización de operaciones dentro de proyectos, como la subida (push) o descarga (pull) de imágenes de contenedores, sin necesidad de utilizar credenciales de usuario personal.

## ¿Qué es una Robot Account?

Una Robot Account es una cuenta asociada a un proyecto específico en Harbor, utilizada principalmente por sistemas automatizados (CI/CD, scripts, etc.) para interactuar con el registro de imágenes. Estas cuentas tienen permisos limitados y pueden ser gestionadas de forma independiente a los usuarios humanos.

## Creación de una Robot Account

Para crear una Robot Account en Harbor:

1. Acceda al proyecto deseado y diríjase a la sección **Robot Accounts**.
2. Haga clic en **NEW ROBOT ACCOUNT**.
3. Complete el nombre, descripción y configure los permisos necesarios (por ejemplo, solo lectura o lectura/escritura).
4. Opcionalmente, defina la duración del token de acceso.
5. Guarde la cuenta y copie el token generado, ya que solo se muestra una vez.

![Creación de una cuenta automática](/img/harbor/add-robot-account.png)

![Configuración de permisos](/img/harbor/add-robot-account-2.png)

![Definir duración del token](/img/harbor/set-robot-account-token-duration.png)

## Uso del token de Robot Account

El token generado funciona como contraseña para la cuenta automática. Se utiliza junto con el nombre de la cuenta (prefijo `robot$`) para autenticarse en Harbor desde herramientas como Docker o sistemas CI/CD.

![Copia del token](/img/harbor/copy-robot-account-token.png)

## Gestión de Robot Accounts

- Puede ver, deshabilitar o eliminar cuentas automáticas desde la sección correspondiente del proyecto.
- Es posible regenerar el token si es necesario, aunque el token anterior dejará de ser válido.

![Gestión de cuentas automáticas](/img/harbor/disable-delete-robot-account.png)

## Limitaciones y consideraciones

- Las Robot Accounts solo tienen acceso al proyecto donde fueron creadas.
- Los permisos deben ser configurados cuidadosamente para limitar el alcance de la automatización.
- El token solo se muestra una vez al crear la cuenta; si se pierde, debe regenerarse.

## Referencias

Para más información, consulte la [documentación oficial de Harbor](https://goharbor.io/docs/1.10/working-with-projects/project-configuration/create-robot-accounts/).
