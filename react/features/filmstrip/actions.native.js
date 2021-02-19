// @flow

import {
    SWIPE_EVENT,
    SHOP_BUTTON_EVENT,
    LOCAL_STATS_EVENT
} from '../base/conference';

import {
    SET_COUNTDOWN,
    SET_TILE_VIEW_DIMENSIONS,
    SET_PLACEHOLDER_DATA
} from './actionTypes';


/**
 * Sets the dimensions of the tile view grid. The action is only partially implemented on native as not all
 * of the values are currently used. Check the description of {@link SET_TILE_VIEW_DIMENSIONS} for the full set
 * of properties.
 *
 * @param {Object} dimensions - The tile view dimensions.
 * @param {Object} thumbnailSize - The size of an individual video thumbnail.
 * @param {number} thumbnailSize.height - The height of an individual video thumbnail.
 * @param {number} thumbnailSize.width - The width of an individual video thumbnail.
 * @returns {{
 *     type: SET_TILE_VIEW_DIMENSIONS,
 *     dimensions: Object
 * }}
 */
export function setTileViewDimensions({ thumbnailSize }: Object) {
    return {
        type: SET_TILE_VIEW_DIMENSIONS,
        dimensions: {
            thumbnailSize
        }
    };
}

/**
 * Creates action which send swipe event data to native app.
 *
 * @param {number} index - Index of current page.
 * @param {number} total - Total number of native pages.
 * @returns {{
 *     type: SWIPE_EVENT,
 *     index: number,
 *     total: number
 * }}
 */
export function swipeEvent(index: number, total: number) {
    return {
        type: SWIPE_EVENT,
        index: index.toString(),
        total: total.toString()
    };
}

/**
 * Creates action which send local connectivity statistic event data to native app.
 *
 * @param {Object} stats - Local Jitsi stats object.
 * @returns {{
 *     type: LOCAL_STATS_EVENT,
 *     stats: string
 * }}
 */
export function localStatsEvent(stats: Object) {
    return {
        type: LOCAL_STATS_EVENT,
        stats: stats.toString()
    };
}

/**
 * Called whenever wrap up buttons are pressed.
 *
 * @param {string} navigationTarget - Page to navigate to.
 * @returns {{
 *     type: SHOP_BUTTON_EVENT,
 *     index: number,
 *     total: number
 * }}
 */
export function shopButtonEvent(navigationTarget: string) {
    return {
        type: SHOP_BUTTON_EVENT,
        navigationTarget
    };
}

/**
 * Sets placeholder data for in-focus view.
 *
 * @param {string} title - Placeholder image title.
 * @param {string} imageUrl - Placeholder image url.
 * @returns {{
    *     type: SET_PLACEHOLDER_DATA,
    *     placeholderData: Object
    * }}
*/
export function setPlaceholderData(title: string, imageUrl: string) {
    return {
        type: SET_PLACEHOLDER_DATA,
        placeholderData: {
            title,
            imageUrl
        }
    };
}

/**
 * Sets the start and target date time of pre show countdown.
 *
 * @param {string} fromDate - Current date time in 'YYYY/MM/DD hh:mm' format.
 * @param {string} toDate - Target date time in 'YYYY/MM/DD hh:mm' format.
 * @returns {{
 *     type: SET_COUNTDOWN,
 *     fromDate: string,
 *     toDate: string
 * }}
 */
export function setCountdown(fromDate: string, toDate: string) {
    return {
        type: SET_COUNTDOWN,
        fromDate,
        toDate
    };
}
