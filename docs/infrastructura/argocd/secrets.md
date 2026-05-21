# Secrets

Para poder tener una correcta creacion de base de datos y otros elementos que se despliegan con la aplicación debemos crear a mano unos secretos en el namespace de **osdo**

```bash showLineNumbers
kubectl create secret generic appkey-secret --namespace=osdo  --from-literal=appkey-key=base64:hbjhbhjvvjghvh=

kubectl create secret generic dbcred-secret --namespace=osdo  --from-literal=dbuser-key=user --from-literal=dbpass-key=nhvjgv

kubectl create secret generic mailcred-secret --namespace=osdo  --from-literal=mailuser-key=api --from-literal=mailpass-key=405
```

Dichos secretos son para que se puedan usar la **BD** y el **correo** dentro de la aplicación.
