//
//  XmppBridge.h
//  sdk
//
//  Created by Molnár Tímea on 2020. 10. 09..
//  Copyright © 2020. Jitsi. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface XmppBridge : RCTEventEmitter <RCTBridgeModule>

- (void)callPostMethod:(NSString *) functionName
            withParams:(NSArray *) params
            withPlugin:(NSString *) plugin;

@end
