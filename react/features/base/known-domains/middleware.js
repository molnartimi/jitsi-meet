// @flow

import { getDefaultURL } from '../../app/functions';
import { APP_WILL_MOUNT } from '../app';
import { SET_ROOM } from '../conference';
import { MiddlewareRegistry } from '../redux';
import { parseURIString } from '../util';

import { addKnownDomains } from './actions';

MiddlewareRegistry.register(store => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, known-domains MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        _appWillMount(store);
        break;

    case SET_ROOM:
        _setRoom(store);
        break;
    }

    return result;
} catch (e) {
    console.error('!!!___oof, known-domains MIDDLEWARE caught a error !!!', e);
}
});

/**
 * Adds the domain of the app's {@code defaultURL} to the list of domains known
 * to the feature base/known-domains.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {Promise}
 */
function _appWillMount({ dispatch, getState }) {
    const defaultURL = parseURIString(getDefaultURL(getState));

    dispatch(addKnownDomains(defaultURL.host));
}

/**
 * Adds the domain of {@code locationURL} to the list of domains known to the
 * feature base/known-domains.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {Promise}
 */
function _setRoom({ dispatch, getState }) {
    const { locationURL } = getState()['features/base/connection'];
    let host;

    locationURL
        && (host = locationURL.host)
        && dispatch(addKnownDomains(host));
}
