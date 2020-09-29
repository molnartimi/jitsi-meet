FROM openjdk:8-jdk-stretch

# Install dependencies
RUN apt-get update && \
	apt-get install -y dos2unix && \
	apt-get install -y jq && \
	apt-get install -y maven && \
	apt-get install -y unzip && \
	apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs && \
	apt-get install -y npm

# Setting up environment variables
ENV SDK_URL="https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip"
ENV ANDROID_HOME="/opt/android-sdk"
ENV PATH "$PATH:$ANDROID_HOME/cmdline-tools/tools/bin"
RUN export ANDROID_HOME=$ANDROID_HOME

RUN echo $PATH

# Download Android SDK
# https://developer.android.com/studio#command-tools
RUN mkdir -p "$ANDROID_HOME"/cmdline-tools .android && \
	cd "$ANDROID_HOME"/cmdline-tools && \
	curl -o sdk.zip $SDK_URL && \
	unzip sdk.zip && \
	rm sdk.zip && \
	yes | sdkmanager --licenses

# Setting up working directories
RUN mkdir -p /jitsi-meet/android/sdk/repo && \
    mkdir -p /jitsi-meet/android/scripts
WORKDIR /jitsi-meet

# Running npm i beforehand
COPY package.json /jitsi-meet/package.json
COPY package-lock.json /jitsi-meet/package-lock.json

RUN npm i

# Copying build scripts
COPY android/scripts android/scripts
COPY android/gradlew android/gradlew
COPY android/build.gradle android/build.gradle
COPY android/sdk/build.gradle android/sdk/build.gradle

# Perform dos2unix on executables
RUN dos2unix /jitsi-meet/android/gradlew
RUN dos2unix /jitsi-meet/android/build.gradle
RUN dos2unix /jitsi-meet/android/sdk/build.gradle
RUN dos2unix /jitsi-meet/android/scripts/release-sdk.sh
RUN dos2unix /jitsi-meet/android/scripts/run-packager.sh
RUN dos2unix /jitsi-meet/android/scripts/run-packager-helper.command

# cleanup
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/*

CMD [ "/bin/bash" ]

### Run these commands from /jitsi-meet
# docker build -t jitsi-build .
# docker run -d -it --name jitsi-build --mount type=bind,source=<ABSOLUTE_PATH_TO>/jitsi-meet,target=/jitsi-meet  --mount type=bind,source=<ABSOLUTE_PATH_TO>/jitsi-maven-repository,target=/jitsi-maven-repository -v /jitsi-meet/node_modules -v /jitsi-meet/android/scripts jitsi-build
# docker exec -it jitsi-build /bin/bash
# ./android/scripts/release-sdk.sh /jitsi-maven-repository

### Note that node modules are managed separately (they are excluded from the mount to speed up the build process)
### If you need to change package.json after building the container, you'll need to run 'docker exec -it jitsi-build npm i' before your next build.
