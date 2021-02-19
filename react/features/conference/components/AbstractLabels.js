// @flow

import React, { Component } from 'react';

import { TranscribingLabel } from '../../transcribing';
import { VideoQualityLabel } from '../../video-quality';

/**
 * The type of the React {@code Component} props of {@link AbstractLabels}.
 */
export type Props = {

    /**
     * Whether the video quality label should be displayed.
     */
    _showVideoQualityLabel: boolean
};

/**
 * A container to hold video status labels, including recording status and
 * current large video quality.
 *
 * @extends Component
 */
export default class AbstractLabels<P: Props, S> extends Component<P, S> {

    /**
     * Renders the {@code TranscribingLabel}.
     *
     * @protected
     * @returns {React$Element}
     */
    _renderTranscribingLabel() {
        return (
            <TranscribingLabel />
        );
    }

    /**
     * Renders the {@code VideoQualityLabel} that is platform independent.
     *
     * @protected
     * @returns {React$Element}
     */
    _renderVideoQualityLabel() {
        return (
            <VideoQualityLabel />
        );
    }
}

/**
 * Maps (parts of) the redux state to the associated props of the {@link Labels}
 * {@code Component}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _filmstripVisible: boolean,
 *     _showVideoQualityLabel: boolean
 * }}
 */
// eslint-disable-next-line no-unused-vars
export function _abstractMapStateToProps(state: Object) {
    return {
        _showVideoQualityLabel: false
    };
}
