// @flow

import * as flatted from 'flatted/esm';

import {
    CONFERENCE_FAILED,
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    CONFERENCE_WILL_JOIN,
    JITSI_CONFERENCE_URL_KEY,
    SET_ROOM,
    SWIPE_EVENT,
    COMMAND_VALUE,
    forEachConference,
    isRoomValid,
    SHOP_BUTTON_EVENT,
    LOCAL_STATS_EVENT
} from '../../base/conference';
import { LOAD_CONFIG_ERROR } from '../../base/config';
import {
    CONNECTION_DISCONNECTED,
    CONNECTION_FAILED,
    JITSI_CONNECTION_CONFERENCE_KEY,
    JITSI_CONNECTION_URL_KEY,
    XMPP_RESULT,
    getURLWithoutParams
} from '../../base/connection';
import { isAndroidDevice } from '../../base/environment/utils';
import { getLogger } from '../../base/logging';
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../../base/participants';
import { MiddlewareRegistry } from '../../base/redux';
import { TRACK_ADDED } from '../../base/tracks';
import { ENTER_PICTURE_IN_PICTURE } from '../picture-in-picture';

import { UNDEFINED_JITSI_ERROR } from './actions';
import { sendEvent } from './functions';

/**
 * Event which will be emitted on the native side to indicate the conference
 * has ended either by user request or because an error was produced.
 */
const CONFERENCE_TERMINATED = 'CONFERENCE_TERMINATED';

/**
 * Middleware that captures Redux actions and uses the ExternalAPI module to
 * turn them into native events so the application knows about them.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const logger = getLogger('features/mobile/external-api');
    const result = next(action);
    const { type } = action;

    switch (type) {
    case CONFERENCE_FAILED: {
        const { error, ...data } = action;

        // XXX Certain CONFERENCE_FAILED errors are recoverable i.e. they have
        // prevented the user from joining a specific conference but the app may
        // be able to eventually join the conference. For example, the app will
        // ask the user for a password upon
        // JitsiConferenceErrors.PASSWORD_REQUIRED and will retry joining the
        // conference afterwards. Such errors are to not reach the native
        // counterpart of the External API (or at least not in the
        // fatality/finality semantics attributed to
        // conferenceFailed:/onConferenceFailed).
        if (!error.recoverable) {
            _sendConferenceEvent(store, /* action */ {
                error: _toErrorString(error),
                ...data
            });
        }
        break;
    }

    case CONFERENCE_JOINED:
    case CONFERENCE_LEFT:
    case CONFERENCE_WILL_JOIN:
        _sendConferenceEvent(store, action);
        break;

    case CONNECTION_DISCONNECTED: {
        // FIXME: This is a hack. See the description in the JITSI_CONNECTION_CONFERENCE_KEY constant definition.
        // Check if this connection was attached to any conference. If it wasn't, fake a CONFERENCE_TERMINATED event.
        const { connection } = action;
        const conference = connection[JITSI_CONNECTION_CONFERENCE_KEY];

        if (!conference) {
            // This action will arrive late, so the locationURL stored on the state is no longer valid.
            const locationURL = connection[JITSI_CONNECTION_URL_KEY];

            sendEvent(
                store,
                CONFERENCE_TERMINATED,
                /* data */ {
                    url: _normalizeUrl(locationURL)
                });
        }

        break;
    }

    case CONNECTION_FAILED:
        !action.error.recoverable
            && _sendConferenceFailedOnConnectionError(store, action);
        break;

    case ENTER_PICTURE_IN_PICTURE:
        sendEvent(store, type, /* data */ {});
        break;

    case LOAD_CONFIG_ERROR: {
        const { error, locationURL } = action;

        sendEvent(
            store,
            CONFERENCE_TERMINATED,
            /* data */ {
                error: _toErrorString(error),
                url: _normalizeUrl(locationURL)
            });
        break;
    }

    case SET_ROOM:
        _maybeTriggerEarlyConferenceWillJoin(store, action);
        break;

    case XMPP_RESULT: {
        try {
            const value = action.value instanceof Object
                ? flatted.stringify(action.value)
                : action.value;

            sendEvent(
                store,
                XMPP_RESULT,
                {
                    type: action.resultType,
                    value
                }
            );
        } catch (e) {
            logger.error('Some error occurred at sending xmpp result event to native app', e);
            _sendErrorToNativeApp(store, e);
        }
        break;
    }

    case COMMAND_VALUE: {
        try {
            const { commandName, value } = action;
            const response = {
                commandName,
                value
            };

            sendEvent(store, COMMAND_VALUE, {
                value: flatted.stringify(response, (_, val) => escapeBackslashes(val))
            });
        } catch (e) {
            logger.error('Some error occurred at sending command value to native app', e);
            _sendErrorToNativeApp(store, e);
        }
        break;
    }

    case SWIPE_EVENT: {
        sendEvent(store, SWIPE_EVENT, {
            index: action.index,
            total: action.total
        });
        break;
    }

    case LOCAL_STATS_EVENT: {
        sendEvent(store, LOCAL_STATS_EVENT, {
            stats: action.stats
        });
        break;
    }

    case SHOP_BUTTON_EVENT: {
        sendEvent(store, SHOP_BUTTON_EVENT, {
            navigationTarget: action.navigationTarget
        });
        break;
    }

    case TRACK_ADDED: {
        if (!action.track.local) {
            sendEvent(store, TRACK_ADDED, {
                track: flatted.stringify(action.track)
            });
        }
        break;
    }

    case UNDEFINED_JITSI_ERROR: {
        _sendErrorToNativeApp(store, action.error);
        break;
    }

    case PARTICIPANT_JOINED: {
        if (action.participant.id) {
            sendEvent(store, PARTICIPANT_JOINED, { userId: escapeBackslashes(action.participant.id, true) });
        }
        break;
    }

    case PARTICIPANT_LEFT: {
        if (action.participant.id) {
            sendEvent(store, PARTICIPANT_LEFT, { userId: escapeBackslashes(action.participant.id, true) });
        }
        break;
    }
    }

    return result;
});

