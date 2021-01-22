/*
 * Copyright @ 2017-present 8x8, Inc.
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

import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;

import org.jitsi.meet.sdk.log.JitsiMeetLogger;
import org.jitsi.meet.sdk.XmppBridge;
import org.jitsi.meet.sdk.VideoConfBridge;

import java.lang.reflect.Method;
import java.util.Map;


public class JitsiMeetView extends BaseReactView<JitsiMeetViewListener>
        implements OngoingConferenceTracker.OngoingConferenceListener {

    /**
     * The {@code Method}s of {@code JitsiMeetViewListener} by event name i.e.
     * redux action types.
     */
    private static final Map<String, Method> LISTENER_METHODS
        = ListenerUtils.mapListenerMethods(JitsiMeetViewListener.class);

    /**
     * The URL of the current conference.
     */
    // XXX Currently, one thread writes and one thread reads, so it should be
    // fine to have this field volatile without additional synchronization.
    private volatile String url;

    /**
     * Helper method to recursively merge 2 {@link Bundle} objects representing React Native props.
     *
     * @param a - The first {@link Bundle}.
     * @param b - The second {@link Bundle}.
     * @return The merged {@link Bundle} object.
     */
    private static Bundle mergeProps(@Nullable Bundle a, @Nullable Bundle b) {
        Bundle result = new Bundle();

        if (a == null) {
            if (b != null) {
                result.putAll(b);
            }

            return result;
        }

        if (b == null) {
            result.putAll(a);

            return result;
        }

        // Start by putting all of a in the result.
        result.putAll(a);

        // Iterate over each key in b and override if appropriate.
        for (String key : b.keySet()) {
            Object bValue = b.get(key);
            Object aValue = a.get(key);
            String valueType = bValue.getClass().getSimpleName();

            if (valueType.contentEquals("Boolean")) {
                result.putBoolean(key, (Boolean)bValue);
            } else if (valueType.contentEquals("String")) {
                result.putString(key, (String)bValue);
            } else if (valueType.contentEquals("Bundle")) {
                result.putBundle(key, mergeProps((Bundle)aValue, (Bundle)bValue));
            } else {
                throw new RuntimeException("Unsupported type: " + valueType);
            }
        }

        return result;
    }

    public JitsiMeetView(@NonNull Context context) {
        super(context);

        // Check if the parent Activity implements JitsiMeetActivityInterface,
        // otherwise things may go wrong.
        if (!(context instanceof JitsiMeetActivityInterface)) {
            throw new RuntimeException("Enclosing Activity must implement JitsiMeetActivityInterface");
        }

        OngoingConferenceTracker.getInstance().addListener(this);
    }

    @Override
    public void dispose() {
        OngoingConferenceTracker.getInstance().removeListener(this);
        super.dispose();
    }

    /**
     * Enters Picture-In-Picture mode, if possible. This method is designed to
     * be called from the {@code Activity.onUserLeaveHint} method.
     *
     * This is currently not mandatory, but if used will provide automatic
     * handling of the picture in picture mode when user minimizes the app. It
     * will be probably the most useful in case the app is using the welcome
     * page.
     */
    public void enterPictureInPicture() {
        PictureInPictureModule pipModule
            = ReactInstanceManagerHolder.getNativeModule(
                PictureInPictureModule.class);
        if (pipModule != null
                && pipModule.isPictureInPictureSupported()
                && !JitsiMeetActivityDelegate.arePermissionsBeingRequested()
                && this.url != null) {
            try {
                pipModule.enterPictureInPicture();
            } catch (RuntimeException re) {
                JitsiMeetLogger.e(re, "Failed to enter PiP mode");
            }
        }
    }

    /**
     * Joins the conference specified by the given {@link JitsiMeetConferenceOptions}. If there is
     * already an active conference, it will be left and the new one will be joined.
     * @param options - Description of what conference must be joined and what options will be used
     *                when doing so.
     */
    public void join(@Nullable JitsiMeetConferenceOptions options) {
        setProps(options != null ? options.asProps() : new Bundle());
    }

    /**
     * Joins the specified conference room. Config options should be set by xmppConnect beforehand.
     */
    public void joinConference(String dataJsonString) {
        VideoConfBridge.joinConference(dataJsonString);
    }

    /**
     * Leaves the currently active conference, tears down the established Xmpp Connection.
     */
    public void leave() {
        setProps(new Bundle());
    }

    /**
     * Leaves the currently active conference without tearing down the established Xmpp Connection.
     */
    public void leaveConference() {
        VideoConfBridge.leaveConference();
    }

    /**
     * Establishes an Xmpp Connection specified by the given {@link JitsiMeetConferenceOptions}.
     * @param options - Description of what conference must be joined and what options will be used
     *                when doing so.
     */
    public void xmppConnect(@Nullable JitsiMeetConferenceOptions options) {
        setProps(options != null ? options.asProps() : new Bundle());
    }

    /**
     * Mute/unmute mic/cam described by stringified data json parameter:
     * {
     *   kind: 'audioinput' or 'videoinput',
     *   muted: boolean
     * }
     */
    public void muteMedia(String dataJsonString) {
        VideoConfBridge.muteMedia(dataJsonString);
    }

    /**
     * Switch camera between front-back.
     */
    public void switchCamera() {
        VideoConfBridge.switchCamera();
    }

    /**
     * Switches between conference and speaker frame view.
     */
    public void showSpeakerView(boolean shouldShow) {
        VideoConfBridge.showSpeakerView(shouldShow);
    }

    /**
     * Sends an Xmpp post method to React Native through XmppBridge.
     */
    public void callXmppPostMethod(Object data) {
        XmppBridge.callPostMethod(data);
    }

    /**
     * Sends an Xmpp get method to React Native through XmppBridge.
     */
    public void callXmppGetMethod(Object data) {
        XmppBridge.callGetMethod(data);
    }

    /**
     * Sends a Jitsi command to conference.
     */
    public void sendJitsiCommand(String data) {
        VideoConfBridge.sendJitsiCommand(data);
    }

    /**
     * Remove a Jitsi command from presence.
     */
    public void removeJitsiCommand(String commandName) {
        VideoConfBridge.removeJitsiCommand(commandName);
    }

    /**
     * Sends in-focus placeholder data to React Native.
     */
    public void sendPlaceholderData(String data) {
        VideoConfBridge.sendPlaceholderData(data);
    }

    /**
     * Swipe to given page.
     */
    public void setCurrentSwiperIndex(String pageNumber) {
        VideoConfBridge.setCurrentSwiperIndex(pageNumber);
    }

    /**
     * Show wrap-up buttons.
     */
    public void showWrapUpButtons() {
        VideoConfBridge.showWrapUpButtons();
    }

    /**
     * Set pre show countdown date time.
     */
    public static void setCountdown(String jsonString) {
        VideoConfBridge.setCountdown(jsonString);
    }

    /**
     * Update video conference user profile image.
     */
    public static void updateUserAvatar(String jsonString) {
        VideoConfBridge.updateUserAvatar(jsonString);
    }

    /**
     * Helper method to set the React Native props.
     * @param newProps - New props to be set on the React Native view.
     */
    private void setProps(@NonNull Bundle newProps) {
        // Merge the default options with the newly provided ones.
        Bundle props = mergeProps(JitsiMeet.getDefaultProps(), newProps);

        // XXX The setProps() method is supposed to be imperative i.e.
        // a second invocation with one and the same URL is expected to join
        // the respective conference again if the first invocation was followed
        // by leaving the conference. However, React and, respectively,
        // appProperties/initialProperties are declarative expressions i.e. one
        // and the same URL will not trigger an automatic re-render in the
        // JavaScript source code. The workaround implemented bellow introduces
        // "imperativeness" in React Component props by defining a unique value
        // per setProps() invocation.
        props.putLong("timestamp", System.currentTimeMillis());

        createReactRootView("App", props);
    }

    /**
     * Handler for {@link OngoingConferenceTracker} events.
     * @param conferenceUrl
     */
    @Override
    public void onCurrentConferenceChanged(String conferenceUrl) {
        // This property was introduced in order to address
        // an exception in the Picture-in-Picture functionality which arose
        // because of delays related to bridging between JavaScript and Java. To
        // reduce these delays do not wait for the call to be transferred to the
        // UI thread.
        this.url = conferenceUrl;
    }

    /**
     * Handler for {@link ExternalAPIModule} events.
     *
     * @param name The name of the event.
     * @param data The details/specifics of the event to send determined
     * by/associated with the specified {@code name}.
     */
    @Override
    protected void onExternalAPIEvent(String name, ReadableMap data) {
        onExternalAPIEvent(LISTENER_METHODS, name, data);
    }

    @Override
    protected void onDetachedFromWindow() {
        dispose();
        super.onDetachedFromWindow();
    }
}
