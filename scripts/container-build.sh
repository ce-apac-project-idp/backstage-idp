#!/bin/bash

setup() {
  # Configure container manager
  command -v podman > /dev/null
  if [[ $? != 0 ]]; then
    CONTAINER_MANAGER=docker
  fi
  echo "> Using $CONTAINER_MANAGER"

  # Check .env
  if [[ ! -f ".env" ]]; then
    echo "Failed: .env not found. Please make .env with envvars for Backstage deploy"
    exit 1
  fi
  echo "> .env found"

  # Check envsubst
  command -v envsubst > /dev/null
    if [[ $? != 0 ]]; then
    echo "Failed: envsubst required. You can try"
    echo " - OS X          :  brew install gettext"
    echo " - debian/ubuntu :  apt-get install gettext-base"
    echo " - fedora/rhel   :  dnf install gettext"
    exit 1
  fi

  # Set iamge tag
  if [[ -n $1 ]]; then
    IMAGE_TAG=$1
  fi
}

generate_app_config() {
  cat app-config.yaml | envsubst "$(grep -v '^#' .env | xargs)" > app-config.prod.yaml
  echo "> app-config.prod.yaml generated"
}

build() {
  set -x
  eval "$CONTAINER_MANAGER build -t backstage:$IMAGE_TAG -f Containerfile ."
  set +x
}

#--------- main ----------#
SCRIPT_PATH=$(readlink -f "$0")
DIR_PATH=$(dirname "$SCRIPT_PATH")
WORKDIR=$(dirname "$DIR_PATH")
cd "$WORKDIR"

CONTAINER_MANAGER=podman
IMAGE_TAG=latest

setup $1
generate_app_config
build