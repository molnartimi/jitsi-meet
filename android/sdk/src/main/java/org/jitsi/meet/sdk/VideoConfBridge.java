/*
 * Copyright © 2020. cabi LLC. All rights reserved.
 */

package org.jitsi.meet.sdk;

public class VideoConfBridge {

    /**
     * Videoconf join event.
     */
    private static final String VIDEOCONF_JOIN = "org.jitsi.meet:features/videoconf-bridge#join-conference";

    /**
     * Videoconf leave event.
     */
    private static final String VIDEOCONF_LEAVE = "org.jitsi.meet:features/videoconf-bridge#leave-conference";

    /**
     * Media mute/unmute event.
     */
    private static final String MUTE_MEDIA = "org.jitsi.meet:features/videoconf-bridge#mute-media";

    /**
     * Switch camera.
     */
    private static final String SWITCH_CAMERA = "org.jitsi.meet:features/videoconf-bridge#switch-camera";

    /**
     * Sends a videoconf join event to React Native.
     */
    public static void joinConference(String roomName) {
        ReactInstanceManagerHolder.emitEvent(VIDEOCONF_JOIN, roomName);
    }

    /**
     * Sends a videoconf leave event to React Native.
     */
    public static void leaveConference() {
        ReactInstanceManagerHolder.emitEvent(VIDEOCONF_LEAVE, null);
    }

    /**
     * Mute/unmute mic/cam described by stringified data json parameter:
     * {
     *   kind: 'audioinput' or 'videoinput',
     *   muted: boolean
     * }
     */
    public static void muteMedia(String dataJsonString) {
        ReactInstanceManagerHolder.emitEvent(MUTE_MEDIA, dataJsonString);
    }

    /**
     * Switch camera between front-back.
     */
    public static void switchCamera() {
        ReactInstanceManagerHolder.emitEvent(SWITCH_CAMERA, null);
    }
}
