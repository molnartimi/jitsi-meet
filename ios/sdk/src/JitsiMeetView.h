/*
 * Copyright @ 2018-present 8x8, Inc.
 * Copyright @ 2017-2018 Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "JitsiMeetConferenceOptions.h"
#import "JitsiMeetViewDelegate.h"

@interface JitsiMeetView : UIView

@property (nonatomic, nullable, weak) id<JitsiMeetViewDelegate> delegate;

/**
 * Joins the conference specified by the given options. The gievn options will
 * be merged with the defaultConferenceOptions (if set) in JitsiMeet. If there
 * is an already active conference it will be automatically left prior to
 * joining the new one.
 */
- (void)join:(JitsiMeetConferenceOptions *_Nullable)options;

/**
 * Create xmpp connection with given config.
 */
- (void)xmppConnect:(JitsiMeetConferenceOptions *_Nullable)options;

/**
 * Joins the specified conference room. Stringified parameter contains the room name and the initial muted state of the medias.
 * Other config options are already set by xmppConnect.
 */
- (void)joinConference:(NSString *_Nonnull)dataJsonString;

/**
 * Leaves the currently active conference and also disconnect from Strophe.
 */
- (void)leave;

/**
 * Leaves the currently active conference without tearing down the established Xmpp Connection.
 */
- (void)leaveConference;

/**
 * Sends an Xmpp post method to React Native through XmppBridge.
 */
- (void)callXmppPostMethod:(NSString *_Nonnull)functionName
     withStringifiedParams:(NSString *_Nonnull)params
                withPlugin:(NSString *_Nullable)plugin;

/**
 * Sends an Xmpp get method to React Native through XmppBridge.
 */
- (void)callXmppGetMethod:(NSString *_Nonnull)functionName
    withStringifiedParams:(NSString *_Nonnull)params
               withPlugin:(NSString *_Nullable)plugin;

/**
 * Mute/unmute mic/cam described by stringified data json parameter:
 * {
 *   kind: 'audioinput' or 'videoinput',
 *   muted: boolean
 * }
 */
- (void)muteMedia:(NSString *_Nonnull)dataJsonString;

/**
 * Switch camera between front-back.
 */
- (void)switchCamera;

/**
 * Send jitsi command in confernce.
 */
- (void)sendJitsiCommand:(NSString *_Nonnull)dataJsonString;

/**
 * Remove jitsi command from presence.
 */
- (void)removeJitsiCommand:(NSString *_Nonnull)commandName;

/**
 * Send placeholder data.
 */
- (void)sendPlaceholderData:(NSString *_Nonnull)data;

@end
