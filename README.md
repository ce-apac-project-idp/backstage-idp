# backstage-on-oshft

## Build and Push Image

1. Build the Containerfile:

```
podman build -t backstage:1.0.0 .
```

> N.B. If getting yarn errors/building on M1 mac:
>```
>podman build --platform=linux/amd64 --no-cache --layers=false -t backstage:1.0.1 .
>```

2. Expose the registry: https://docs.openshift.com/container-platform/4.10/registry/securing-exposing-registry.html

3. Tag the image:

```
podman tag backstage:1.0.0 $HOST/backstage/backstage:1.0.0
```

---

## Deploy on OSHFT

### Deploy PostgreSQL

1. Apply the following secret before deploying PostgreSQL:

```
apiVersion: v1
kind: Secret
metadata:
  name: postgresql-secret
  namespace: backstage
stringData:
  database-user: backstage
  database-password: REPLACE_ME
  database-name: backstage
```

Deploy postgres on OSHFT:

```
oc apply -f ./k8s/postgresql
```

### Deploy Backstage

1. Apply the following secret:

```
apiVersion: v1
kind: Secret
metadata:
  name: backstage-secrets
  namespace: backstage
type: Opaque
stringData:
  GITHUB_TOKEN: REPLACE_ME
```

2. Deploy backstage:

```
oc apply -f ./k8s/backstage
```