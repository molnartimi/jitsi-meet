/* @flow */

import type { Dispatch } from 'redux';

import UIEvents from '../../../../service/UI/UIEvents';
import { createToolbarEvent, sendAnalytics, VIDEO_MUTE } from '../../analytics';
import { muteLocal } from '../../remote-video-menu/actions';
import { setAudioOnly } from '../audio-only';

import {
    SET_AUDIO_MUTED,
    SET_AUDIO_AVAILABLE,
    SET_CAMERA_FACING_MODE,
    SET_VIDEO_AVAILABLE,
    SET_VIDEO_MUTED,
    STORE_VIDEO_TRANSFORM,
    TOGGLE_CAMERA_FACING_MODE
} from './actionTypes';
import {
    CAMERA_FACING_MODE,
    MEDIA_TYPE,
    VIDEO_MUTISM_AUTHORITY
} from './constants';

declare var APP: Object;

/**
 * Mute a local track.
 *
 * @param {string} dataJsonString - Stringified params containing the media type and the target mute state.
 * @returns {Function}
 */
export function muteMedia(dataJsonString: string) {
    return async (dispatch: Dispatch<any>) => {
        const { kind, muted } = JSON.parse(dataJsonString);

        switch (kind) {
        case 'videoinput':
            dispatch(muteVideo(muted, 'video')); // TODO audioOnly?
            break;
        case 'audioinput':
            dispatch(muteLocal(muted));
            break;
        }
    };
}

/**
 * Action to adjust the availability of the local audio.
 *
 * @param {boolean} available - True if the local audio is to be marked as
 * available or false if the local audio is not available.
 * @returns {{
 *     type: SET_AUDIO_AVAILABLE,
 *     available: boolean
 * }}
 */
export function setAudioAvailable(available: boolean) {
    return {
        type: SET_AUDIO_AVAILABLE,
        available
    };
}

/**
 * Action to set the muted state of the local audio.
 *
 * @param {boolean} muted - True if the local audio is to be muted or false if
 * the local audio is to be unmuted.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {{
 *     type: SET_AUDIO_MUTED,
 *     ensureTrack: boolean,
 *     muted: boolean
 * }}
 */
export function setAudioMuted(muted: boolean, ensureTrack: boolean = false) {
    return {
        type: SET_AUDIO_MUTED,
        ensureTrack,
        muted
    };
}

/**
 * Action to set the facing mode of the local camera.
 *
 * @param {CAMERA_FACING_MODE} cameraFacingMode - The camera facing mode to set.
 * @returns {{
 *     type: SET_CAMERA_FACING_MODE,
 *     cameraFacingMode: CAMERA_FACING_MODE
 * }}
 */
export function setCameraFacingMode(cameraFacingMode: CAMERA_FACING_MODE) {
    return {
        type: SET_CAMERA_FACING_MODE,
        cameraFacingMode
    };
}

/**
 * Action to adjust the availability of the local video.
 *
 * @param {boolean} available - True if the local video is to be marked as
 * available or false if the local video is not available.
 * @returns {{
 *     type: SET_VIDEO_AVAILABLE,
 *     available: boolean
 * }}
 */
export function setVideoAvailable(available: boolean) {
    return {
        type: SET_VIDEO_AVAILABLE,
        available
    };
}

/**
 * Action to set the muted state of the local video.
 *
 * @param {boolean} muted - True if the local video is to be muted or false if
 * the local video is to be unmuted.
 * @param {MEDIA_TYPE} mediaType - The type of media.
 * @param {number} authority - The {@link VIDEO_MUTISM_AUTHORITY} which is
 * muting/unmuting the local video.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
export function setVideoMuted(
        muted: boolean,
        mediaType: MEDIA_TYPE = MEDIA_TYPE.VIDEO,
        authority: number = VIDEO_MUTISM_AUTHORITY.USER,
        ensureTrack: boolean = false) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const oldValue = getState()['features/base/media'].video.muted;

        // eslint-disable-next-line no-bitwise
        const newValue = muted ? oldValue | authority : oldValue & ~authority;

        return dispatch({
            type: SET_VIDEO_MUTED,
            authority,
            mediaType,
            ensureTrack,
            muted: newValue
        });
    };
}

/**
 * Changes the muted state.
 *
 * @override
 * @param {boolean} muted - Whether video should be muted or not.
 * @protected
 * @returns {void}
 */
export function muteVideo(muted: boolean, mediaType: string, audioOnly: boolean) {
    return async (dispatch: Dispatch<any>) => {
        sendAnalytics(createToolbarEvent(VIDEO_MUTE, { enable: muted }));
        if (audioOnly) {
            dispatch(setAudioOnly(false, /* ensureTrack */ true));
        }

        dispatch(
            setVideoMuted(
                muted,
                mediaType,
                VIDEO_MUTISM_AUTHORITY.USER,
                /* ensureTrack */ true));

        // FIXME: The old conference logic still relies on this event being
        // emitted.
        typeof APP === 'undefined'
        || APP.UI.emitEvent(UIEvents.VIDEO_MUTED, muted, true);
    };
}

/**
 * Creates an action to store the last video {@link Transform} applied to a
 * stream.
 *
 * @param {string} streamId - The ID of the stream.
 * @param {Object} transform - The {@code Transform} to store.
 * @returns {{
 *     type: STORE_VIDEO_TRANSFORM,
 *     streamId: string,
 *     transform: Object
 * }}
 */
export function storeVideoTransform(streamId: string, transform: Object) {
    return {
        type: STORE_VIDEO_TRANSFORM,
        streamId,
        transform
    };
}

/**
 * Toggles the camera facing mode. Most commonly, for example, mobile devices
 * such as phones have a front/user-facing and a back/environment-facing
 * cameras. In contrast to setCameraFacingMode, allows the toggling to be
 * optimally and/or natively implemented without the overhead of separate reads
 * and writes of the current/effective camera facing mode.
 *
 * @returns {{
 *     type: TOGGLE_CAMERA_FACING_MODE
 * }}
 */
export function toggleCameraFacingMode() {
    return {
        type: TOGGLE_CAMERA_FACING_MODE
    };
}
