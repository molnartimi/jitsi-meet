import { CONFERENCE_JOINED } from '../base/conference/actionTypes';
import { MiddlewareRegistry } from '../base/redux';

import { SET_BILLING_ID } from './actionTypes';
import { countEndpoint } from './actions';
import { setBillingId } from './functions';

/**
 * The redux middleware for billing counter.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => async action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, billing-counter MIDDLEWARE caught PARTICIPANT_JOINED, no handler');
    }
    switch (action.type) {
    case SET_BILLING_ID: {
        setBillingId(action.value);

        break;
    }

    case CONFERENCE_JOINED: {
        store.dispatch(countEndpoint());

        break;
    }

    }

    return next(action);
} catch (e) {
    console.error('!!!___oof, billing-counter MIDDLEWARE caught a error !!!', e);
}
});
