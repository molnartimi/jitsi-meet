//
//  JitsiMeetEventEmitter.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. Jitsi. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Singleton class to save XmppBridge instance initialized by React Native.
 * We can sending events from native to JS with it.
 */
@interface JitsiMeetEventEmitter : NSObject

+ (id)sharedEmitter;
- (void)callPostMethod:(NSString *_Nonnull)functionName
 withStringifiedParams:(NSString *_Nonnull)params
            withPlugin:(NSString *_Nullable)plugin;
- (void)callGetMethod:(NSString *_Nonnull)functionName
withStringifiedParams:(NSString *_Nonnull)params
           withPlugin:(NSString *_Nullable)plugin;

@end
