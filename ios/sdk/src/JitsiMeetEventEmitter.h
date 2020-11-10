//
//  JitsiMeetEventEmitter.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Singleton class to save XmppBridge instance initialized by React Native.
 * We can sending events from native to JS with it.
 */
@interface JitsiMeetEventEmitter : NSObject

+ (id)sharedEmitter;
- (void)joinConference:(NSString *_Nonnull)dataJsonString;
- (void)leaveConference;
- (void)callPostMethod:(NSString *_Nonnull)functionName
 withStringifiedParams:(NSString *_Nonnull)params
            withPlugin:(NSString *_Nullable)plugin;
- (void)callGetMethod:(NSString *_Nonnull)functionName
withStringifiedParams:(NSString *_Nonnull)params
           withPlugin:(NSString *_Nullable)plugin;
- (void)muteMedia:(NSString *_Nonnull)dataJsonString;
- (void)switchCamera;

@end
