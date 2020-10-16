//
//  XmppBridge.m
//  JitsiMeet
//
//  Created by Molnár Tímea on 2020. 10. 09..
//  Copyright © 2020. Jitsi. All rights reserved.
//
#import <Foundation/Foundation.h>

#import "XmppBridge.h"
#import "JitsiMeetEventEmitter+Private.h"

@implementation XmppBridge
{
  BOOL _hasListeners;
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[JitsiMeetEventEmitter sharedEmitter] registerBridge:self];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"xmpp-post-method", @"xmpp-get-method"];
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

- (void)callPostMethod:(NSString *)functionName
 withStringifiedParams:(NSArray *)params
            withPlugin:(NSString *)plugin
{
  if (_hasListeners) {
    [self sendEventWithName:@"xmpp-post-method" body:@{
        @"functionName" : functionName,
        @"stringifiedParams": params,
        @"plugin": plugin == nil ? @"" : plugin
    }];
  }
}

- (void)callGetMethod:(NSString *)functionName
 withStringifiedParams:(NSArray *)params
            withPlugin:(NSString *)plugin
{
  if (_hasListeners) {
    [self sendEventWithName:@"xmpp-get-method" body:@{
        @"functionName" : functionName,
        @"stringifiedParams": params,
        @"plugin": plugin == nil ? @"" : plugin
    }];
  }
}

@end
