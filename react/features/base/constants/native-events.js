// @flow

export const NativeEvents = {
    XMPP_POST_METHOD: 'org.jitsi.meet:features/xmpp-bridge#xmpp-post-method',
    XMPP_GET_METHOD: 'org.jitsi.meet:features/xmpp-bridge#xmpp-get-method',
    VIDEOCONF_JOIN: 'org.jitsi.meet:features/videoconf-bridge#join-conference',
    VIDEOCONF_LEAVE: 'org.jitsi.meet:features/videoconf-bridge#leave-conference',
    MUTE_MEDIA: 'org.jitsi.meet:features/videoconf-bridge#mute-media',
    SWITCH_CAMERA: 'org.jitsi.meet:features/videoconf-bridge#switch-camera',
    SEND_COMMAND: 'org.jitsi.meet:features/videoconf-bridge#send-command',
    REMOVE_COMMAND: 'org.jitsi.meet:features/videoconf-bridge#remove-command',
    ADD_COMMAND_LISTENER: 'org.jitsi.meet:features/videoconf-bridge#add-command-listener',
    SHOW_SPEAKER_VIEW: 'org.jitsi.meet:features/videoconf-bridge#show-speaker-view'
};

export const ResponseEventsToNative = {
    CONNECTION_CONSTANTS: 'connection_constants'
};
