# Build with Kustomize



1. Update `app-config.yaml`
   

2. Update `source-secret.yaml`
   
3. Set Namespace (optional - default namespace is `backstage`):
```
kustomize edit set namespace <target-ns>
```

4. Build and create:

```
kustomize build | oc apply -f -
```

