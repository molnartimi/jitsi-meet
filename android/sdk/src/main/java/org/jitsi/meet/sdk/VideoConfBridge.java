/*
 * Copyright © 2020. cabi LLC. All rights reserved.
 */

package org.jitsi.meet.sdk;

import org.jitsi.meet.sdk.ReactInstanceManagerHolder;

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
     * Send Jitsi command.
     */
    private static final String SEND_COMMAND = "org.jitsi.meet:features/videoconf-bridge#send-command";

    /**
     * Remove Jitsi command.
     */
    private static final String REMOVE_COMMAND = "org.jitsi.meet:features/videoconf-bridge#remove-command";

    /**
     * Set current swiper index.
     */
    private static final String SET_CURRENT_SWIPER_INDEX = "org.jitsi.meet:features/videoconf-bridge#set-current-swiper-index";

    /**
     * In-focus placeholder data.
     */
    private static final String PLACEHOLDER_DATA = "org.jitsi.meet:features/videoconf-bridge#placeholder-data";

    /**
     * Sends a videoconf join event to React Native.
     */
    public static void joinConference(String dataJsonString) {
        ReactInstanceManagerHolder.emitEvent(VIDEOCONF_JOIN, dataJsonString);
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

    /**
     * Send jitsi command in confernce.
     */
    public static void sendJitsiCommand(String dataJsonString) {
        ReactInstanceManagerHolder.emitEvent(SEND_COMMAND, dataJsonString);
    }

    /**
     * Remove jitsi command from presence.
     */
    public static void removeJitsiCommand(String commandName) {
        ReactInstanceManagerHolder.emitEvent(REMOVE_COMMAND, commandName);
    }

    /**
     * Swipe to given page.
     */
    public static void setCurrentSwiperIndex(String pageNumber) {
        ReactInstanceManagerHolder.emitEvent(SET_CURRENT_SWIPER_INDEX, pageNumber);
    }

    /**
     * Sends in-focus placeholder data to React Native.
     */
    public static void sendPlaceholderData(String data) {
        ReactInstanceManagerHolder.emitEvent(PLACEHOLDER_DATA, data);
    }
}
