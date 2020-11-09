/*
 * Copyright © 2020. cabi LLC. All rights reserved.
 */

package org.jitsi.meet.sdk;

import org.jitsi.meet.sdk.ReactInstanceManagerHolder;

public class XmppBridge {

    /**
     * Xmpp post method event.
     */
    private static final String XMPP_POST_METHOD = "org.jitsi.meet:features/xmpp-bridge#xmpp-post-method";

    /**
     * Xmpp get method event.
     */
    private static final String XMPP_GET_METHOD = "org.jitsi.meet:features/xmpp-bridge#xmpp-get-method";

    /**
     * Sends an Xmpp post method to React Native.
     */
    public static void callPostMethod(Object data) {
        ReactInstanceManagerHolder.emitEvent(XMPP_POST_METHOD, data);
    }

    /**
     * Sends an Xmpp get method to React Native.
     */
    public static void callGetMethod(Object data) {
        ReactInstanceManagerHolder.emitEvent(XMPP_GET_METHOD, data);
    }
}
