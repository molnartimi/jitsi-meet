// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import { RTCView } from 'react-native-webrtc';

import { translate } from '../../i18n';
import { JitsiParticipantConnectionStatus } from '../../lib-jitsi-meet';
import {
    MEDIA_TYPE
} from '../../media';
import { connect } from '../../redux';
import { getTrackByMediaTypeAndParticipant } from '../../tracks';

import styles from './styles';

/**
 * The type of the React {@link Component} props of {@link ParticipantView}.
 */
type Props = {
    _avatarSize: number,
    _connectionStatus: string,
    _isAvatarCircled: boolean,
    _isConnectivityLabelShown: boolean,
    _isTabletDesignEnabled: boolean,
    _inFocusStyle: Object,
    _participantName: string,
    _profileImageUrl: string,
    _renderVideo: boolean,
    _videoTrack: Object,
    _style: Object,
    _zOrder: number
};


/**
 * Implements a React Component which depicts a specific participant's avatar
 * and video.
 *
 * @extends Component
 */
class ParticipantView extends Component<Props> {

    /**
     * Renders the connection status label, if appropriate.
     *
     * @param {string} connectionStatus - The status of the participant's
     * connection.
     * @private
     * @returns {ReactElement|null}
     */
    _renderConnectionInfo(connectionStatus) {
        let messageKey = '';

        switch (connectionStatus) {
        case JitsiParticipantConnectionStatus.INACTIVE:
            messageKey = 'has low bandwidth';
            break;
        default:
            return '';
        }

        const containerStyle = {
            ...styles.connectionInfoContainer,
            width: this.props._avatarSize * 1.5
        };

        return (
            <View
                pointerEvents = 'box-none'
                style = { containerStyle }>
                <Text style = { styles.connectionInfoText }>
                    { `${this.props._participantName} ${messageKey}` }
                </Text>
            </View>
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const objectFit = this.props._isTabletDesignEnabled && this.props._inFocusStyle ? 'contain' : 'cover';

        return (
            <View
                style = {{
                    ...styles.participantView,
                    ...this.props._style
                }}
                touchFeedback = { false }>

                { this.props._renderVideo
                    ? <RTCView
                        mirror = { this.props._videoTrack?.mirror }
                        objectFit = { objectFit }
                        streamURL = { this.props._videoTrack?.jitsiTrack?.getOriginalStream()?.toURL() }
                        style = { this.props._inFocusStyle
                            ? { ...this._getFocusStyle(),
                                ...this.props._style }
                            : { ...styles.participantView,
                                ...this.props._style }
                        }
                        zOrder = { this.props._zOrder } />

                    : <View style = { styles.avatarContainer }>
                        <Image
                            source = { _.isNil(this.props._profileImageUrl)
                                ? require('../../../../../resources/img/default_user_icon.png')
                                : { uri: this.props._profileImageUrl } }
                            style = { this.props._isAvatarCircled
                                ? { ...styles.circleAvatar,
                                    width: this.props._avatarSize,
                                    height: this.props._avatarSize,
                                    borderRadius: this.props._avatarSize / 2 }
                                : { ...styles.avatarContainer } } />
                    </View>
                }

                { this.props._isConnectivityLabelShown
                    && this._renderConnectionInfo(this.props._connectionStatus) }
            </View>
        );
    }

    _getFocusStyle() {
        return this.props._isTabletDesignEnabled
            ? styles.inFocusParticipantTablet
            : styles.inFocusParticipantMobile;
    }
}

/**
 * Maps (parts of) the redux state to the associated {@link ParticipantView}'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The React {@code Component} props passed to the
 * associated (instance of) {@code ParticipantView}.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const { avatarSize,
        participantId,
        isAvatarCircled,
        isConnectivityLabelShown,
        isTabletDesignEnabled,
        inFocusStyle,
        zOrder,
        style } = ownProps;

    const participants = state['features/base/participants'];
    const currentParticipant = participants.find(user => user.id === participantId);

    const tracks = state['features/base/tracks'];
    const videoTrack = getTrackByMediaTypeAndParticipant(
        tracks,
        MEDIA_TYPE.VIDEO,
        participantId);

    const isParticipantVideoMuted = currentParticipant.local
        ? state['features/base/media']?.video?.muted ?? true
        : videoTrack?.jitsiTrack?.muted ?? true;

    return {
        _avatarSize: avatarSize,
        _connectionStatus: JitsiParticipantConnectionStatus.ACTIVE,
        _isAvatarCircled: isAvatarCircled ?? false,
        _isConnectivityLabelShown: isConnectivityLabelShown ?? false,
        _isTabletDesignEnabled: isTabletDesignEnabled ?? false,
        _inFocusStyle: inFocusStyle,
        _participantName: currentParticipant?.name ?? '',
        _profileImageUrl: currentParticipant?.loadableAvatarUrl ?? currentParticipant?.avatarURL ?? undefined,
        _renderVideo: !isParticipantVideoMuted,
        _style: style,
        _videoTrack: videoTrack,
        _zOrder: zOrder
    };
}

export default translate(connect(_mapStateToProps)(ParticipantView));
