// @flow

import { ReducerRegistry } from '../base/redux';

import {
    SET_COUNTDOWN,
    SET_FILMSTRIP_ENABLED,
    SET_FILMSTRIP_HOVERED,
    SET_FILMSTRIP_VISIBLE,
    SET_HORIZONTAL_VIEW_DIMENSIONS,
    SET_TILE_VIEW_DIMENSIONS,
    SET_PLACEHOLDER_DATA,
    IS_SIMPLIFIED_CONFERENCE_CHANGE,
} from './actionTypes';

const DEFAULT_STATE = {
    /**
     * The indicator which determines whether the {@link Filmstrip} is enabled.
     *
     * @public
     * @type {boolean}
     */
    enabled: true,

    /**
     * The horizontal view dimensions.
     *
     * @public
     * @type {Object}
     */
    horizontalViewDimensions: {},

    /**
     * The tile view dimensions.
     *
     * @public
     * @type {Object}
     */
    tileViewDimensions: {},

    /**
     * The indicator which determines whether the {@link Filmstrip} is visible.
     *
     * @public
     * @type {boolean}
     */
    visible: true,

    /**
     * The in-focus placeholder data.
     *
     * @public
     * @type {Object}
     */
    placeholderData: {}
};

ReducerRegistry.register(
    'features/filmstrip',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
        case SET_FILMSTRIP_ENABLED:
            return {
                ...state,
                enabled: action.enabled
            };

        case SET_FILMSTRIP_HOVERED:
            return {
                ...state,

                /**
                 * The indicator which determines whether the {@link Filmstrip}
                 * is being hovered (over).
                 *
                 * @public
                 * @type {boolean}
                 */
                hovered: action.hovered
            };

        case SET_FILMSTRIP_VISIBLE:
            return {
                ...state,
                visible: action.visible
            };

        case SET_HORIZONTAL_VIEW_DIMENSIONS:
            return {
                ...state,
                horizontalViewDimensions: action.dimensions
            };
        case SET_TILE_VIEW_DIMENSIONS:
            return {
                ...state,
                tileViewDimensions: action.dimensions
            };
        case SET_PLACEHOLDER_DATA:
            return {
                ...state,
                placeholderData: action.placeholderData
            };

        case SET_COUNTDOWN:
            return {
                ...state,
                countdownStartDatetime: action.fromDate,
                countdownTargetDatetime: action.toDate
            };

        case IS_SIMPLIFIED_CONFERENCE_CHANGE:
            return {
                ...state,
                isSimplifiedConference: action.isSimplifiedConference,
            };
        }

        return state;
    });
