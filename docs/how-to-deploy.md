# Deploy on OpenShift

- [Deploy on OpenShift](#deploy-on-openshift)
    - [Build and Push](#build-and-push)
    - [Deploy on OSHFT](#deploy-on-oshft)

---

# Build and Push

There are two ways to build and push the backstage application.

## Option 1. Build with Source-to-Image

Go check `BuildConfig` at Openshift Console > Builds > BuildConfigs > Backstage
which is based on `/k8s/buildconfig`. 
This will be triggered automatically when there is update on the repository.

Please add `.env` as configmap to build correctly.
Refer `BuildConfig` for more detail.

## Options 2. Build with Containerfile

These scripts are tested with docker on RHEL8.

```
chmod +x ./srcripts/*.sh
./srcripts/container-push.sh
./srcripts/container-build.sh
```

>
> N.B. If getting yarn errors building on M1 Mac,
> ```
> podman build --platform=linux/amd64 --no-cache --layers=false -t backstage:1.0.1 .
> ```
> TODO: The above command still does not work reliably


---

# Deploy on OSHFT

## Deploy PostgreSQL

1. Replace secrets in `/k8s/postgresql/base/secrets`
2. Deploy with `oc apply -k ./k8s/postgresql/overlays/dev`
3. Grant permissions to the backstage user:

```
chmod +x ./scripts/grant-db-permissions.sh
./scripts/grant-db-permissions.sh
```


## Deploy Plugin Resources

### Kubernetes Plugin

The Kubernetes plugin requires authentication to the Kubernetes API to fetch resource information. [See here](https://backstage.io/docs/features/kubernetes/authentication).

A relatively straight forward option to configure authentication is to deploy a Service Account for the plugin and give it visibility to all pipelines across the cluster.

> **TODO:** Currently the Service Account has Cluster Admin permissions. RBAC should be refined to only Tekton APIs & resources.

1. Deploy the Service Account Resources:

```
oc apply -f ./k8s/rbac
```

2. Fetch the Service Account Token:

```
oc get secret $(oc get secrets -n backstage | grep backstage-k8s-plugin-token | head -n 1 | awk '{print $1}') -ojsonpath='{..token}' | base64 -d
```

> You will be able to use this token in the `app-config.yaml` to authenticate both the Kubernetes and the Tekton Pipelines plugin (this is `${KUBE_SERVICE_ACCOUNT_TOKEN}` in `app-config.yaml`).


### Tekton Pipelines Plugin

The Tekton Pipelines Plugin requires the Tekton Dashboard to be deployed in order to it in the Backstage Pipeline UI view. You can [find more info on the Tekton Dashboard here](https://tekton.dev/docs/dashboard/)

To deploy the Tekton Dashboard in the `openshift-pipelines` namespace:

```
oc apply -f ./k8s/tekton-dashboard
```




## Deploy Backstage

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
  AUTH_GITHUB_CLIENT_ID: REPLACE_ME
  AUTH_GITHUB_CLIENT_SECRET: REPLACE_ME
  KUBE_TOKEN: REPLACE_ME
```

> `GITHUB_TOKEN`: a personal access token to access the application.
>
> `AUTH_GITHUB_CLIENT_ID`: the Github Client ID for Github OAUTH.
> [Follow these steps to create it](#configuting-github-oauth)
>
> `AUTH_GITHUB_CLIENT_SECRET`: the Github Client Secret for Github OAUTH. [Follow these steps to create it](#configuting-github-oauth)
>
> `KUBE_TOKEN`: the Service Account token for the Backstage Kuberenetes Plugin. [See how to configure it here](#kubernetes-plugin)

2. Deploy backstage:

```
oc apply -k ./k8s/backstage/overlays/dev
```

3. Navigate to the `backstage` route in the `backstage` project to access the application from OpenShift.


