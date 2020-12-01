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
static NSString *const ADD_COMMAND_LISTENER_EVENT = @"org.jitsi.meet:features/videoconf-bridge#add-command-listener";
static NSString *const TAP_MENU_EVENT = @"org.jitsi.meet:features/videoconf-bridge#open-tap-menu";

RCT_EXPORT_MODULE();

- (void)registerSelfToEventEmitter {
    [[JitsiMeetEventEmitter sharedEmitter] registerVideoConfBridge:self];
}


- (NSArray<NSString *> *)supportedEvents {
  return @[JOIN_EVENT, LEAVE_EVENT, MUTE_EVENT, SWITCH_CAM_EVENT,
           SEND_COMMAND_EVENT, REMOVE_COMMAND_EVENT, ADD_COMMAND_LISTENER_EVENT,
           TAP_MENU_EVENT];
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

- (void)addCommandListener:(NSString *_Nonnull)commandName {
    [self sendEvent:ADD_COMMAND_LISTENER_EVENT body:commandName];
}

@end