/**
 * Returns a {@code String} representation of a specific error {@code Object}.
 *
 * @param {Error|Object|string} error - The error {@code Object} to return a
 * {@code String} representation of.
 * @returns {string} A {@code String} representation of the specified
 * {@code error}.
 */
function _toErrorString(
        error: Error | { message: ?string, name: ?string } | string) {
    // XXX In lib-jitsi-meet and jitsi-meet we utilize errors in the form of
    // strings, Error instances, and plain objects which resemble Error.
    return (
        error
            ? typeof error === 'string'
                ? error
                : Error.prototype.toString.apply(error)
            : '');
}

/**
 * If {@link SET_ROOM} action happens for a valid conference room this method
 * will emit an early {@link CONFERENCE_WILL_JOIN} event to let the external API
 * know that a conference is being joined. Before that happens a connection must
 * be created and only then base/conference feature would emit
 * {@link CONFERENCE_WILL_JOIN}. That is fine for the Jitsi Meet app, because
 * that's the a conference instance gets created, but it's too late for
 * the external API to learn that. The latter {@link CONFERENCE_WILL_JOIN} is
 * swallowed in {@link _swallowEvent}.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action.
 * @returns {void}
 */
function _maybeTriggerEarlyConferenceWillJoin(store, action) {
    const { locationURL } = store.getState()['features/base/connection'];
    const { room } = action;

    isRoomValid(room) && locationURL && sendEvent(
        store,
        CONFERENCE_WILL_JOIN,
        /* data */ {
            url: _normalizeUrl(locationURL)
        });
}

/**
 * Normalizes the given URL for presentation over the external API.
 *
 * @param {URL} url -The URL to normalize.
 * @returns {string} - The normalized URL as a string.
 */
function _normalizeUrl(url: URL) {
    return getURLWithoutParams(url).href;
}

/**
 * Sends an event to the native counterpart of the External API for a specific
 * conference-related redux action.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action.
 * @returns {void}
 */
