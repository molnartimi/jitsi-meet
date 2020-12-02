#!/bin/bash

touch local.properties
touch android/local.properties
echo "sdk.dir=$ANDROID_HOME" > local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

/bin/bash