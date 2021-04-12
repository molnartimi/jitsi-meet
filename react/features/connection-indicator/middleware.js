// @flow

import { CONFERENCE_JOINED } from '../base/conference';
import { MiddlewareRegistry } from '../base/redux';

import { statsEmitter } from './index';

/**
 * Implements the middleware of the feature connection-indicator.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, connection-indicator MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    switch (action.type) {
    case CONFERENCE_JOINED: {
        statsEmitter.startListeningForStats(action.conference);
        break;
    }
    }

    return next(action);
} catch (e) {
    console.error('!!!___oof, connection-indicator MIDDLEWARE caught a error !!!', e);
}
});

