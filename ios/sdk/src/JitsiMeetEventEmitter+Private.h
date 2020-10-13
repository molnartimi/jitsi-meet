//
//  JitsiMeetEventEmitter+Private.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. Jitsi. All rights reserved.
//

#import "JitsiMeetEventEmitter.h"
#import "XmppBridge.h"

@interface JitsiMeetEventEmitter ()

- (void)registerBridge:(XmppBridge *_Nonnull)bridge;

@end

