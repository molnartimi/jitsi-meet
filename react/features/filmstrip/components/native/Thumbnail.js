// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { Dispatch } from 'redux';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { MEDIA_TYPE } from '../../../base/media';
import {
    isEveryoneModerator,
    PARTICIPANT_ROLE,
    ParticipantView,
    pinParticipant
} from '../../../base/participants';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import { DisplayNameLabel } from '../../../display-name';
import { toggleToolboxVisible } from '../../../toolbox/actions.native';

import styles, { AVATAR_SIZE } from './styles';


/**
 * Thumbnail component's property types.
 */
type Props = {

    /**
     * Whether local audio (microphone) is muted or not.
     */
    _audioMuted: boolean,

    /**
     * The Redux representation of the state "features/large-video".
     */
    _largeVideo: Object,

    /**
     * Handles click/tap event on the thumbnail.
     */
    _onClick: ?Function,

    /**
     * Whether to show the dominant speaker indicator or not.
     */
    _isDominantSpeaker: boolean,

    /**
     * Whether to show the moderator indicator or not.
     */
    _renderModeratorIndicator: boolean,

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * The Redux representation of the participant's video track.
     */
    _videoTrack: Object,

    /**
     * Invoked to trigger state changes in Redux.
     */
    dispatch: Dispatch<any>,

    /**
     * The Redux representation of the participant to display.
     */
    participant: Object,

    /**
     * Whether to display or hide the display name of the participant in the thumbnail.
     */
    renderDisplayName: ?boolean,

    /**
     * Optional styling to add or override on the Thumbnail component root.
     */
    styleOverrides?: Object,

    /**
     * If true, it tells the thumbnail that it needs to behave differently. E.g. react differently to a single tap.
     */
    tileView?: boolean,

    /**
     * Indicates whether shown in front view or not.
     */
    isInFrontView: boolean
}

/**
 * React component for video thumbnail.
 *
 * @param {Props} props - Properties passed to this functional component.
 * @returns {Component} - A React component.
 */
class Thumbnail extends Component<Props> {

    render() {
        const participantId = this.props.participant?.id === undefined ? 0 : this.props.participant.id;

        return (
            <Container
                onClick = { this.props._onClick }
                style = { [
                    styles.thumbnail,
                    this.props.styleOverrides || null,
                    this.props._isDominantSpeaker ? styles.dominantSpeaker : null
                ] }
                touchFeedback = { false }>

                <ParticipantView
                    avatarSize = { this.props.tileView ? AVATAR_SIZE * 2.5 : AVATAR_SIZE }
                    isInFrontView = { this.props.isInFrontView }
                    participantId = { participantId }
                    style = { styles.participantViewStyle }
                    tintEnabled = { false }
                    tintStyle = { styles.activeThumbnailTint }
                    zOrder = { 1 } />

                {this.props.renderDisplayName
                && <Container style = { styles.displayNameContainer }>
                    <LinearGradient
                        colors = { [ 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.40)' ] }>
                        <Container
                            style = { this.props._isDominantSpeaker
                                ? styles.dominantSpeaker
                                : styles.notDominantSpeaker }>
                            <DisplayNameLabel participantId = { participantId } />
                        </Container>
                    </LinearGradient>
                </Container>}

                {!this.props.participant?.isFakeParticipant && <View
                    style = { [
                        styles.thumbnailTopIndicatorContainer,
                        styles.thumbnailTopRightIndicatorContainer
                    ] } />}

            </Container>
        );
    }
}

/**
 * Maps part of redux actions to component's props.
 *
 * @param {Function} dispatch - Redux's {@code dispatch} function.
 * @param {Props} ownProps - The own props of the component.
 * @returns {{
 *     _onClick: Function,
 * }}
 */
function _mapDispatchToProps(dispatch: Function, ownProps): Object {
    return {
        /**
         * Handles click/tap event on the thumbnail.
         *
         * @protected
         * @returns {void}
         */
        _onClick() {
            const { participant, tileView } = ownProps;

            if (tileView) {
                dispatch(toggleToolboxVisible());
            } else {
                dispatch(pinParticipant(participant?.pinned ? null : participant.id));
            }
        }

    };
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Props} ownProps - Properties of component.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    // We need read-only access to the state of features/large-video so that the
    // filmstrip doesn't render the video of the participant who is rendered on
    // the stage i.e. as a large video.
    const largeVideo = state['features/large-video'];
    const tracks = state['features/base/tracks'];
    const { participant, isInFrontView } = ownProps;
    const id = participant?.id === undefined ? 0 : participant.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);
    const videoTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.VIDEO, id);
    const isDominantSpeaker = participant?.dominantSpeaker === undefined ? false : participant.dominantSpeaker;
    const _isEveryoneModerator = isEveryoneModerator(state);
    const renderModeratorIndicator = !_isEveryoneModerator && participant?.role === PARTICIPANT_ROLE.MODERATOR;

    return {
        _audioMuted: audioTrack?.muted ?? true,
        _largeVideo: largeVideo,
        _isDominantSpeaker: isDominantSpeaker,
        _renderModeratorIndicator: renderModeratorIndicator,
        _styles: ColorSchemeRegistry.get(state, 'Thumbnail'),
        _videoTrack: videoTrack,
        isInFrontView
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(Thumbnail);
