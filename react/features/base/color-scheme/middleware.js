// @flow

import { MiddlewareRegistry } from '../redux';

import ColorSchemeRegistry from './ColorSchemeRegistry';
import { SET_COLOR_SCHEME } from './actionTypes';

/**
 * The middleware of the feature {@code base/color-scheme}.
 *
 * @returns {Function}
 */
MiddlewareRegistry.register((/* store */) => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, color-scheme MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    switch (action.type) {
    case SET_COLOR_SCHEME:
        return ColorSchemeRegistry.clear();
    }

    return next(action);
} catch (e) {
    console.error('!!!___oof, color-scheme MIDDLEWARE caught a error !!!', e);
}
});
