//
//  VideoConfBridge.m
//  JitsiMeet
//
//  Created by Molnár Tímea on 2020. 10. 29..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "VideoConfBridge.h"
#import "JitsiMeetEventEmitter+Private.h"

@implementation VideoConfBridge

static NSString *const JOIN_EVENT = @"org.jitsi.meet:features/videoconf-bridge#join-conference";
static NSString *const LEAVE_EVENT = @"org.jitsi.meet:features/videoconf-bridge#leave-conference";
static NSString *const MUTE_EVENT = @"org.jitsi.meet:features/videoconf-bridge#mute-media";
static NSString *const SWITCH_CAM_EVENT = @"org.jitsi.meet:features/videoconf-bridge#switch-camera";
static NSString *const SEND_COMMAND_EVENT = @"org.jitsi.meet:features/videoconf-bridge#send-command";
static NSString *const REMOVE_COMMAND_EVENT = @"org.jitsi.meet:features/videoconf-bridge#remove-command";
static NSString *const SWIPE_TO_PAGE_EVENT = @"org.jitsi.meet:features/videoconf-bridge#set-current-swiper-index";
static NSString *const SHOW_WRAP_UP_BUTTONS = @"org.jitsi.meet:features/videoconf-bridge#show-wrap-up-buttons";
static NSString *const PLACEHOLDER_DATA_EVENT = @"org.jitsi.meet:features/videoconf-bridge#placeholder-data";
static NSString *const SET_COUNTDOWN_EVENT = @"org.jitsi.meet:features/videoconf-bridge#set-countdown";
static NSString *const SHOW_SPEAKER_VIEW_EVENT = @"org.jitsi.meet:features/videoconf-bridge#show-speaker-view";
static NSString *const UPDATE_AVATAR_EVENT = @"org.jitsi.meet:features/videoconf-bridge#update-avatar";
static NSString *const ADD_COMMAND_LISTENER_EVENT = @"org.jitsi.meet:features/videoconf-bridge#add-command-listener";
static NSString *const TAP_MENU_EVENT = @"org.jitsi.meet:features/videoconf-bridge#open-tap-menu";

RCT_EXPORT_MODULE();

- (void)registerSelfToEventEmitter {
    [[JitsiMeetEventEmitter sharedEmitter] registerVideoConfBridge:self];
}


- (NSArray<NSString *> *)supportedEvents {
  return @[JOIN_EVENT,
        LEAVE_EVENT,
        MUTE_EVENT,
        SWITCH_CAM_EVENT,
        SEND_COMMAND_EVENT,
        REMOVE_COMMAND_EVENT,
        PLACEHOLDER_DATA_EVENT,
        SWIPE_TO_PAGE_EVENT,
        SET_COUNTDOWN_EVENT,
        SHOW_SPEAKER_VIEW_EVENT,
        UPDATE_AVATAR_EVENT];
}

- (void)join:(NSString *)dataJsonString {
    [self sendEvent:JOIN_EVENT body:dataJsonString];
}

- (void)leave {
    [self sendEvent:LEAVE_EVENT body:nil];
}

- (void)muteMedia:(NSString *_Nonnull)dataJsonString {
    [self sendEvent:MUTE_EVENT body:dataJsonString];
}

- (void)switchCamera {
    [self sendEvent:SWITCH_CAM_EVENT body:nil];
}

- (void)sendCommand:(NSString *_Nonnull)dataJsonString {
    [self sendEvent:SEND_COMMAND_EVENT body:dataJsonString];
}

- (void)removeCommand:(NSString *_Nonnull)commandName {
    [self sendEvent:REMOVE_COMMAND_EVENT body:commandName];
}

- (void)sendPlaceholderData:(NSString *_Nonnull)data {
    [self sendEvent:PLACEHOLDER_DATA_EVENT body:data];
}

- (void)setCurrentSwiperIndex:(NSString *_Nonnull)pageNumber {
    [self sendEvent:SWIPE_TO_PAGE_EVENT body:pageNumber];
}

- (void)showWrapUpButtons {
    [self sendEvent:SHOW_WRAP_UP_BUTTONS body:nil];
}

- (void)setCountdown:(NSString *_Nonnull)jsonString {
    [self sendEvent:SET_COUNTDOWN_EVENT body:jsonString];
}

- (void)showSpeakerView:(NSNumber *_Nonnull)show {
    [self sendEvent:SHOW_SPEAKER_VIEW_EVENT body:show];
}

- (void)updateAvatar:(NSString *_Nonnull)dataJsonString {
    [self sendEvent:UPDATE_AVATAR_EVENT body:dataJsonString];
}

- (void)addCommandListener:(NSString *_Nonnull)commandName {
    [self sendEvent:ADD_COMMAND_LISTENER_EVENT body:commandName];
}

@end