function _sendConferenceEvent(
        store: Object,
        action: {
            conference: Object,
            type: string,
            url: ?string
        }) {
    const { conference, type, ...data } = action;

    // For these (redux) actions, conference identifies a JitsiConference
    // instance. The external API cannot transport such an object so we have to
    // transport an "equivalent".
    if (conference) {
        data.url = _normalizeUrl(conference[JITSI_CONFERENCE_URL_KEY]);
        data.userId = escapeBackslashes(conference.myUserId());
    }

    if (_swallowEvent(store, action, data)) {
        return;
    }

    let type_;

    switch (type) {
    case CONFERENCE_FAILED:
    case CONFERENCE_LEFT:
        type_ = CONFERENCE_TERMINATED;
        break;
    default:
        type_ = type;
        break;
    }

    sendEvent(store, type_, data);
}

/**
 * Sends {@link CONFERENCE_TERMINATED} event when the {@link CONNECTION_FAILED}
 * occurs. It should be done only if the connection fails before the conference
 * instance is created. Otherwise the eventual failure event is supposed to be
 * emitted by the base/conference feature.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action.
 * @returns {void}
 */
function _sendConferenceFailedOnConnectionError(store, action) {
    const { locationURL } = store.getState()['features/base/connection'];
    const { connection } = action;

    locationURL
        && forEachConference(
            store,

            // If there's any conference in the  base/conference state then the
            // base/conference feature is supposed to emit a failure.
            conference => conference.getConnection() !== connection)
        && sendEvent(
        store,
        CONFERENCE_TERMINATED,
        /* data */ {
            url: _normalizeUrl(locationURL),
            error: action.error.name
        });
}

/**
 * Determines whether to not send a {@code CONFERENCE_LEFT} event to the native
 * counterpart of the External API.
 *
 * @param {Object} store - The redux store.
 * @param {Action} action - The redux action which is causing the sending of the
 * event.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code action}.
 * @returns {boolean} If the specified event is to not be sent, {@code true};
 * otherwise, {@code false}.
 */
function _swallowConferenceLeft({ getState }, action, { url }) {
    // XXX Internally, we work with JitsiConference instances. Externally
    // though, we deal with URL strings. The relation between the two is many to
    // one so it's technically and practically possible (by externally loading
    // the same URL string multiple times) to try to send CONFERENCE_LEFT
    // externally for a URL string which identifies a JitsiConference that the
    // app is internally legitimately working with.
    let swallowConferenceLeft = false;

    url
        && forEachConference(getState, (conference, conferenceURL) => {
            if (conferenceURL && conferenceURL.toString() === url) {
                swallowConferenceLeft = true;
            }

            return !swallowConferenceLeft;
        });

    return swallowConferenceLeft;
}

/**
 * Determines whether to not send a specific event to the native counterpart of
 * the External API.
 *
 * @param {Object} store - The redux store.
 * @param {Action} action - The redux action which is causing the sending of the
 * event.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code action}.
 * @returns {boolean} If the specified event is to not be sent, {@code true};
 * otherwise, {@code false}.
 */
function _swallowEvent(store, action, data) {
    switch (action.type) {
    case CONFERENCE_LEFT:
        return _swallowConferenceLeft(store, action, data);
    case CONFERENCE_WILL_JOIN:
        // CONFERENCE_WILL_JOIN is dispatched to the external API on SET_ROOM,
        // before the connection is created, so we need to swallow the original
        // one emitted by base/conference.
        return true;

    default:
        return false;
    }
}

/**
 * Send error message to native app.
 *
 * @param {Object} store - Redux store.
 * @param {string} errorMsg - Error message string.
 * @returns {void}
 */
function _sendErrorToNativeApp(store, errorMsg) {
    sendEvent(
        store,
        UNDEFINED_JITSI_ERROR,
        {
            errorMessage: errorMsg
        });
}

/**
 * Replace '\' characters with '\\' on Android, so client side handlers won't raise an error.
 *
 * @param {string} value - String in which backlashes are needed to replace.
 * @param {boolean?} alsoOnIos - Optional boolean value if escaping is needed also on iOS.
 * @returns {string}
 */
function escapeBackslashes(value: string, alsoOnIos?: boolean) {
    return value && typeof value === 'string' && (isAndroidDevice() || alsoOnIos)
        ? value.replace(/\\/g, '\\\\')
        : value;
}
