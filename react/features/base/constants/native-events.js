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
    SET_CURRENT_SWIPER_INDEX: 'org.jitsi.meet:features/videoconf-bridge#set-current-swiper-index',
    PLACEHOLDER_DATA: 'org.jitsi.meet:features/videoconf-bridge#placeholder-data',
    SET_COUNTDOWN: 'org.jitsi.meet:features/videoconf-bridge#set-countdown'
};

export const ResponseEventsToNative = {
    CONNECTION_CONSTANTS: 'connection_constants'
};
