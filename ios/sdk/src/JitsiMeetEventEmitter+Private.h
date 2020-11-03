//
//  JitsiMeetEventEmitter+Private.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. Jitsi. All rights reserved.
//

#import "JitsiMeetEventEmitter.h"
#import "XmppBridge.h"
#import "VideoConfBridge.h"

@interface JitsiMeetEventEmitter ()

- (void)registerXmppBridge:(XmppBridge *_Nonnull)bridge;
- (void)registerVideoConfBridge:(VideoConfBridge *_Nonnull)bridge;

@end

