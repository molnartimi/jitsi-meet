 ## Repositories
 - [Tabletparty (Angular)](https://bitbucket.org/cabidev/cabiofbiz/src/VS-mobile-integration/), **VS-mobile-integration** branch
 - [Tabletparty (native Android)](https://gitlab.int.sonrisa.hu/cabi/cabi-party-app-android), **VS-mobile-integration** branch
 - [Tabletparty (native iOS)](https://gitlab.int.sonrisa.hu/cabi/cabi-party-app-ios), **VS-mobile** branch
 - [Jitsi Meet (React Native)](https://github.com/molnartimi/jitsi-meet/tree/VS-mobile-integration), **VS-mobile-integration** branch

## Build Jitsi SDK
**Note:** to build your own SDK Node 12.X and npm 6.X are required.
### [iOS](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ios-sdk)
 ```
 $ cd jitsi-meet
 $ npm install
 $ cd ios
 $ pod install
 $ cd ..
 $ xcodebuild -workspace ios/jitsi-meet.xcworkspace -scheme JitsiMeet -destination='generic/platform=iOS' -configuration Release archive
 ```
 It will create a symlink `JitsiMeet.framework` in `jitsi-meet/ios/sdk`. Follow the symlink and copy the `JitsiMeet.framework` folder into the project where you need it. In Tabletparty iOS project, it is in `Frameworks` folder.
 ```
 $ rm -R <TARGET FOLDER>/JitsiMeet.framework
 $ cp -R <REAL PATH OF BUILT 'JitsiMeet.framework' FOLDER> <TARGET FOLDER>
```
### [Android](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-android-sdk)
##### Build in Windows
Currently building the application is not supported on Windows, for this purpose you can use the Dockerfile (and run.sh) from the dockerize-android-sdk-build branch. This contains all dependencies required by this project and a short howto on usage.

##### Build in Mac/Linux
To build the Android SDK you need to run the following command from /jitsi-meet:
```
$ cd jitsi-meet
// checkout the appropriate branch (at the time of writing, that's VS-mobile-integration)
$ npm install
$ brew install jq               # macOS
$ brew install coreutils        # macOS
$ sudo apt install coreutils jq # Linux based OSes. Substitute apt install with the approriate command/switches for whatever packaging system you use.
$ ./android/scripts/release-sdk.sh <absolute_path_to>/jitsi-maven-repo
```
This will publish the SDK as maven artifacts to the specified Maven repository, which you can add to the top-level build.gradle file of your project:
```
allprojects {
    repositories {
        maven { url "file:/<absolute_path_to>/jitsi-maven-repo" }
    }
}
```
