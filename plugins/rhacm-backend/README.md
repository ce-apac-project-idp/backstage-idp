# cluster-status

Welcome to the cluster-status backend plugin! This plugin serves as the backend for showing the status page of resources with `kind: cluster`.

## Documentation

More detailed documentation is located in the [`backstage` component documentation][1].

[1]: https://service-catalog.operate-first.cloud/catalog/default/component/backstage/docs


## Usage

### Configuration

Depending on the use case this plugin need not be provided with each deployment. 

Execute the steps given below to enable it:

1) Uncomment (if commented out) the line given below from "packages/backend/src/index.ts"
2) For local development, set RHACM_ENABLED to "true" in your .env file. For a Kubernetes deployment set the field RHACM_ENABLED to true. (Song: I will expand on this point when we get K8 working properly)