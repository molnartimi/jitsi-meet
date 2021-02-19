// @flow

import { ReducerRegistry } from '../base/redux';

import { SET_NOISY_AUDIO_INPUT_NOTIFICATION_UID } from './actionTypes';

/**
 * Reduces the redux actions of noise detection feature
 */
ReducerRegistry.register('features/noise-detection', (state = {}, action) => {
    switch (action.type) {
    case SET_NOISY_AUDIO_INPUT_NOTIFICATION_UID:
        return { ...state,
            noisyAudioInputNotificationUid: action.uid };
    }

    return state;
});
