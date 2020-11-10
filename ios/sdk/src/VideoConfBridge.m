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
static NSString *const TAP_MENU_EVENT = @"org.jitsi.meet:features/videoconf-bridge#open-tap-menu";

RCT_EXPORT_MODULE();

- (void)registerSelfToEventEmitter {
    [[JitsiMeetEventEmitter sharedEmitter] registerVideoConfBridge:self];
}


- (NSArray<NSString *> *)supportedEvents {
  return @[JOIN_EVENT, LEAVE_EVENT, MUTE_EVENT, SWITCH_CAM_EVENT, TAP_MENU_EVENT];
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

@end
