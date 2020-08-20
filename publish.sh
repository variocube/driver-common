#!/usr/bin/env bash

echo "CODEBUILD_WEBHOOK_TRIGGER: ${CODEBUILD_WEBHOOK_TRIGGER}"
echo "CODEBUILD_SOURCE_VERSION: ${CODEBUILD_SOURCE_VERSION}"

# Publish only if building a tagged release
if [[ $CODEBUILD_WEBHOOK_TRIGGER == tag/* || $CODEBUILD_SOURCE_VERSION == tags/* ]]; then
  package_tarball=$(npm pack)
  package_name=$(jq -r ".name" < package.json)
  package_version=$(jq -r ".version" < package.json)
  aws s3 cp "$package_tarball" "s3://og-repository/npm/${package_name}-${package_version}.tgz"
else
  echo "Skipping publish because build was not triggered by a tag."
fi
