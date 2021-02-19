/**
 * The type of (redux) action which sets the dimensions of the tile view grid.
 *
 * {
 *     type: SET_TILE_VIEW_DIMENSIONS,
 *     dimensions: {
 *         gridDimensions: {
 *             columns: number,
 *             height: number,
 *             visibleRows: number,
 *             width: number
 *         },
 *         thumbnailSize: {
 *             height: number,
 *             width: number
 *         },
 *         filmstripWidth: number
 *     }
 * }
 */
export const SET_TILE_VIEW_DIMENSIONS = 'SET_TILE_VIEW_DIMENSIONS';

/**
 * The type of (redux) action which sets the dimensions of the thumbnails in horizontal view.
 *
 * {
 *     type: SET_HORIZONTAL_VIEW_DIMENSIONS,
 *     dimensions: Object
 * }
 */
export const SET_HORIZONTAL_VIEW_DIMENSIONS = 'SET_HORIZONTAL_VIEW_DIMENSIONS';

/**
 * The type of (redux) action which sets the placeholder data for in-focus view.
 *
 * {
 *     type: SET_PLACEHOLDER_DATA,
 *     placeholderData: {
 *          title: string,
 *          imageUrl: string
 *     }
 * }
 */
export const SET_PLACEHOLDER_DATA = 'SET_PLACEHOLDER_DATA';

/**
 * The type of (redux) action which sets the start and target date time of pre show countdown.
 *
 * {
 *     type: SET_COUNTDOWN,
 *     fromDate: string,
 *     toDate: string
 * }
 */
export const SET_COUNTDOWN = 'SET_COUNTDOWN';
