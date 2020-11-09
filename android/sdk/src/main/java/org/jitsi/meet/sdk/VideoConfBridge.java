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
}
