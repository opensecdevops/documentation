# Instalación

## OSDO CLI (Recomendado)

La forma más rápida y sencilla de instalar MariaDB es utilizando **OSDO CLI**, que automatiza todo el proceso de despliegue.

### Instalación Rápida

```bash
# Desplegar MariaDB en Kubernetes
osdo deploy --platform kubernetes --components mariadb

# Desplegar en Kind (desarrollo local)
osdo kind create dev-cluster
osdo deploy --platform kind --kind-cluster dev-cluster --components mariadb

# Desplegar en K3s
osdo deploy --platform k3s --components mariadb
```

### Con Configuración Personalizada

```bash
# Desplegar con namespace específico
osdo deploy --platform kubernetes \
  --components mariadb \
  --namespace osdo \
  --domain miempresa.com

# Verificar el estado del despliegue
osdo status --platform kubernetes --namespace osdo

# Modo interactivo
osdo deploy --interactive --platform kubernetes
```

:::tip
Para más información sobre OSDO CLI, consulta la [documentación completa](https://github.com/osdo/osdo-infra-cli).
:::

## Instalación Manual

Para proceder a la instalacion de MariaDB en nuestra plataforma como con otras herramientas primero necesitamos crear los manifiestos pertinentes para desplegar.

Ejecutamos los siguientes comandos:

```bash
touch db-deployment.yaml
touch persistenvolumeclaim.yaml
```

En el **db-deployment.yaml** debemos tener meter lo siguiente:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: osdodatabase-service
spec:
  ports:
  - port: 3306
  selector:
    app: osdodatabase
  clusterIP: None
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: osdodatabase
spec:
  selector:
    matchLabels:
      app: osdodatabase
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: osdodatabase
    spec:
      containers:
      - image: mariadb
        name: mariadb
        env:
          # Use secret in real usage
        - name: MARIADB_ROOT_PASSWORD
          valueFrom:
                secretKeyRef:
                  name: dbpass-secret
                  key: dbpass-key
        ports:
        - containerPort: 3306
          name: mariadb
        volumeMounts:
        - name: mariadb-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mariadb-persistent-storage
        persistentVolumeClaim:
          claimName: mariadb-pv-claim
```
y luego procedemos a colocar lo siguiente en el **persistenvolumeclaim.yaml**:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  creationTimestamp: null
  labels:
    app: osdoapp
  name: webserver-claim0
  namespace: osdo
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
status: {}

---

apiVersion: v1
kind: PersistentVolume
metadata:
  namespace: osdo
  name: mariadb-pv-volume
  labels:
    type: local
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: osdo
  name: mariadb-pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

```

```bash
kubectl apply -f persistenvolumeclaim.yaml -n osdo

kubectl apply -f db-deployment.yaml -n osdo

```

Con el fichero **persistenvolumeclaim.yaml** procedemos a crear los volumenes que usara la base de datos.
Con el fichero **db-deployment.yaml** procedemos a desplegar la base de datos.

Una vez desplegada las base de datos debemos proceder a ejecutar los siguientes script para crear el schema y asi la pueda usar la aplicacion.

```bash
  CREATE DATABASE IF NOT EXISTS osdo;
  CREATE USER 'userDB'@'%' IDENTIFIED BY 'bgchgx';
  GRANT ALL PRIVILEGES ON osdo.* TO 'userDB'@'%';

```