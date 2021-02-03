//
//  JitsiMeetEventEmitter.m
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 12..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "JitsiMeetEventEmitter+Private.h"
#import "XmppBridge.h"
#import "VideoConfBridge.h"

@implementation JitsiMeetEventEmitter {
    XmppBridge *_xmppBridge;
    VideoConfBridge *_videoConfBridge;
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

- (void)registerXmppBridge:(XmppBridge *)bridge {
    _xmppBridge = bridge;
}

- (void)registerVideoConfBridge:(VideoConfBridge *)bridge {
    _videoConfBridge = bridge;
}

- (void)joinConference:(NSString *_Nonnull)dataJsonString {
    [_videoConfBridge join:dataJsonString];
}

- (void)leaveConference {
    [_videoConfBridge leave];
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

- (void)muteMedia:(NSString *_Nonnull)dataJsonString {
    [_videoConfBridge muteMedia:dataJsonString];
}

- (void)switchCamera {
    [_videoConfBridge switchCamera];
}

- (void)sendCommand:(NSString *_Nonnull)dataJsonString {
    [_videoConfBridge sendCommand:dataJsonString];
}

- (void)removeCommand:(NSString *_Nonnull)commandName {
    [_videoConfBridge removeCommand:commandName];
}

- (void)sendPlaceholderData:(NSString *_Nonnull)data {
    [_videoConfBridge sendPlaceholderData:data];
}

- (void)setCurrentSwiperIndex:(NSString *_Nonnull)pageNumber {
    [_videoConfBridge setCurrentSwiperIndex:pageNumber];
}

- (void)showWrapUpButtons {
    [_videoConfBridge showWrapUpButtons];
}

- (void)setCountdown:(NSString *_Nonnull)jsonString {
    [_videoConfBridge setCountdown:jsonString];
}

- (void)showSpeakerView:(NSNumber *_Nonnull)show {
    [_videoConfBridge showSpeakerView:show];
}

- (void)updateUserAvatar:(NSString *_Nonnull) jsonString {
    [_videoConfBridge updateUserAvatar:jsonString];
}

- (void)muteVideoConferenceAudio:(NSNumber *_Nonnull)mute {
    [_videoConfBridge muteVideoConferenceAudio:mute];
}

- (void)setIsSimplifiedConference:(NSNumber *_Nonnull)isSimplifiedConference {
    [_videoConfBridge setIsSimplifiedConference:isSimplifiedConference];
}

@end
