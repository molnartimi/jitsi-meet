/*
 * Copyright @ 2017-present Atlassian Pty Ltd
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

@protocol JitsiMeetViewDelegate <NSObject>

@optional

/**
 * Called when a conference was joined.
 *
 * The `data` dictionary contains a `url` key with the conference URL.
 */
- (void)conferenceJoined:(NSDictionary *)data;

/**
 * Called when the active conference ends, be it because of user choice or
 * because of a failure.
 *
 * The `data` dictionary contains an `error` key with the error and a `url` key
 * with the conference URL. If the conference finished gracefully no `error`
 * key will be present. The possible values for "error" are described here:
 * https://github.com/jitsi/lib-jitsi-meet/blob/master/JitsiConnectionErrors.js
 * https://github.com/jitsi/lib-jitsi-meet/blob/master/JitsiConferenceErrors.js
 */
- (void)conferenceTerminated:(NSDictionary *)data;

/**
 * Called before a conference is joined.
 *
 * The `data` dictionary contains a `url` key with the conference URL.
 */
- (void)conferenceWillJoin:(NSDictionary *)data;

/**
 * Called when some xmpp function result is received
 *
 * The `data` dictionary contains:
 * - resultType: string id of method for which the event belongs, eg. 'chat_message'
 * - value: value of result
*/
- (void)xmppResult:(NSDictionary *)data;

/**
 * Called when new command value received we are subscribed to.
 *
 * The `data` dictionary contains:
 * - value: stringified object of command name and command value
*/
- (void)commandValue:(NSDictionary *)data;

/**
 * Called whenever we catch an error which has no exact error handling
 * use-case in business logic.
 * The `data` dictionary contains:
 * - errorMessage: cached error message string
*/
-(void)undefinedJitsiError:(NSDictionary *)data;

/**
  * Called whenever swipe happens between conference pages.
  *
  * The `data` dictionary contains:
  * - index: actual page index
  * - total: total number of native pages
*/
- (void)swipeEvent:(NSDictionary *)data;

/**
  * Called whenever wrap up buttons are pressed.
  *
  * The `data` dictionary contains:
  * - navigationTarget: page to navigate to
*/
- (void)shopButtonEvent:(NSDictionary *)data;

/**
 * Called when entering Picture-in-Picture is requested by the user. The app
 * should now activate its Picture-in-Picture implementation (and resize the
 * associated `JitsiMeetView`. The latter will automatically detect its new size
 * and adjust its user interface to a variant appropriate for the small size
 * ordinarily associated with Picture-in-Picture.)
 *
 * The `data` dictionary is empty.
 */
- (void)enterPictureInPicture:(NSDictionary *)data;

@end
