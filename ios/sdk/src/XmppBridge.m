//
//  XmppBridge.m
//  JitsiMeet
//
//  Created by Molnár Tímea on 2020. 10. 09..
//  Copyright © 2020. cabi LLC. All rights reserved.
//
#import <Foundation/Foundation.h>

#import "XmppBridge.h"
#import "JitsiMeetEventEmitter+Private.h"

@implementation XmppBridge

static NSString *const POST_EVENT = @"org.jitsi.meet:features/xmpp-bridge#xmpp-post-method";
static NSString *const GET_EVENT = @"org.jitsi.meet:features/xmpp-bridge#xmpp-get-method";

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[POST_EVENT, GET_EVENT];
}

- (void)registerSelfToEventEmitter {
    [[JitsiMeetEventEmitter sharedEmitter] registerXmppBridge:self];
}

- (void)callPostMethod:(NSString *)functionName
 withStringifiedParams:(NSArray *)params
            withPlugin:(NSString *)plugin {
    [self sendEvent:POST_EVENT body:@{
        @"functionName" : functionName,
        @"stringifiedParams": params,
        @"plugin": plugin == nil ? @"" : plugin
    }];
}

- (void)callGetMethod:(NSString *)functionName
 withStringifiedParams:(NSArray *)params
            withPlugin:(NSString *)plugin {
    [self sendEvent:GET_EVENT body:@{
        @"functionName" : functionName,
        @"stringifiedParams": params,
        @"plugin": plugin == nil ? @"" : plugin
    }];
}

@end
