//
//  XmppBridge.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 09..
//  Copyright © 2020. cabi LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "BridgeBase.h"

@interface XmppBridge : BridgeBase

- (void)callPostMethod:(NSString *_Nonnull) functionName
 withStringifiedParams:(NSString *_Nonnull) params
            withPlugin:(NSString *_Nullable) plugin;

- (void)callGetMethod:(NSString *_Nonnull) functionName
 withStringifiedParams:(NSString *_Nonnull) params
            withPlugin:(NSString *_Nullable) plugin;

@end
