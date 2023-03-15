# Configure Plugins

- [Configure Plugins](#configure-plugins)
  - [IBM Security Verify OIDC](#ibm-security-verify-oidc)
  - [Github OAuth](#github-oauth)
  - [RHACM Plugin](#rhacm-plugin)
  - [RHACS Plugin](#rhacs-plugin)

---


## IBM Security Verify OIDC

1. Login to IBM Security Verify as admin
2. Create an application
    - Refer to this [doc](https://docs.verify.ibm.com/verify/docs/connect-a-sample-application)
    - Create a custom application
    - Sign-on > Sign-on Method: Open ID Connect 1.0
    - Sign-on > Application URL: `your backstage url`
    - Sign-on > Redirect URIs: `your backstage oauth redirect url`
        - in this implementation, use `<backstage url>/api/auth/ibm-verify-oidc-provider/handler/frame`
3. Save the application setting and get `Client Id` and `Clinet Secret`.
4. Copy your verify endpoint (`metadataUrl`) at Sign-on > Config Doc on right side > Configure your OpenID Connect relying party > Provide the IBM Security Verify endpoint by using the following format
4. Update your envvars in `.env` for `app-config.yaml`
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

> The SignIn would not be up when running with `NODE_ENV=development`


## Github OAuth

1. Create a Github application following [these instructions](https://backstage.io/docs/auth/github/provider)
2. If creating for the GH application for the app deployed on OpenShift, configure the following parameters:
    ```
    Homepage URL: https://<BACKSTAGE-ROUTE>
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


## RHACM plugin
1. Review and update app-config.yaml
```
kubernetes:
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - name: your-hub-cluster // matching name
rhacm:
  hub: your-hub-cluster // matching name
  
catalog:
  locations:
  - type: url
    target: https://github.com/ce-apac-project-idp/developer-repo-catalog/blob/main/all-resources.yaml
    rules:
    - allow: [ Resource ]
```

2. Add your cluster as Resource in the catalog repository. Please check catalog resources in [backstage-idp-catolog](https://github.com/ce-apac-project-idp/backstage-idp-catalog)
3. Verify accessing `<backstage url>/rhacm`


## RHACS Plugin

1. Get API token from RHACS. RHACS Central Console > Platform Configuration > Integrations > Authentication Tokens > API Token
2. Update your `RHACS_API_TOKEN` in `.env` to the token. This will be used in `app-config.yaml`
    ```
    rhacs:
      token: ${RHACS_API_TOKEN}
    ```
