# rhacm

Welcome to the rhacm plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/rhacm](http://localhost:3000/rhacm).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.


## Overview

### How it works

The following file loads the plugin: "backstage-idp/plugins/rhacm/src/plugin.ts". It renders the content of ClusterStatusPage as found in the file titled. "backstage-idp/plugins/rhacm/src/components/ClusterStatusPage/ClusterStatusPage.tsx"

The logic within is fairly straightforward. It uses the Catalog and Config API's to respectively fetch the catalogued clusters (found in the Git Repo) and the ManagedClusters (found in the Hub Cluster). Only the managed clusters whose name coincides with those found in the Catalog are ultimately rendered to the end user.

This implies any resources (clusters in this case) should be catalogued. In other words, a git push to the relevant Git Repo as found in locations entry the app-config file should be performed, and must be labelled in accordance to the constraints set in the ClusterStatusPage. **This means the relevant Tekton pipelines should perform this step**. This is currently not done and ought to be added as a final step.

The RHACM data given can be found either:

1) The side navigation button titled "clusters" as defined in the file titled "backstage-idp/packages/app/src/components/Root/Root.tsx"
2) The resource filter in the main page, as defined in the ResourceEntitySwitchPage defined towards the bottom of the file titled "backstage-idp/packages/app/src/components/catalog/EntityPage.tsx". This uses the component cards found in the directory titled "backstage-idp/plugins/rhacm/src/components".


### Usage

## Configuration

Depending on the use case this plugin may not be used, and ought to be disabled. Execute the steps below in the event this plugin is not used:

1) Navigate to the file titled "backstage-idp/packages/app/src/components/Root/Root.tsx" and comment out the Sidebar item given below.
2) Finally, navigate to the file titled "backstage-idp/packages/app/src/App.tsx" and comment out the route entry given below.

Sidebar item:
```
<SidebarItem icon={StorageIcon} to="rhacm" text="Clusters" />
```

Route item:
```
<Route path="/rhacm" element={<RhacmPage />} />
```

Uncomment out the entries given above should you wish to enable this.
