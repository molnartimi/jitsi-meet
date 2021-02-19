// @flow

/**
 * Returns the visibility of the media permissions prompt.
 *
 * @param {Object} state - The Redux state.
 * @returns {boolean}
 */
export function getMediaPermissionPromptVisibility(state: Object) {
    return state['features/overlay'].isMediaPermissionPromptVisible;
}
