import { toState } from '../base/redux';
import {
    areThereNotifications
} from '../notifications';

/**
 * Tells whether or not the notifications should be displayed within
 * the conference feature based on the current Redux state.
 *
 * @param {Object|Function} stateful - The redux store state.
 * @returns {boolean}
 */
export function shouldDisplayNotifications(stateful) {
    const state = toState(stateful);

    return areThereNotifications(state);
}
