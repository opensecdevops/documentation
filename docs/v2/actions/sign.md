---
id: sign
title: "osdo-sign"
sidebar_label: "sign"
---

# osdo-sign

Acción para la firma criptográfica de artefactos de software, imágenes de contenedores y SBOMs. Utiliza Cosign y la infraestructura de Sigstore para garantizar la autenticidad e integridad de los artefactos, habilitando la verificación sin necesidad de gestión de claves cuando se usa el modo sin llave (keyless).

## Herramientas utilizadas

- **Cosign** — herramienta de firma y verificación de artefactos OCI de Sigstore; soporta firma keyless mediante OIDC y firma basada en clave
- **Sigstore** — infraestructura de transparencia de código abierto que incluye Rekor (registro de transparencia) y Fulcio (CA de código corto)

## Entradas (inputs)

| Parámetro | Tipo | Requerido | Por defecto | Descripción |
|-----------|------|-----------|-------------|-------------|
| `image` | `string` | Sí | — | Referencia completa de la imagen a firmar (ej. `ghcr.io/org/app:latest`) |
| `sign-type` | `string` | No | `keyless` | Tipo de firma: `keyless` (OIDC/Sigstore) o `key` (clave privada) |
| `upload-tlog` | `boolean` | No | `true` | Subir la entrada al registro de transparencia de Rekor |

## Ejemplo de uso

```yaml
- uses: opensecdevops/osdo-actions/osdo-sign@v2
  with:
    image: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
    sign-type: 'keyless'
    upload-tlog: true
```

## Salidas (outputs)

| Salida | Descripción |
|--------|-------------|
| `signature` | Referencia a la firma OCI almacenada en el registro |
| `rekor-log-id` | Identificador de la entrada en el registro de transparencia de Rekor |
| `certificate` | Certificado X.509 utilizado para la firma (solo en modo keyless) |

## Notas

- El modo `keyless` utiliza las credenciales OIDC del entorno de GitHub Actions (mediante `ACTIONS_ID_TOKEN_REQUEST_TOKEN`) para obtener un certificado efímero de Fulcio. No requiere gestión de claves privadas.
- Para usar `sign-type: key`, debes almacenar la clave privada de Cosign como secreto de GitHub (`COSIGN_PRIVATE_KEY`) y la contraseña de la clave (`COSIGN_PASSWORD`).
- Con `upload-tlog: false` se omite la subida al registro de transparencia; útil en entornos privados donde no se desea exposición pública.
- La firma se almacena como un artefacto OCI en el mismo registro que la imagen, usando el formato `sha256-<digest>.sig`.
