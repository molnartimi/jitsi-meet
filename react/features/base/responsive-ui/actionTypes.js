/**
 * The type of (redux) action which indicates that the client window has been resized.
 *
 * {
 *     type: CLIENT_RESIZED
 * }
 */
export const CLIENT_RESIZED = 'CLIENT_RESIZED';

/**
 * The type of (redux) action which sets the aspect ratio of the app's user
 * interface.
 *
 * {
 *     type: SET_ASPECT_RATIO,
 *     aspectRatio: Symbol
 * }
 */
export const SET_ASPECT_RATIO = 'SET_ASPECT_RATIO';

/**
 * The type of redux action which signals that the reduces UI mode was enabled
 * or disabled.
 *
 * {
 *     type: SET_REDUCED_UI,
 *     reducedUI: boolean
 * }
 *
 * @public
 */
export const SET_REDUCED_UI = 'SET_REDUCED_UI';

/**
 * The type of redux action which signals that TileView should update the index.
 *
 * {
 *     type: UPDATE_SWIPER_INDEX,
 *     currentSwiperIndex: number
 * }
 *
 * @public
 */
export const UPDATE_SWIPER_INDEX = 'UPDATE_SWIPER_INDEX';

/**
 * Show wrap up buttons in TileView.
 *
 * {
 *     type: SHOW_WRAP_UP_BUTTONS
 * }
 *
 * @public
 */
export const SHOW_WRAP_UP_BUTTONS = 'SHOW_WRAP_UP_BUTTONS';
