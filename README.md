# backstage-on-oshft

- [backstage-on-oshft](#backstage-on-oshft)
- [Run Locally](#run-locally)
- [Deploy on OpenShift](#deploy-on-openshift)
  - [Modify app-config.yaml](#modify-app-configyaml)
  - [Build and Push Image](#build-and-push-image)
  - [Deploy on OSHFT](#deploy-on-oshft)
    - [Deploy PostgreSQL](#deploy-postgresql)
    - [Deploying Plugin Resources](#deploying-plugin-resources)
      - [Kubernetes Plugin](#kubernetes-plugin)
      - [Tekton Pipelines Plugin](#tekton-pipelines-plugin)
    - [Configuting Github OAUTH](#configuting-github-oauth)
    - [Deploy Backstage](#deploy-backstage)
---

# Run Locally

1. To run Backstage locally, you will need a `app-config.local.yaml` file in the root directory of this repo. Reach out to one of the IdP team members if you need more information / a copy of it. 

2. Make sure you have `node 18` installed on your machine. Then run:

```
yarn install
```
> N.B. run the command at root directory level


3. To start the application, run:

```
yarn dev
```

4. Head to the following url to access the Backstage front end:
   
```
http://localhost:3000
```

---

# Deploy on OpenShift
## Modify app-config.yaml

1. Log into your target cluster
   
2. Run `update-app-config.sh`:

```
chmod +x ./scripts/update-host.sh

./scripts/update-app-config.sh
```

Review `app-config.yaml`.



## Build and Push Image

1. Build the Containerfile:

```
podman build -t backstage:1.0.0 .
```

> N.B. If getting yarn errors/building on M1 mac:
>```
>podman build --platform=linux/amd64 --no-cache --layers=false -t backstage:1.0.1 .
>```
> TODO: The above command still does not work reliably

2. Expose the registry: https://docs.openshift.com/container-platform/4.10/registry/securing-exposing-registry.html

3. Tag the image:

```
podman tag backstage:1.0.0 $HOST/backstage/backstage:1.0.0
```

4. Push:

```
podman push $HOST/backstage/backstage:1.0.0
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
  POSTGRESQL_USER: backstage
  POSTGRESQL_PASSWORD: REPLACE_ME
  POSTGRESQL_DB: backstage
```

Deploy postgres on OSHFT:

```
oc apply -f ./k8s/postgresql
```

2. Grant permissions to the backstage user:

```
chmod +x ./scripts/grant-db-permissions.sh


./scripts/grant-db-permissions.sh
```

### Deploying Plugin Resources

#### Kubernetes Plugin

The Kubernetes plugin requires authentication to the Kubernetes API to fetch resource information. [See here](https://backstage.io/docs/features/kubernetes/authentication).

A relatively straight forward option to configure authentication is to deploy a Service Account for the plugin and give it visibility to all pipelines across the cluster.

> **TODO:** Currently the Service Account has Cluster Admin permissions. RBAC should be refined to only Tekton APIs & resources.

1. Deploy the Service Account Resources:

```
oc apply -f ./k8s/k8s-plugin-resources
```

2. Fetch the Service Account Token:

```
oc get secret $(oc get secrets -n backstage | grep backstage-k8s-plugin-token | head -n 1 | awk '{print $1}') -ojsonpath='{..token}' | base64 -d
```

> You will be able to use this token in the `app-config.yaml` or `app-config.local.yaml` file to authenticate both the Kubernetes and the Tekton Pipelines plugin (this is `${KUBE_TOKEN}` in `app-config.template.yaml`).

#### Tekton Pipelines Plugin

The Tekton Pipelines Plugin requires the Tekton Dashboard to be deployed in order to it in the Backstage Pipeline UI view. You can [find more info on the Tekton Dashboard here](https://tekton.dev/docs/dashboard/)

1. To deploy the Tekton Dashboard in the `openshift-pipelines` namespace:

```
oc apply -f ./k8s/tekton-dashboard
```
---
### Configuting Github OAUTH

1. Create a Github application following [these instructions](https://backstage.io/docs/auth/github/provider)


2. If creating for the GH application for the app deployed on OpenShift, configure the following parameters:

```
Homepage URL: https://<BACKSTAGE-ROUTE>
```

```
Callback URL: https://<BACKSTAGE-ROUTE>/api/auth/github/handler/frame
```

3. Generate a client secret for the application.
   
4. Place the Github Client ID and Github Client secret in the backstage secret:

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

### Configuring IBM Security Verify OIDC
1. Login to IBM Security Verify as admin
2. Create an application
   - Refer to this [doc](https://docs.verify.ibm.com/verify/docs/connect-a-sample-application)
   - Create a custom application
   - Sign-on > Sign-on Method: Open ID Connect 1.0
   - Sign-on > Application URL: your backstage url
   - Sign-on > Redirect URIs: your backstage oauth redirect url. 
     - in this implementation, use `<backstage url>/api/auth/ibm-verify-oidc-provider/handler/frame`
3. Save the application setting and get `Client Id` and `Clinet Secret`. 
4. Copy your verify endpoint (`metadataUrl`) at Sign-on > Config Doc on right side > Configure your OpenID Connect relying party > Provide the IBM Security Verify endpoint by using the following format 
4. Update your app-config.yaml
```
auth:
  session:
    secret: ${AUTH_SESSION_SECRET}
  providers:
    ibm-verify-oidc-provider:
      development:
        metadataUrl: ${AUTH_IBM_VERIFY_META_URL}
        clientId: ${AUTH_IBM_VERIFY_CLIENT_ID}
        clientSecret: ${AUTH_IBM_VERIFY_CLIENT_SECRET}
        prompt: auto
```

---
### Configuring RHACM plugins
1. Update your app-config.yaml
```
kubernetes:
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - name: local-cluster // matching name
rhacm:
  hub: 'local-cluster' // matching name
  
catalog:
  locations:
  - type: file
    target: /opt/app-root/src/examples/resources/test.yaml
    rules:
    - allow: [ Resource ]
  - type: file
    target: /opt/app-root/src/examples/resources/test-managed.yaml
    rules:
    - allow: [ Resource ]
```

2. Add your cluster as Resource - static at this moment
   - Refer to examples > resources

---

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
oc apply -f ./k8s/backstage
```

3. Navigate to the `backstage` route in the `backstage` project to access the application from OpenShift. 

---
