// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { generateNamePrefix } from '../../../base/conference';
import { ParticipantView } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { _mapDispatchToProps } from '../../../base/sounds/components/SoundCollection';

import styles, { AVATAR_SIZE } from './styles';

type Props = {
    _isAvatarCircled: boolean,
    _isDominantSpeaker: boolean,
    _isGradientRequired: boolean,
    _isNameRequired: boolean,
    _isTabletDesignEnabled: boolean,
    _isTileView: boolean,
    _inFocusStyle: boolean,
    _participant: Object,
    _styleOverrides?: Object,
    _zOrder?: number
}

class Thumbnail extends Component<Props> {

    render() {
        return (
            <View
                style = { [
                    styles.thumbnail,
                    this.props._styleOverrides || null,
                    this.props._isDominantSpeaker ? styles.dominantSpeaker : null
                ] }
                touchFeedback = { false }>

                <ParticipantView
                    avatarSize = { this.props._isTileView ? AVATAR_SIZE * 2.3 : AVATAR_SIZE }
                    inFocusStyle = { this.props._inFocusStyle }
                    isAvatarCircled = { this.props._isAvatarCircled }
                    isTabletDesignEnabled = { this.props._isTabletDesignEnabled }
                    participantId = { this.props._participant?.id }
                    style = { this.props._styleOverrides }
                    zOrder = { this.props._zOrder } />

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
                            this.props._isTabletDesignEnabled
                                ? styles.participantTabletVipName
                                : styles.participantName,
                            this.props._isDominantSpeaker
                                ? styles.activeParticipantNamePadding
                                : styles.participantNamePadding
                        ] }>
                        { _.isEmpty(generateNamePrefix(this.props._participant?.vipType))
                            ? this.props._participant?.name
                            // eslint-disable-next-line max-len
                            : `${generateNamePrefix(this.props._participant?.vipType)}: ${this.props._participant?.name}`}
                    </Text>)
                    : null}

                {this.props._isDominantSpeaker
                    ? <View
                        style = {{
                            ...styles.dominantSpeakerFrame }} />
                    : null}

            </View>
        );
    }
}

function _mapStateToProps(state, ownProps) {
    const {
        inFocusStyle,
        isAvatarCircled,
        isDominantSpeaker,
        isGradientRequired,
        isNameRequired,
        isTabletDesignEnabled,
        isTileView,
        participant,
        styleOverrides,
        zOrder } = ownProps;

    return {
        _isAvatarCircled: isAvatarCircled ?? false,
        _isDominantSpeaker: isDominantSpeaker ?? false,
        _isGradientRequired: isGradientRequired ?? false,
        _isNameRequired: isNameRequired ?? false,
        _isTabletDesignEnabled: isTabletDesignEnabled ?? false,
        _isTileView: isTileView ?? false,
        _inFocusStyle: inFocusStyle,
        _participant: participant,
        _styleOverrides: styleOverrides,
        _zOrder: zOrder
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(Thumbnail);
