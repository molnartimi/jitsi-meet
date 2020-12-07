#!/bin/bash

set -e -u

THIS_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)


# Update version in gradle.properties file in case of dev build
# Changes will be reverted at the end of this script
update_version_if_dev_build() 
{
  CURRENT_DIR=$1
  BUILD_MODE=$2
  
  # defaul SDK version is coming from gradle.properties file
  DEFAULT_SDK_VERSION=$(grep sdkVersion ${THIS_DIR}/../gradle.properties | cut -d"=" -f2)
   
  if [ ${BUILD_MODE} == "dev" ]; then
   COMMIT_ID=$(git --git-dir=/jitsi-meet/.git rev-parse --verify HEAD)   
   DEV_VERSION="${DEFAULT_SDK_VERSION}-${COMMIT_ID}"
   
   echo "Building in dev mode thus updating SDK version in gradle.properties to ${DEV_VERSION}"
   
   sed -i "s/sdkVersion=.*/sdkVersion=${DEV_VERSION}/g" ${THIS_DIR}/../gradle.properties
   
  fi

}



# Cleanup the changes made in the version due to the dev build
cleanup() {
	BUILD_MODE=$1
	
	if [ ${BUILD_MODE} == "dev" ]; then
	  echo "Cleaning up after dev build."
	  cd /jitsi-meet
	  git --git-dir=/jitsi-meet/.git checkout -- android/gradle.properties
	  cd ${THIS_DIR}
	  echo "Cleanup is done."
	fi 
}

BUILD_MODE=${2:-"prod"}

trap 'cleanup ${BUILD_MODE}' ERR

update_version_if_dev_build ${THIS_DIR} ${BUILD_MODE}

DEFAULT_MVN_REPO="${THIS_DIR}/../../../jitsi-maven-repository/releases"
THE_MVN_REPO=${MVN_REPO:-${1:-$DEFAULT_MVN_REPO}}
MVN_HTTP=0
DEFAULT_SDK_VERSION=$(grep sdkVersion ${THIS_DIR}/../gradle.properties | cut -d"=" -f2)
SDK_VERSION=${OVERRIDE_SDK_VERSION:-${DEFAULT_SDK_VERSION}}
RN_VERSION=$(jq -r '.version' ${THIS_DIR}/../../node_modules/react-native/package.json)
HERMES_VERSION=$(jq -r '.dependencies."hermes-engine"' ${THIS_DIR}/../../node_modules/react-native/package.json | cut -c 2-)
DO_GIT_TAG=${GIT_TAG:-0}

if [[ $THE_MVN_REPO == http* ]]; then
    MVN_HTTP=1
else
    MVN_REPO_PATH=$(realpath $THE_MVN_REPO)
    THE_MVN_REPO="file:${MVN_REPO_PATH}"
fi

export MVN_REPO=$THE_MVN_REPO

echo "Releasing Jitsi Meet SDK ${SDK_VERSION}"
echo "Using ${MVN_REPO} as the Maven repo"

if [[ $MVN_HTTP == 1 ]]; then
    # Push React Native
    echo "Pushing React Native ${RN_VERSION} to the Maven repo"
    pushd ${THIS_DIR}/../../node_modules/react-native/android/com/facebook/react/react-native/${RN_VERSION}
    mvn \
        deploy:deploy-file \
        -Durl=${MVN_REPO} \
        -DrepositoryId=${MVN_REPO_ID} \
        -Dfile=react-native-${RN_VERSION}.aar \
        -Dpackaging=aar \
        -DgeneratePom=false \
        -DpomFile=react-native-${RN_VERSION}.pom || true
    popd
    # Push Hermes
    echo "Pushing Hermes ${HERMES_VERSION} to the Maven repo"
    pushd ${THIS_DIR}/../../node_modules/hermes-engine/android/
    mvn \
        deploy:deploy-file \
        -Durl=${MVN_REPO} \
        -DrepositoryId=${MVN_REPO_ID} \
        -Dfile=hermes-release.aar \
        -Dpackaging=aar \
        -DgroupId=com.facebook \
        -DartifactId=hermes \
        -Dversion=${HERMES_VERSION} \
        -DgeneratePom=true || true
    popd
else
    # Push React Native, if necessary
    if [[ ! -d ${MVN_REPO}/com/facebook/react/react-native/${RN_VERSION} ]]; then
        echo "Pushing React Native ${RN_VERSION} to the Maven repo"
        pushd ${THIS_DIR}/../../node_modules/react-native/android/com/facebook/react/react-native/${RN_VERSION}
        mvn \
            deploy:deploy-file \
            -Durl=${MVN_REPO} \
            -Dfile=react-native-${RN_VERSION}.aar \
            -Dpackaging=aar \
            -DgeneratePom=false \
            -DpomFile=react-native-${RN_VERSION}.pom
        popd
    fi

    # Push Hermes, if necessary
    if [[ ! -d ${MVN_REPO}/com/facebook/hermes/${HERMES_VERSION} ]]; then
        echo "Pushing Hermes ${HERMES_VERSION} to the Maven repo"
        pushd ${THIS_DIR}/../../node_modules/hermes-engine/android/
        mvn \
            deploy:deploy-file \
            -Durl=${MVN_REPO} \
            -Dfile=hermes-release.aar \
            -Dpackaging=aar \
            -DgroupId=com.facebook \
            -DartifactId=hermes \
            -Dversion=${HERMES_VERSION} \
            -DgeneratePom=true
        popd
    fi

    # Check if an SDK with that same version has already been released
    if [[ -d ${MVN_REPO}/org/jitsi/react/jitsi-meet-sdk/${SDK_VERSION} ]]; then
        echo "There is already a release with that version in the Maven repo!"
        exit 1
    fi
fi

# Now build and publish the Jitsi Meet SDK and its dependencies
echo "Building and publishing the Jitsi Meet SDK"
pushd ${THIS_DIR}/../
./gradlew clean assembleRelease publish
popd

if [[ $DO_GIT_TAG == 1 ]]; then
    # The artifacts are now on the Maven repo, commit them
    pushd ${MVN_REPO_PATH}
    git add -A .
    git commit -m "Jitsi Meet SDK + dependencies: ${SDK_VERSION}"
    popd

    # Tag the release
    git tag android-sdk-${SDK_VERSION}
fi

cleanup ${BUILD_MODE}

# Done!
echo "Finished! Don't forget to push the tag and the Maven repo artifacts."
