#!/bin/bash

set -e

echo "Make sure to log in to the target cluster before running..." && sleep 3

BASE_DOMAIN=$(oc get dns cluster -o jsonpath='{.spec.baseDomain}')
API_ENDPOINT=$(oc whoami --show-server)

echo "Found base domain: $BASE_DOMAIN"
echo "Found API server: $API_ENDPOINT" && sleep 3


sed "s,{{OSHFT-BASE-DOMAIN}},$BASE_DOMAIN,g;s,{{CLUSTER-API-ENDPOINT}},$API_ENDPOINT,g" app-config.template.yaml > app-config.yaml

echo "Generated app-config.yaml"

cat app-config.yaml

echo "Complete!"