//
//  BridgeBase.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 29..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface BridgeBase : RCTEventEmitter <RCTBridgeModule>

- (void)registerSelfToEventEmitter;
- (void)startObserving;
- (void)stopObserving;
- (void)sendEvent:(NSString *)eventName body:(id)body;
- (NSArray<NSString *> *)supportedEvents;

@end
