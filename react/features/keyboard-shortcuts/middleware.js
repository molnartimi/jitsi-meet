// @flow

import { MiddlewareRegistry } from '../base/redux';

import { OPEN_KEYBOARD_SHORTCUTS_DIALOG } from './actionTypes';

declare var APP: Object;

/**
 * Implements the middleware of the feature keyboard-shortcuts.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, keyboard-shortcuts MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    switch (action.type) {
    case OPEN_KEYBOARD_SHORTCUTS_DIALOG:
        if (typeof APP === 'object') {
            APP.keyboardshortcut.openDialog();
        }
        break;
    }

    return next(action);
} catch (e) {
    console.error('!!!___oof, keyboard-shortcuts MIDDLEWARE caught a error !!!', e);
}
});
