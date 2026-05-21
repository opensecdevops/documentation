---
id: app-integracion
title: "Integración con OSDO App"
sidebar_label: "Integración con App"
---

# Integración CLI ↔ OSDO App v2

OSDO App es la plataforma web (Laravel) que permite a tu organización gestionar paquetes de configuración de infraestructura y CI/CD. El CLI se integra con la App para:

1. **Descargar paquetes** generados en la App y renderizarlos localmente con Handlebars
2. **Registrar deployments** y actualizar su estado desde el CLI
3. **Consultar el catálogo** enriquecido con paquetes propios de tu organización

---

## Flujo completo de integración

```
OSDO App (web)          osdo-cli           Kubernetes / CI/CD
─────────────────       ──────────         ───────────────────
  Crear paquete   ──►  osdo app pull   ──►  Renderiza templates
  (config.json        (descarga +          (Handlebars) +
   + templates)        prompts)            escribe archivos

                  ──►  osdo deploy     ──►  kubectl apply /
                       (despliega)          helm upgrade

                  ──►  osdo app push   ──►  App actualiza
                       (estado)             estado deployment
```

---

## Paso 1: Autenticación

```bash
# Autenticarse interactivamente (guarda token en ~/.config/osdo/config.json)
osdo app login

# O con URL y credenciales directas (útil en CI)
osdo app login --url https://app.tu-empresa.com
```

La App emite un **Sanctum Bearer Token** con `cli:read` y `cli:write`. El token se almacena de forma segura en la configuración local del usuario y se revoca automáticamente al hacer un nuevo login.

---

## Paso 2: Descargar y renderizar un paquete (`osdo app pull`)

```bash
# Listar paquetes disponibles y seleccionar interactivamente
osdo app pull

# Descargar paquete específico por ID
osdo app pull 42

# Descargar en directorio personalizado, sobreescribiendo archivos existentes
osdo app pull 42 --dir ./infra --overwrite

# Modo CI: usar valores por defecto sin prompts interactivos
osdo app pull 42 --skip-prompts --dir ./infra
```

`osdo app pull` ejecuta el siguiente flujo:

1. `GET /api/cli/packages` — lista paquetes disponibles
2. `GET /api/cli/packages/:id` — obtiene `config.json` + templates Handlebars
3. Muestra prompts interactivos por campo y bloque del paquete
4. Renderiza los templates con los valores proporcionados
5. Escribe los archivos generados en el directorio destino
6. Crea un registro de deployment `pending` en la App

### Tipos de campos en los prompts

| Tipo      | Prompt mostrado             | Ejemplo                              |
|-----------|-----------------------------|--------------------------------------|
| `text`    | Input de texto libre        | Nombre del proyecto, dominio base    |
| `switch`  | Confirmación sí/no          | ¿Habilitar TLS?, ¿Incluir Redis?     |
| `select`  | Menú desplegable            | Entorno: staging / production / dev  |

Los bloques de un paquete pueden ser opcionales (el usuario selecciona cuáles activar) y algunos tienen dependencias automáticas entre sí.

---

## Paso 3: Desplegar los archivos generados (`osdo deploy`)

```bash
# Desplegar en Kubernetes con los archivos del paquete descargado
osdo deploy --platform kubernetes --namespace staging

# Helm
osdo deploy --platform helm --release mi-api --chart ./charts/api

# Docker Swarm
osdo deploy --platform swarm --release mi-app

# Dry-run (ver qué se haría sin ejecutar)
osdo deploy --dry-run --platform kubernetes
```

Si tienes el ID del deployment de la App, puedes actualizar el estado automáticamente:

```bash
osdo deploy --platform kubernetes --deployment-id 15
# Al completarse: actualiza automáticamente el deployment #15 → "deployed"
# En caso de fallo: actualiza el deployment #15 → "failed" con el mensaje de error
```

---

## Paso 4: Actualizar el estado manualmente (`osdo app push`)

Para actualizaciones manuales del estado de un deployment:

```bash
# Marcar deployment como desplegado
osdo app push --deployment-id 15 --status deployed

# Marcar como fallido con mensaje descriptivo
osdo app push --deployment-id 15 --status failed --message "Namespace no encontrado"

# Ver todos los deployments registrados
osdo app status
```

---

## Consultar deployments (`osdo app status`)

```bash
# Todos los deployments
osdo app status

# Filtrar por estado
osdo app status --status pending

# Salida JSON
osdo app status --output json
```

Ejemplo de salida:

```
ID   Paquete               Plataforma   Estado      Fecha
──   ──────────────────    ──────────   ─────────   ──────────────────────
15   Laravel API Stack     kubernetes   deployed    2026-04-08 14:32:00
14   Monitoring Stack      helm         pending     2026-04-07 09:15:00
13   CI/CD GitHub Actions  github       deployed    2026-04-06 11:00:00
```

---

## Modo standalone (sin App)

El CLI funciona completamente sin la App. Si no estás autenticado, los comandos que requieren la App (`app pull`, `app push`, `app status`) mostrarán un aviso pero no fallarán:

```
⚠  No conectado a la OSDO App — operando en modo standalone.
   Ejecuta "osdo app login" para habilitar la integración.
```

Los comandos `scan`, `certify`, `pipeline`, `monitor`, `security`, `catalog`, `preset` y `deploy` funcionan 100% sin la App.

---

## Referencia de endpoints de la API

| Método | Endpoint                             | Descripción                            |
|--------|--------------------------------------|----------------------------------------|
| POST   | `/api/cli/auth`                      | Autenticación — emite Sanctum token    |
| DELETE | `/api/cli/auth`                      | Cerrar sesión — revoca token           |
| GET    | `/api/cli/packages`                  | Listar paquetes                        |
| GET    | `/api/cli/packages/:id`              | Obtener detalle + templates            |
| GET    | `/api/cli/packages/:id/download`     | Descargar ZIP del paquete              |
| GET    | `/api/cli/deployments`               | Listar deployments (paginado)          |
| POST   | `/api/cli/deployments`               | Crear deployment                       |
| PATCH  | `/api/cli/deployments/:id/status`    | Actualizar estado del deployment       |
