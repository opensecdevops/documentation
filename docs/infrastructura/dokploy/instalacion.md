---
title: Instalación
description: "Guía para instalar Dokploy, desde los requisitos previos hasta la configuración inicial."
---

## Requisitos

Para garantizar una experiencia fluida con Dokploy, se recomienda que el servidor disponga al menos de **2 GB de RAM** y **30 GB de espacio en disco**. Estas especificaciones ayudan a gestionar los recursos consumidos por Docker durante las construcciones y previenen bloqueos o caídas del sistema.

## Docker

Dokploy utiliza Docker para la gestión y despliegue de aplicaciones, por lo que es imprescindible tener Docker instalado en el servidor. Si Docker no está instalado, el propio script de instalación de Dokploy lo instalará automáticamente.

## Instalación

La forma más sencilla de instalar Dokploy es mediante el script oficial. Ejecuta el siguiente comando en tu servidor:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Este comando descargará e instalará Dokploy junto con todas sus dependencias necesarias.

:::info
 Nota: Si prefieres no gestionar la infraestructura, puedes optar por [Dokploy Cloud](https://dokploy.com/es#pricing), que permite utilizar la plataforma sin preocuparse por el mantenimiento o las actualizaciones.
:::

## Finalización de la instalación

Una vez ejecutado el script de instalación, Dokploy y sus dependencias estarán configurados en tu servidor.

Acceso a Dokploy

Abre tu navegador web y accede a la dirección ```http://<tu_dominio_o_ip>:3000```. Si todo ha ido bien, deberías ver la página de inicio de Dokploy.

![Dokploy](/img/dokploy/registro-inicial.png)
