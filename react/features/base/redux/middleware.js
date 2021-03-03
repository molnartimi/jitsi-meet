// @flow

import Logger from 'jitsi-meet-logger';
import _ from 'lodash';

import MiddlewareRegistry from './MiddlewareRegistry';
import PersistenceRegistry from './PersistenceRegistry';
import { toState } from './functions';

const logger = Logger.getLogger(__filename);

/**
 * The delay in milliseconds that passes between the last state change and the
 * persisting of that state in the storage.
 */
const PERSIST_STATE_DELAY = 2000;

/**
 * A throttled function to avoid repetitive state persisting.
 */
const throttledPersistState
    = _.throttle(
        state => PersistenceRegistry.persistState(state),
        PERSIST_STATE_DELAY);

// Web only code.
// We need the <tt>if</tt> beacuse it appears that on mobile the polyfill is not
// executed yet.
if (typeof window.addEventListener === 'function') {
    window.addEventListener('unload', () => {
        throttledPersistState.flush();
    });
}

/**
 * A master MiddleWare to selectively persist state. Please use the
 * {@link persisterconfig.json} to set which subtrees of the redux state should
 * be persisted.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const oldState = toState(store);
    const result = next(action);
    const newState = toState(store);

    oldState === newState || throttledPersistState(newState);

    return result;
});

MiddlewareRegistry.register(store => next => action => {
    logger.info('dispatching action: ', action);
    const res = next(action);

    logger.info('new features/base/conference state: ',
        store.getState()['features/base/conference']);
    logger.info('new features/base/participants state: ',
        store.getState()['features/base/participants']);

    return res;
});
