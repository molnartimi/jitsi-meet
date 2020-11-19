// @flow

export const NativeEvents = {
    XMPP_POST_METHOD: 'org.jitsi.meet:features/xmpp-bridge#xmpp-post-method',
    XMPP_GET_METHOD: 'org.jitsi.meet:features/xmpp-bridge#xmpp-get-method',
    VIDEOCONF_JOIN: 'org.jitsi.meet:features/videoconf-bridge#join-conference',
    VIDEOCONF_LEAVE: 'org.jitsi.meet:features/videoconf-bridge#leave-conference',
    MUTE_MEDIA: 'org.jitsi.meet:features/videoconf-bridge#mute-media',
    SWITCH_CAMERA: 'org.jitsi.meet:features/videoconf-bridge#switch-camera',
    SHOW_SPEAKER_VIEW: 'org.jitsi.meet:features/videoconf-bridge#show-speaker-view',
};

export const ResponseEventsToNative = {
    CONNECTION_CONSTANTS: 'connection_constants'
};
