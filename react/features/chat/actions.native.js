// @flow

import { CHAT_MESSAGE_RECEIVED } from '../base/conference';

import { TOGGLE_CHAT } from './actionTypes';

export * from './actions.any';

/**
 * Toggles display of the chat panel.
 *
 * @returns {Function}
 */
export function toggleChat() {
    return function(dispatch: (Object) => Object) {
        dispatch({ type: TOGGLE_CHAT });
    };
}

/**
 * Send received chat message to native app.
 *
 * @param {string} roomName - Chat room name.
 * @param {string} senderId - Message id.
 * @param {string} messageText - Message object.
 * @param {any} timestamp - Timestamp of message.
 * @returns {{roomName: string, id: string, type: string, message: string, timestamp: *}}
 */
export function chatMessageReceived(roomName: string, senderId: string, messageText: string, timestamp: any) {
    return {
        type: CHAT_MESSAGE_RECEIVED,
        roomName,
        senderId,
        messageText,
        timestamp
    };
}
