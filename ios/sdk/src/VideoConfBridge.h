//
//  VideoConfBridge.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 29..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "BridgeBase.h"

@interface VideoConfBridge : BridgeBase

- (void)join:(NSString *_Nonnull)dataJsonString;
- (void)leave;
- (void)muteMedia:(NSString *_Nonnull)dataJsonString;
- (void)switchCamera;
- (void)sendCommand:(NSString *_Nonnull)dataJsonString;
- (void)removeCommand:(NSString *_Nonnull)commandName;
- (void)setCurrentSwiperIndex:(NSString *_Nonnull)pageNumber;
- (void)showWrapUpButtons;
- (void)sendPlaceholderData:(NSString *_Nonnull)data;
- (void)setCountdown:(NSString *_Nonnull)jsonString;
- (void)showSpeakerView:(NSNumber *_Nonnull)show;
- (void)updateUserAvatar:(NSString *_Nonnull) jsonString;
- (void)muteVideoConferenceAudio:(NSNumber *_Nonnull)mute;

@end
