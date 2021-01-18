#!/bin/bash

# run patch needed for iOS 14 missing images issue
echo "Run patch-package"
patch-package

# paths
WEBRTC_PATH="node_modules/react-native-webrtc/ios/WebRTC.framework"
JITSI_SDK_PATH=$(greadlink ios/sdk/JitsiMeet.framework)
JITSI_REPO_PATH=$(pwd)
cd ..
TAP_PATH="$(pwd)/cabi-party-app-ios"
cd $JITSI_REPO_PATH

# build SDK
echo "Build Jitsi SDK"
xcodebuild -workspace ios/jitsi-meet.xcworkspace -scheme JitsiMeet -destination='generic/platform=iOS' -configuration Release ENABLE_BITCODE=NO clean archive

# Copy the new files in the repo
echo "Copy frameworks"
rm -R $TAP_PATH/Frameworks/JitsiMeet.framework
cp -R $JITSI_SDK_PATH $TAP_PATH/Frameworks
rm -R $TAP_PATH/Frameworks/WebRTC.framework
cp -R $WEBRTC_PATH $TAP_PATH/Frameworks

# Strip bitcode
echo "Strip bitcode"
xcrun bitcode_strip -r $TAP_PATH/Frameworks/JitsiMeet.framework/JitsiMeet -o $TAP_PATH/Frameworks/JitsiMeet.framework/JitsiMeet
xcrun bitcode_strip -r $TAP_PATH/Frameworks/WebRTC.framework/WebRTC -o $TAP_PATH/Frameworks/WebRTC.framework/WebRTC
