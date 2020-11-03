//
//  BridgeBase.m
//  JitsiMeet
//
//  Created by Molnár Tímea on 2020. 10. 29..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "JitsiMeetEventEmitter+Private.h"
#import "BridgeBase.h"

@implementation BridgeBase
{
  BOOL _hasListeners;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self registerSelfToEventEmitter];
    }
    return self;
}

// Will be called when this module's first listener is added.
- (void)startObserving
{
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving
{
  _hasListeners = NO;
}

- (void)sendEvent:(NSString *)eventName body:(id)body {
    if (_hasListeners) {
        [self sendEventWithName:eventName body:body];
    }
}

@end
