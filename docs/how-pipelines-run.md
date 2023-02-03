# Backstage IDP Pipelines

Pipelines for Backstage IDP reside in `packages > backend > src > plugins > scaffolder` as Backstage custom actions. 
For more details on custom actions, check [the official document.](https://backstage.io/docs/features/software-templates/writing-custom-actions) 

## DevSecOps pipeline

Once a user hit `create` from backstage template, this will trigger a Tekton pipeline in Openshift Cluster.
In the pipeline, essential security checks are done onto the newly built application image. The pipeline tasks are as below (this is highly subject to change)
 - Image build and push 
 - RHACS image scan
 - RHACS image check
 - RHACS deploy check
 - Add application in `opt-gitops-apps` (Thus, the application will be gitopsed) 

After the pipeline finishes, the custom action sends the image information(reference, sha) to RHACS plugin. Then, RHACS plugin will provide UI view to users about RHACS security reports. 

