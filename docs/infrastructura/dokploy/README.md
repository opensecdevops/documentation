---
title: Dokploy
description: "Dokploy es una plataforma para la gestión y automatización de despliegues basada en Docker Compose, orientada a facilitar prácticas GitOps sin necesidad de Kubernetes ni Docker Swarm."
---

Dokploy es una plataforma diseñada para simplificar la gestión y automatización de despliegues de aplicaciones utilizando Docker Compose. Su objetivo principal es ofrecer una alternativa ligera y accesible para implementar prácticas GitOps, permitiendo gestionar la infraestructura y los despliegues directamente desde repositorios Git, sin requerir la complejidad de Kubernetes o Docker Swarm.

## Características principales

- **Despliegue automatizado con Docker Compose:** Permite definir y gestionar servicios, aplicaciones y entornos completos mediante archivos `docker-compose.yml`, facilitando la orquestación y el mantenimiento de los contenedores.
- **GitOps sin Kubernetes:** Dokploy integra los principios de GitOps, permitiendo que los cambios en los repositorios Git se reflejen automáticamente en los entornos de despliegue, sin necesidad de utilizar Kubernetes ni Docker Swarm.
- **Gestión centralizada:** Ofrece una interfaz web para monitorizar, gestionar y auditar los despliegues, así como para visualizar el estado de los servicios y recibir notificaciones de eventos relevantes.
- **Automatización y control de versiones:** Cada cambio en la configuración o en los archivos de despliegue queda registrado y versionado, facilitando la trazabilidad, la auditoría y la posibilidad de revertir a estados anteriores en caso de incidentes.
- **Facilidad de uso:** Está orientado a equipos que buscan una solución sencilla y eficiente para la gestión de despliegues en entornos Docker, sin la curva de aprendizaje ni los requisitos de infraestructura de soluciones más complejas.

## ¿Para qué lo utilizamos?

En nuestro entorno, Dokploy se utiliza para gestionar los despliegues de aplicaciones y servicios mediante Docker Compose, integrando los flujos de trabajo GitOps y permitiendo una gestión centralizada, segura y automatizada de los entornos. Gracias a Dokploy, es posible aplicar buenas prácticas de automatización y control de cambios sin depender de plataformas como Kubernetes o Docker Swarm, adaptándose a proyectos de cualquier tamaño y facilitando la adopción de DevOps y GitOps en equipos con diferentes niveles de experiencia.

Para más información, puedes consultar la [documentación oficial de Dokploy](https://dokploy.com/es).
