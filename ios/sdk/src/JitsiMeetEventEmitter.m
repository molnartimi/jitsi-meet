//
//  JitsiMeetEventEmitter.m
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. Jitsi. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "JitsiMeetEventEmitter+Private.h"
#import "XmppBridge.h"

@implementation JitsiMeetEventEmitter {
    XmppBridge *_xmppBridge;
}
   
#pragma mark Singleton Method

+ (id)sharedEmitter {
    static JitsiMeetEventEmitter *sharedEventEmitter = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedEventEmitter = [[self alloc] init];
    });
    return sharedEventEmitter;
}

#pragma mark Public methods

- (void)registerBridge:(XmppBridge *)bridge {
    _xmppBridge = bridge;
}

- (void)callPostMethod:(NSString *)functionName
 withStringifiedParams:(NSString *)params
            withPlugin:(NSString *)plugin {
    [_xmppBridge callPostMethod:functionName
          withStringifiedParams:params
                     withPlugin:plugin];
}

- (void)callGetMethod:(NSString *)functionName
 withStringifiedParams:(NSString *)params
            withPlugin:(NSString *)plugin {
    [_xmppBridge callGetMethod:functionName
          withStringifiedParams:params
                     withPlugin:plugin];
}

@end
