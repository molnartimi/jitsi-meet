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
 $ ./ios/scripts/release-sdk.sh <absolute_path_to_tap_ios_repo> <optional false parameter if you would like to skip 'clean' part of the build (a bit faster this way)>
 ```

### [Android](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-android-sdk)
##### Build in Windows
Currently building the application is not supported on Windows. 
For being able to build jitsi-SDK on Windows we created a docker container so the build process can be executed inside the container.

You have two options to use the docker container. It can be started by using docker-compose or you can build and start the container by using the docker command line interface. Both will end up with the same docker container, choose based on your personal preference. 

###### Using docker-compose
First of you need to set the absolute path of the jitsi-meet workspace in the .env file. (If you want to change the path of the targeted maven repository, you can also do that in the .env file.)
Then for using the docker container for building the SDK please do the followings:
```
$ cd jitsi-meet
$ docker-compose up -d
```
Now you have the running docker container that can be used for building the SDK. Go and jump to the common part.

###### Using docker CLI
First you need to build the docker image with this command:
```
$ docker build -t jitsi-build .
```
Then you can start the docker container:
```
$ docker run -d -it --name jitsi-build --mount type=bind,source=<ABSOLUTE_PATH_TO>/jitsi-meet,target=/jitsi-meet --mount type=bind,source=<ABSOLUTE_PATH_TO>/jitsi-maven-repository,target=/jitsi-maven-repository -v /jitsi-meet/node_modules -v /jitsi-meet/android/scripts -p 4300:8080 -p 4301:8081 -p 5555:5555 jitsi-build 
```
The `<ABSOLUTE_PATH_TO>/jitsi-meet` should be the full path of your jitsi-meet workspace. 
The `<ABSOLUTE_PATH_TO>/jitsi-maven-repository` should be the full path of the maven repository where you want to push the SDK binary, something like `c:\users\{USER_NAME}\.m2\repository`.

Now you have the running docker container that can be used for building the SDK. From this point you can follow the instructions above in the common part.

###### Common part

```
$ docker exec -it jitsi-build /bin/bash 
# npm i
# ./android/scripts/release-sdk.sh /jitsi-maven-repository dev
```

**Notes:**

 - Once the build is ready, you'll find your results in the `~\.m2\repository\org\jitsi\react\jitsi-meet-sdk` folder.
 - By passing the `dev` argument to the `release-sdk.sh` script the current git head revisionID will be appended to the version of the SDK. This is useful especially when you're switching between different branches because it keeps the different SDK versions in your maven repository, so you don't have to rebuild the SDK on each branch. 
 - If you want to produce a production SDK build, then do not pass the `dev` argument. Production build is the default. 
 - Note that node modules are managed separately (they are excluded from the mount to speed up the build process). If you need to change package.json after building the container, you'll need to run 'docker exec -it jitsi-build npm i' before your next build.
 - Also note, that the scripts folder isn't mounted, but rather the files are copied inside the continer. So if you make any changes in the buld script, you need to copy the file to the container again: `docker cp release-sdk.sh jitsi-build:/jitsi-meet/android/scripts/release-sdk.sh`

###### How to deploy the react-native frontend to an external device

1) Connect an external device to the same wifi network you use for your dev machine
2) Run `adb start-server` and `adb tcpip 5555` on your host machine
3) Run `adb connect <DEVICE_IP>` in the docker container
   If `adb devices` lists your device as unauthorized, you'll need to allow your dev machine to connect to the device
   Make sure the device remembers this decision
   Run `adb disconnect <DEVICE_IP> && adb connect <DEVICE_IP>` in the container
4) Run `npx react-native start` in a separate docker terminal
5) After that's finished, run `npx react-native run-android`

##### Build in Mac/Linux
To build the jitsi meet SDK for android, run the following commands from the project' root directory:
```
$ cd jitsi-meet
// checkout the appropriate branch (at the time of writing, that's VS-mobile-integration)
$ npm install
$ brew install jq               # macOS
$ brew install coreutils        # macOS
$ sudo apt install coreutils jq # Linux based OSes. Substitute apt install with the approriate command/switches for whatever packaging system you use.
$ ./android/scripts/release-sdk.sh <absolute_path_to>/jitsi-maven-repo
```

Last command will build the SDK & publish the built SDK as maven artifacts to the specified Maven repository.
