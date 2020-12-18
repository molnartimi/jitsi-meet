// @flow

import { ReducerRegistry, set } from '../redux';

import {
    CLIENT_RESIZED,
    SET_ASPECT_RATIO,
    SET_REDUCED_UI,
    SHOW_WRAP_UP_BUTTONS,
    UPDATE_SWIPER_INDEX
} from './actionTypes';
import { ASPECT_RATIO_NARROW } from './constants';

const {
    innerHeight = 0,
    innerWidth = 0
} = window;

/**
 * The default/initial redux state of the feature base/responsive-ui.
 */
const DEFAULT_STATE = {
    aspectRatio: ASPECT_RATIO_NARROW,
    clientHeight: innerHeight,
    clientWidth: innerWidth,
    currentSwiperIndex: -1,
    showWrapUpButtons: false,
    reducedUI: false
};

ReducerRegistry.register('features/base/responsive-ui', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CLIENT_RESIZED: {
        return {
            ...state,
            clientWidth: action.clientWidth,
            clientHeight: action.clientHeight
        };
    }
    case UPDATE_SWIPER_INDEX:
        return set(state, 'currentSwiperIndex', action.currentSwiperIndex);
    case SHOW_WRAP_UP_BUTTONS:
        return set(state, 'showWrapUpButtons', true);
    case SET_ASPECT_RATIO:
        return set(state, 'aspectRatio', action.aspectRatio);
    case SET_REDUCED_UI:
        return set(state, 'reducedUI', action.reducedUI);
    }

    return state;
});
