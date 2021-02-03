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
static NSString *const UPDATE_USER_AVATAR_EVENT = @"org.jitsi.meet:features/videoconf-bridge#update-user-avatar";
static NSString *const MUTE_CONFERENCE_AUDIO = @"org.jitsi.meet:features/videoconf-bridge#mute-conference-audio";
static NSString *const SET_IS_SIMPLIFIED_CONFERENCE = @"org.jitsi.meet:features/videoconf-bridge#set-is-simplified-conference";


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
        UPDATE_USER_AVATAR_EVENT,
        MUTE_CONFERENCE_AUDIO,
        SET_IS_SIMPLIFIED_CONFERENCE];
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

- (void)updateUserAvatar:(NSString *_Nonnull) jsonString {
    [self sendEvent:UPDATE_USER_AVATAR_EVENT body:jsonString];
}

- (void)muteVideoConferenceAudio:(NSNumber *_Nonnull)mute {
    [self sendEvent:MUTE_CONFERENCE_AUDIO body:mute];
}

- (void)setIsSimplifiedConference:(NSNumber *_Nonnull)isSimplifiedConference {
    [self sendEvent:SET_IS_SIMPLIFIED_CONFERENCE body:isSimplifiedConference];
}

@end
