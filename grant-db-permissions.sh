#!/bin/bash

TARGET_POD=$(oc get pod -l name=postgresql -n backstage -o=jsonpath='{..metadata.name}')

echo "Found postgres pod: $TARGET_POD"

echo "Updating permissions"

oc exec $TARGET_POD -n backstage -- psql -U postgres -c "ALTER USER backstage CREATEDB"

echo "Current postgres user privileges"

oc exec $TARGET_POD -n backstage -- psql -U postgres -c "\du"

echo "Complete!"