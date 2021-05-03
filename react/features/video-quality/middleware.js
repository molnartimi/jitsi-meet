// @flow

import {
    CONFERENCE_JOINED,
    DATA_CHANNEL_OPENED
} from '../base/conference';
import { SET_CONFIG } from '../base/config';
import { MiddlewareRegistry, StateListenerRegistry } from '../base/redux';

import { setPreferredVideoQuality } from './actions';
import logger from './logger';

declare var APP: Object;

/**
 * Implements the middleware of the feature video-quality.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    if (action.type === DATA_CHANNEL_OPENED) {
        return _syncReceiveVideoQuality(getState, next, action);
    }

    const result = next(action);

    switch (action.type) {
    case CONFERENCE_JOINED: {
        if (navigator.product === 'ReactNative') {
            const { resolution } = getState()['features/base/config'];

            if (typeof resolution !== 'undefined') {
                dispatch(setPreferredVideoQuality(Number.parseInt(resolution, 10)));
                logger.info(`Configured preferred receiver video frame height to: ${resolution}`);
            }
        }
        break;
    }
    case SET_CONFIG: {
        const state = getState();
        const { videoQuality = {} } = state['features/base/config'];

        if (videoQuality.persist) {
            dispatch(
                setPreferredVideoQuality(
                    state['features/video-quality-persistent-storage'].persistedPrefferedVideoQuality));
        }

        break;
    }
    }

    return result;
});

/**
 * Helper function for updating the preferred receiver video constraint, based
 * on the internal maximum.
 *
 * @param {JitsiConference} conference - The JitsiConference instance for the
 * current call.
 * @param {number} max - The maximum frame height the application should
 * receive.
 * @returns {void}
 */
function _setReceiverVideoConstraint(conference, max) {
    if (conference) {
        conference.setReceiverVideoConstraint(max);
        logger.info(`setReceiverVideoConstraint: ${max}`);
    }
}

/**
 * Helper function for updating the preferred sender video constraint, based
 * on the user preference.
 *
 * @param {JitsiConference} conference - The JitsiConference instance for the
 * current call.
 * @param {number} preferred - The user preferred max frame height.
 * @returns {void}
 */
function _setSenderVideoConstraint(conference, preferred) {
    if (conference) {
        conference.setSenderVideoConstraint(preferred)
            .catch(err => {
                logger.error(`Changing sender resolution to ${preferred} failed - ${err} `);
            });
    }
}

/**
 * Sets the maximum receive video quality.
 *
 * @param {Function} getState - The redux function which returns the current redux state.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code DATA_CHANNEL_STATUS_CHANGED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _syncReceiveVideoQuality(getState, next, action) {
    const state = getState();
    const {
        conference
    } = state['features/base/conference'];
    const { maxReceiverVideoQuality } = state['features/video-quality'];

    _setReceiverVideoConstraint(conference, maxReceiverVideoQuality);

    return next(action);
}


/**
 * Registers a change handler for state['features/base/conference'] to update
 * the preferred video quality levels based on user preferred and internal
 * settings.
 */
StateListenerRegistry.register(
    /* selector */ state => {
        const { conference } = state['features/base/conference'];
        const {
            maxReceiverVideoQuality,
            preferredVideoQuality
        } = state['features/video-quality'];

        return {
            conference,
            maxReceiverVideoQuality,
            preferredVideoQuality
        };
    },
    /* listener */ (currentState, store, previousState = {}) => {
        const {
            conference,
            maxReceiverVideoQuality,
            preferredVideoQuality
        } = currentState;
        const changedConference = conference !== previousState.conference;
        const changedPreferredVideoQuality = preferredVideoQuality !== previousState.preferredVideoQuality;
        const changedMaxVideoQuality = maxReceiverVideoQuality !== previousState.maxReceiverVideoQuality;

        if (changedConference || changedMaxVideoQuality) {
            _setReceiverVideoConstraint(conference, maxReceiverVideoQuality);
        }
        if (changedConference || changedPreferredVideoQuality) {
            _setSenderVideoConstraint(conference, preferredVideoQuality);
        }

        if (typeof APP !== 'undefined' && changedPreferredVideoQuality) {
            APP.API.notifyVideoQualityChanged(preferredVideoQuality);
        }
    });
