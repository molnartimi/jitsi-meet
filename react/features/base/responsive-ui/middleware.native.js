// @flow

import { MiddlewareRegistry } from '../../base/redux';

import { CLIENT_RESIZED } from './actionTypes';
import { setAspectRatio, setReducedUI } from './actions';


/**
 * Middleware that handles widnow dimension changes and updates the aspect ratio and
 * reduced UI modes accordingly.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch }) => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, responsive-ui MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    const result = next(action);

    switch (action.type) {
    case CLIENT_RESIZED: {
        const { clientWidth: width, clientHeight: height } = action;

        dispatch(setAspectRatio(width, height));
        dispatch(setReducedUI(width, height));
        break;
    }

    }

    return result;
} catch (e) {
    console.error('!!!___oof, responsive-ui MIDDLEWARE caught a error !!!', e);
}
});
