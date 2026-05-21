# Job

Para proceder con las migraciones de base de datos despues del despliegue, se crea un job en kubernetes que realiza las ejecuciones pertinentes dentro del pod de la aplicacion

**El job** es el siguiente:

:::warning

Para que el **Job** pueda ejecutar comandos dentro del pod debe tener un **RoleBinding** asociado a la service account del proyecto de **argoCD**.
Debe ser algo como lo siguiente dependendiendo del namespace donde se quiera colocar:

```bash
kubectl create rolebinding default-admin --clusterrole=admin --serviceaccount=osdo:default -n osdo
```

Esto hara que la service account pueda acceder al pod y ejecutar los comandos del job

:::

```yaml

apiVersion: batch/v1
kind: Job
metadata:
  name: osdoapp-post-hook-job
  namespace: osdo
  annotations:
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
spec:
  template:
    spec:
      containers:
      - name: kubectl-container
        image: bitnami/kubectl:latest  # Imagen de kubectl
        command:
        - "/bin/sh"
        - "-c"
        args:
        - |
          pods=$(kubectl get pods -n osdo -o=name)
          pod_name=$(echo "$pods" | grep "osdoapp-deployment" | head -n 1 | cut -d'/' -f 2)
          if [ ! -z "$pod_name" ]; then
            kubectl exec -n osdo $pod_name -- php artisan migrate --force
            kubectl exec -n osdo $pod_name -- php artisan db:seed --force
          else
            echo "No se encontró el pod deseado."
          fi
      restartPolicy: Never
  backoffLimit: 2 # Número de veces que se intentará ejecutar el job en caso de fallo

```
