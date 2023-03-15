#!/bin/bash

NAMESPACE=${1:-backstage}
TARGET_POD=$(oc get pod -l app=backstage-postgresql -n $NAMESPACE -o=jsonpath='{..metadata.name}')

if [[ -z $TARGET_POD ]]; then
  echo "No postgres pod found"
  exit 1
fi

echo "Found postgres pod: $TARGET_POD in $NAMESPACE"

echo "Updating permissions"
oc exec $TARGET_POD -n $NAMESPACE -- psql -U postgres -c "ALTER USER backstage CREATEDB"

echo "Current postgres user privileges"
oc exec $TARGET_POD -n $NAMESPACE -- psql -U postgres -c "\du"

echo "Complete!"