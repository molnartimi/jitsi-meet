/*
 * Copyright @ 2017-present Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import java.util.Map;

/**
 * Interface for listening to events coming from Jitsi Meet.
 */
public interface JitsiMeetViewListener {
    /**
     * Called when a conference was joined.
     *
     * @param data Map with a "url" key with the conference URL.
     */
    void onConferenceJoined(Map<String, Object> data);

    /**
     * Called when the active conference ends, be it because of user choice or
     * because of a failure.
     *
     * @param data Map with an "error" key with the error and a "url" key with
     * the conference URL. If the conference finished gracefully no `error`
     * key will be present. The possible values for "error" are described here:
     * https://github.com/jitsi/lib-jitsi-meet/blob/master/JitsiConnectionErrors.js
     * https://github.com/jitsi/lib-jitsi-meet/blob/master/JitsiConferenceErrors.js
     */
    void onConferenceTerminated(Map<String, Object> data);

    /**
     * Called before the conference is joined.
     *
     * @param data Map with a "url" key with the conference URL.
     */
    void onConferenceWillJoin(Map<String, Object> data);

    /**
     * Called whenever an Xmpp method returns a response that needs to be passed to parent app.
     *
     * @param data Map with a "type" key stating the event type
     * and a "value" key carrying event specific data.
     */
    void onXmppResult(Map<String, Object> data);

    /**
     * Called when new command value received we are subscribed to.
     *
     * @param data Map with a "value" key with the stringified object of command name and command value.
     */
    void onCommandValue(Map<String, Object> data);

    /**
     * Called whenever swipe happens between conference pages.
     * @param data Map with 'index' and 'total' number of native pages
     */
    void onSwipeEvent(Map<String, Object> data);

    /**
     * Called whenever we catch an error which has no exact error handling
     * use-case in business logic.
     * @param data Map with an "errorMessage" key stating the message
     * of the catched error.
     */
    void onUndefinedJitsiError(Map<String, Object> data);
}
