#!/bin/bash

setup() {
  # Configure container manager
  command -v podman > /dev/null
  if [[ $? != 0 ]]; then
    CONTAINER_MANAGER=docker
  fi
  echo "> Using $CONTAINER_MANAGER"

  # Check oc login
  command -v oc whoami > /dev/null
  if [[ $? != 0 ]]; then
    echo "Failed: You must login to your Openshift."
    exit 1
  fi
  echo "> Accessing $(oc whoami --show-console)"

  # Set iamge name
  if [[ -n $1 ]]; then
    IMAGE=$1
  fi

  # Set namespace
  if [[ -n $1 ]]; then
    NAMESPACE=$2
  fi
}

tag() {
  # Expose the registry
  # See: https://docs.openshift.com/container-platform/4.10/registry/securing-exposing-registry.html
  HOST=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}')
  REMOTE_IMAGE="$HOST/$NAMESPACE/$IMAGE"
  eval "$CONTAINER_MANAGER tag $IMAGE $REMOTE_IMAGE"
}

login_and_push() {
  eval "$CONTAINER_MANAGER login -u kubeadmin -p $(oc whoami -t) $HOST"
  eval "$CONTAINER_MANAGER push $REMOTE_IMAGE"
}

#--------- main ----------#
SCRIPT_PATH=$(readlink -f "$0")
DIR_PATH=$(dirname "$SCRIPT_PATH")
WORKDIR=$(dirname "$DIR_PATH")
cd "$WORKDIR"

CONTAINER_MANAGER=podman
IMAGE=backstage:latest
NAMESPACE=backstage

setup $1 $2
tag
login_and_push