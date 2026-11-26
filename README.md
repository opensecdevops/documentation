> ⚠️ **Mirror** — This repository is mirrored from [GitLab](https://gitlab.com/opensecdevops/documentation). Please submit issues and merge requests there.

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
 npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Secretos y variables de CI

Los workflows de `.github/workflows` no fallan cuando falta un secreto: el paso correspondiente se omite y deja un aviso en el resumen del job. El build de Docusaurus se ejecuta siempre.

### Deploy a Netlify (`deploy.yml`)

| Tipo | Nombre | Obligatorio | Uso |
|---|---|---|---|
| Secret | `NETLIFY_AUTH_TOKEN` | Sí, para desplegar | Token de autenticación de Netlify |
| Secret | `NETLIFY_SITE_ID` | Sí, para desplegar | ID del sitio de Netlify |

Sin ambos secretos, el build se valida y el deploy (producción y preview de PR) se omite.

### Mirror a GitLab (`mirror.yml`)

| Tipo | Nombre | Obligatorio | Uso |
|---|---|---|---|
| Secret | `GITLAB_TOKEN` | Sí, para sincronizar | Token de GitLab con permiso de escritura en el repositorio destino |
| Variable | `GITLAB_NAMESPACE` | No | Grupo o usuario de GitLab. Por defecto `opensecdevops` |
| Variable | `GITLAB_DOCUMENTATION_REPO` | No | Nombre del repositorio en GitLab. Por defecto `documentation` |

Sin `GITLAB_TOKEN` el mirror se omite.
