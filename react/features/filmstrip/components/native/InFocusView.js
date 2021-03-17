// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Dispatch } from 'redux';

import { generateNamePrefix } from '../../../base/conference';
import { MEDIA_TYPE } from '../../../base/media';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import { shopButtonEvent } from '../../actions.native';

import PreShowCountdown from './PreShowCountdown';
import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {
    inFocusUser: Object,
    localUser: Object,
    isLocalUserAudioMuted: boolean,
    isWrapUpVisible: boolean,
    placeholderData: Object,
    countdownStartDatetime: string,
    countdownTargetDatetime: string,
    isSimplifiedConference: boolean,
    isMicEnabled: boolean,
    isCamEnabled: boolean,
    isTabletDesignEnabled: boolean,
    dispatch: Dispatch<any>
}

const UNKNOWN_NAME = '';
const COLLECTION_BUTTON = 'COLLECTION';
const FAVORITES_BUTTON = 'MY FAVORITES';
const LOOKBOOK_BUTTON = 'LOOK BOOK';

/**
 * React component for in-focus view.
 *
 * @param {Props} props - Properties passed to this functional component.
 * @returns {Component} - A React component.
 */
class InFocusView extends Component<Props> {

    /**
     * InFocusView constructor.
     */
    constructor() {
        super();
        this._onTimeToShopLookBook = this._onTimeToShopLookBook.bind(this);
        this._onTimeToShopCollection = this._onTimeToShopCollection.bind(this);
        this._onTimeToShopFavs = this._onTimeToShopFavs.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <View
                style = { this.props.isTabletDesignEnabled ? styles.tabletInFocus : styles.fillView }>

                {this._createCountdownIfNeeded()}
                {_.isNil(this.props.inFocusUser)
                    ? this._createTemplateImageComponent()
                    : this._createInFocusVideoComponent()}

                {this._createInFocusTopView()}
            </View>);
    }

    _createTemplateImageComponent() {
        return (
            <View
                style = { styles.imageContainer }>
                <Image
                    source = {{
                        uri: this.props.placeholderData.imageUrl
                    }}
                    style = { styles.fillView } />
                {!this.props.isWrapUpVisible && this._createDefaultInFocusUserName()}
            </View>);
    }

    _createDefaultInFocusUserName() {
        return (
            <Text
                style = { styles.inFocusUserName }>
                { this.props.placeholderData.title }
            </Text>
        );
    }

    /**
     * This is the View of the in focus user video. It fills the whole screen.
     * The in focus screen other elements will be rendered on the top of it.
     *
     * @returns {ReactElement}
     * @private
     */
    _createInFocusVideoComponent() {
        return (
            <View
                style = { styles.inFocusContainer }>
                <Thumbnail
                    isAvatarCircled = { true }
                    isDominantSpeaker = { false }
                    isGradientRequired = { true }
                    isNameRequired = { false }
                    participant = { this.props.inFocusUser }
                    styleOverrides = { styles.fillView }
                    tileView = { true }
                    zOrder = { 0 } />

                {!_.isNil(this.props.inFocusUser)
                && this._createTopNameComponent(this.props.inFocusUser)}
            </View>);
    }

    _createTopNameComponent() {
        return (<Text style = { styles.nameComponent }>{
            _.isEmpty(generateNamePrefix(this.props.inFocusUser?.vipType))
                ? this.props.inFocusUser?.name
                : `${generateNamePrefix(this.props.inFocusUser?.vipType)}: ${this.props.inFocusUser?.name}`}
        </Text>);
    }

    /**
     * This is the View which appears at the top of the in focus user video.
     * This is a floating layout. It contains
     * the wrap up buttons and the self frame video also.
     *
     * @returns {ReactElement}
     * @private
     */
    _createInFocusTopView() {
        return (<View
            style = { styles.inFocusTopView }>
            {this.props.isWrapUpVisible
                && this._createWrapUpButtonsPlaceholder()}
            {this._isSelfFrameVisible()
                && this._createSelfFrameVideoComponent()}
        </View>);
    }

    _isSelfFrameVisible(): boolean {
        return !this.props.isSimplifiedConference
            && this.props.isCamEnabled;
    }

    _createWrapUpButtonsPlaceholder() {
        return (<View
            style = { this.props.isTabletDesignEnabled ? styles.tabletWrapUpPlaceholder : styles.wrapUpPlaceholder }>
            <Text style = { this.props.isTabletDesignEnabled ? styles.tabletWrapUpText : styles.wrapUpText }>
                It's time to shop!
            </Text>
            <View
                style = { styles.wrapUpButtonRow }>
                <TouchableOpacity
                    onPress = { this._onTimeToShopLookBook }
                    style = { this.props.isTabletDesignEnabled ? styles.tabletWrapUpButtonStyle : styles.lookBookButton }>
                    <Text style = { this.props.isTabletDesignEnabled ? styles.tabletButtonText : styles.buttonText }>
                        {LOOKBOOK_BUTTON}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = { this._onTimeToShopCollection }
                    style = {
                        this.props.isTabletDesignEnabled ? styles.tabletWrapUpButtonStyle : styles.collectionButton
                    }>
                    <Text style = { this.props.isTabletDesignEnabled ? styles.tabletButtonText : styles.buttonText }>
                        {COLLECTION_BUTTON}
                    </Text>
                </TouchableOpacity>
                {this.props.isTabletDesignEnabled && <TouchableOpacity
                    onPress = { this._onTimeToShopFavs }
                    style = { styles.tabletWrapUpButtonStyle }>
                    <Text style = { this.props.isTabletDesignEnabled ? styles.tabletButtonText : styles.buttonText }>
                        {FAVORITES_BUTTON}
                    </Text>
                </TouchableOpacity>}
            </View>
            { !this.props.isTabletDesignEnabled
                && <View style = { styles.favoritesButtonWrapper }>
                    <TouchableOpacity
                        onPress = { this._onTimeToShopFavs }
                        style = { styles.wrapUpButtonStyle }>
                        <Text style = { styles.buttonText }>{FAVORITES_BUTTON}</Text>
                    </TouchableOpacity>
                </View>}
        </View>);
    }

    _createSelfFrameVideoComponent() {
        return (
            <View
                style = { this.props.isTabletDesignEnabled
                    ? styles.tabletBottomVideoPlaceholder : styles.bottomVideoPlaceholder }>
                <Thumbnail
                    isAvatarCircled = { false }
                    isDominantSpeaker = { false }
                    isGradientRequired = { this.props.isLocalUserAudioMuted }
                    isNameRequired = { false }
                    participant = { this.props.localUser }
                    styleOverrides = {{
                        ...styles.fillView,
                        ...styles.osSpecificRoundedBorderedView
                    }}
                    tileView = { true }
                    zOrder = { 1 } />
                { this._isMicMutedIndicatorVisible()
                && <View
                    style = { this.props.isTabletDesignEnabled
                        ? styles.tabletMicrophoneViewStyle : styles.microphoneViewStyle }>
                    <Image
                        source = { require('../../../../../resources/img/muted_microphone.png') }
                        style = { this.props.isTabletDesignEnabled
                            ? styles.tabletMicrophoneIconStyle : styles.microphoneIconStyle } />
                </View> }
            </View>);
    }

    _isMicMutedIndicatorVisible(): boolean {
        return this.props.isLocalUserAudioMuted
            && this.props.isMicEnabled;
    }

    _onTimeToShopLookBook() {
        this._onTimeToShop('look-book');
    }

    _onTimeToShopCollection() {
        this._onTimeToShop('browse-collection');
    }

    _onTimeToShopFavs() {
        this._onTimeToShop('my-favorites');
    }

    _onTimeToShop(navigationTarget: string) {
        this.props.dispatch(shopButtonEvent(navigationTarget));
    }

    _createCountdownIfNeeded() {
        if (!_.isEmpty(this.props.countdownStartDatetime)
            && !_.isEmpty(this.props.countdownTargetDatetime)) {
            return (<PreShowCountdown
                endTime = { this.props.countdownTargetDatetime }
                startTime = { this.props.countdownStartDatetime } />);
        }

        return null;
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Props} ownProps - Properties of component.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const { inFocusUser, localUser, isTabletDesignEnabled } = ownProps;
    const placeholderUser = { name: UNKNOWN_NAME };
    const responsiveUi = state['features/base/responsive-ui'];

    const tracks = state['features/base/tracks'];
    const id = localUser?.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);

    const {
        isSimplifiedConference,
        isMicEnabled,
        isCamEnabled
    } = state['features/base/conference'];
    const { placeholderData, countdownStartDatetime, countdownTargetDatetime } = state['features/filmstrip'];

    return {
        inFocusUser,
        localUser: _.isNil(localUser) ? placeholderUser : localUser,
        isLocalUserAudioMuted: audioTrack?.muted ?? true,
        placeholderData,
        isWrapUpVisible: responsiveUi.showWrapUpButtons,
        countdownStartDatetime,
        countdownTargetDatetime,
        isSimplifiedConference,
        isMicEnabled,
        isCamEnabled,
        isTabletDesignEnabled
    };
}
export default connect(_mapStateToProps)(InFocusView);
