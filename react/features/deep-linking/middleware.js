// @flow

import { MiddlewareRegistry } from '../base/redux';

import { OPEN_DESKTOP_APP } from './actionTypes';
import { openDesktopApp } from './functions';

/**
 * Implements the middleware of the deep linking feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, deep-linking MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    switch (action.type) {
    case OPEN_DESKTOP_APP:
        openDesktopApp(store.getState());
        break;
    }

    return next(action);
} catch (e) {
    console.error('!!!___oof, deep-linking MIDDLEWARE caught a error !!!', e);
}
});
