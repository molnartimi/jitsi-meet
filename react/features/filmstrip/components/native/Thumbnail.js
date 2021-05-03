// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { Dispatch } from 'redux';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { generateNamePrefix } from '../../../base/conference';
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
    _isAvatarCircled: boolean,

    /**
     * The z-order of the {@link Video} of {@link ParticipantView} in the
     * stacking space of all {@code Video}s. For more details, refer to the
     * {@code zOrder} property of the {@code Video} class for React Native.
     */
    zOrder?: number,
    _isDominantSpeaker: boolean,
    _isGradientRequired: boolean,
    _isNameRequired: boolean,
    _isTabletDesignEnabled: boolean,
    _isTabletVipDesignEnabled: boolean,
    _isSpeakerViewShowed: boolean,
    _inFocusStyle: boolean,
}

/**
 * React component for video thumbnail.
 *
 * @param {Props} props - Properties passed to this functional component.
 * @returns {Component} - A React component.
 */
class Thumbnail extends Component<Props> {

    render() {
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
                    avatarSize = { this.props.tileView ? AVATAR_SIZE * 2.3 : AVATAR_SIZE }
                    inFocusStyle = { this.props._inFocusStyle }
                    isAvatarCircled = { this.props._isAvatarCircled }
                    isSpeakerViewShowed = { this.props._isSpeakerViewShowed }
                    isTabletDesignEnabled = { this.props._isTabletDesignEnabled }
                    participantId = { this.props.participant?.id }
                    style = { this.props.styleOverrides }
                    tintEnabled = { false }
                    tintStyle = { styles.activeThumbnailTint }
                    zOrder = { this.props.zOrder } />

                {this.props._isGradientRequired
                    ? <LinearGradient
                        colors = { [ '#000000', '#00000000' ] }
                        end = {{ x: 0,
                            y: 0.8 }}
                        start = {{ x: 0,
                            y: 1 }}
                        style = { styles.gradientOverlay } />
                    : null}

                {this.props._isNameRequired
                    ? (<Text
                        style = { [
                            this.props._isTabletVipDesignEnabled
                                ? styles.participantTabletVipName
                                : styles.participantName,
                            this.props._isDominantSpeaker
                                ? styles.activeParticipantNamePadding
                                : styles.participantNamePadding
                        ] }>
                        { _.isEmpty(generateNamePrefix(this.props.participant?.vipType))
                            ? this.props.participant?.name
                            : `${generateNamePrefix(this.props.participant?.vipType)}: ${this.props.participant?.name}`}
                    </Text>)
                    : null}

                {this.props._isDominantSpeaker
                    ? <View
                        style = {{
                            ...styles.dominantSpeakerFrame }} />
                    : null}

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
    const { participant,
        inFocusStyle,
        isAvatarCircled,
        isGradientRequired,
        isNameRequired,
        isDominantSpeaker,
        isTabletDesignEnabled,
        isTabletVipDesignEnabled,
        isSpeakerViewShowed } = ownProps;

    const largeVideo = state['features/large-video'];
    const tracks = state['features/base/tracks'];
    const id = _.isNil(participant?.id) ? 0 : participant.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);
    const videoTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.VIDEO, id);
    const _isEveryoneModerator = isEveryoneModerator(state);
    const renderModeratorIndicator = !_isEveryoneModerator && participant?.role === PARTICIPANT_ROLE.MODERATOR;

    return {
        _audioMuted: audioTrack?.muted ?? true,
        _largeVideo: largeVideo,
        _renderModeratorIndicator: renderModeratorIndicator,
        _styles: ColorSchemeRegistry.get(state, 'Thumbnail'),
        _videoTrack: videoTrack,
        _inFocusStyle: inFocusStyle,
        _isAvatarCircled: isAvatarCircled,
        _isDominantSpeaker: isDominantSpeaker ?? false,
        _isGradientRequired: isGradientRequired ?? false,
        _isNameRequired: isNameRequired ?? false,
        _isTabletDesignEnabled: isTabletDesignEnabled ?? false,
        _isTabletVipDesignEnabled: isTabletVipDesignEnabled ?? false,
        _isSpeakerViewShowed: isSpeakerViewShowed ?? false
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(Thumbnail);
