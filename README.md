> All content in these repositories including code has been provided by IBM under the associated open source software license and IBM is under no obligation to provide enhancements, updates, or support. IBM developers produced this code as an open source project (not as an IBM product), and IBM makes no assertions as to the level of quality nor security, and will not be maintaining this code going forward.

# Backstage IDP

- [Backstage IDP](#backstage-idp)
  - [Run Locally](#run-locally)
  - [Deploy on Openshift](#deploy-on-openshift)
  - [Configure Plugins](#configure-plugins)
  - [Understand DevSecOps](#understand-devsecops)

---

## Run Locally

1. Make your `.env` from `.env.template`. These environment variables will be used in `app-config(local).yaml`
2. Install dependencies
    ```
    cd <project root dir>
    yarn install
    ```
3. Start application
    ```
    yarn dev
    ```
4. Head to the Backstage front end
    ```
    http://localhost:3000
    ```

For `.env`, please reach out to IBM CE APAC IDP project members.


## Deploy On Openshift

Backstage IDP works as a developer portal on Openshift.
Follow the document [here](./docs/how-to-deploy.md) to deploy Backstage on Openshift. 


## Configure Plugins

Backstage IDP comes with difference plugins for 
 - Authentication (SSO)
 - Tekton 
 - Red Hat Advanced Cluster Manager (RHACM) 
 - Red Hat Advanced Cluster Security (RHACS) 
 - ... 

Follow the document [here](./docs/how-to-configure-plugins.md) to configure those Plugins. 

## Monitoring Custom Resources

The relevant information is documented [here](https://backstage.io/docs/features/kubernetes/configuration#customresources-optional). An example stanza can be found in the app-config.yaml file. There exists a cuto resources stanza under Kubernetes enabling one to monitor custom resources. For instance, routes. Since routes are not a native K8 object.


## Understand DevSecOps

Backstage IDP provide users with opinionated DevSecOps pipeline which will build user's application and run RHACS image and deployment tests. For more information, check the document [here](./docs/how-pipelines-run.md)
