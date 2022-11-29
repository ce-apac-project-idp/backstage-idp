#!/bin/bash

set -e

echo "Make sure to log in to the target cluster before running..." && sleep 5

BASE_DOMAIN=$(oc get dns cluster -o jsonpath='{.spec.baseDomain}')

echo "Found base domain: $BASE_DOMAIN"


sed "s/{{OSHFT-BASE-DOMAIN}}/$BASE_DOMAIN/g" app-config.template.yaml > app-config.yaml


echo "Complete!"