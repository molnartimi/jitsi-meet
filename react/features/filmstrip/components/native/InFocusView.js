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
    _countdownStartDatetime: string,
    _countdownTargetDatetime: string,
    dispatch: Dispatch<any>,
    _isCamEnabled: boolean,
    _isLocalUserAudioMuted: boolean,
    _isMicEnabled: boolean,
    _isSimplifiedConference: boolean,
    _isTabletDesignEnabled: boolean,
    _isWrapUpVisible: boolean,
    _inFocusUser: Object,
    _localUser: Object,
    _placeholderData: Object
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
                style = { this.props._isTabletDesignEnabled
                    ? styles.tabletInFocus
                    : styles.fillView }>

                {this._createCountdownIfNeeded()}
                {_.isNil(this.props._inFocusUser)
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
                    source = { _.isNil(this.props._placeholderData?.imageUrl)
                        ? require('../../../../../resources/img/default_user_icon.png')
                        : { uri: this.props._placeholderData?.imageUrl } }
                    style = { _.isNil(this.props._placeholderData?.imageUrl)
                        ? styles.placeholderImage
                        : styles.fillView } />
                {!this.props._isWrapUpVisible && this._createDefaultInFocusUserName()}
            </View>);
    }

    _createDefaultInFocusUserName() {
        return (
            <Text
                style = { styles.inFocusUserName }>
                { this.props._placeholderData?.title }
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
                    inFocusStyle = { true }
                    isAvatarCircled = { true }
                    isGradientRequired = { true }
                    isTabletDesignEnabled = { this.props._isTabletDesignEnabled }
                    isTileView = { true }
                    participant = { this.props._inFocusUser }
                    styleOverrides = { this.props._isWrapUpVisible
                        ? { ...styles.inFocusThumbnailWrapUp } : {} }
                    zOrder = { 0 } />

                {this._createTopNameComponent(this.props._inFocusUser)}
            </View>);
    }

    _createTopNameComponent() {
        return (<Text style = { styles.nameComponent }>{
            _.isEmpty(generateNamePrefix(this.props._inFocusUser?.vipType))
                ? this.props._inFocusUser?.name
                : `${generateNamePrefix(this.props._inFocusUser?.vipType)}: ${this.props._inFocusUser?.name}`}
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
            {this.props._isWrapUpVisible
                && this._createWrapUpButtonsPlaceholder()}
            {this._isSelfFrameVisible()
                && this._createSelfFrameVideoComponent()}
        </View>);
    }

    _isSelfFrameVisible(): boolean {
        return !this.props._isSimplifiedConference
            && this.props._isCamEnabled;
    }

    _createWrapUpButtonsPlaceholder() {
        return (<View
            style = { this.props._isTabletDesignEnabled
                ? styles.tabletWrapUpPlaceholder
                : styles.wrapUpPlaceholder }>
            <Text
                style = { this.props._isTabletDesignEnabled
                    ? styles.tabletWrapUpText
                    : styles.wrapUpText }>
                It's time to shop!
            </Text>
            <View
                style = { styles.wrapUpButtonRow }>
                <TouchableOpacity
                    onPress = { this._onTimeToShopLookBook }
                    style = { this.props._isTabletDesignEnabled
                        ? styles.tabletWrapUpButtonStyle
                        : styles.lookBookButton }>
                    <Text
                        style = { this.props._isTabletDesignEnabled
                            ? styles.tabletButtonText
                            : styles.buttonText }>
                        {LOOKBOOK_BUTTON}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = { this._onTimeToShopCollection }
                    style = {
                        this.props._isTabletDesignEnabled
                            ? styles.tabletWrapUpButtonStyle
                            : styles.collectionButton
                    }>
                    <Text
                        style = { this.props._isTabletDesignEnabled
                            ? styles.tabletButtonText
                            : styles.buttonText }>
                        {COLLECTION_BUTTON}
                    </Text>
                </TouchableOpacity>
                {this.props._isTabletDesignEnabled && <TouchableOpacity
                    onPress = { this._onTimeToShopFavs }
                    style = { styles.tabletWrapUpButtonStyle }>
                    <Text
                        style = { this.props._isTabletDesignEnabled
                            ? styles.tabletButtonText
                            : styles.buttonText }>
                        {FAVORITES_BUTTON}
                    </Text>
                </TouchableOpacity>}
            </View>
            { !this.props._isTabletDesignEnabled
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
                style = { this.props._isTabletDesignEnabled
                    ? styles.tabletBottomVideoPlaceholder
                    : styles.bottomVideoPlaceholder }>
                <Thumbnail
                    isAvatarCircled = { false }
                    isDominantSpeaker = { false }
                    isGradientRequired = { this.props._isLocalUserAudioMuted }
                    isNameRequired = { false }
                    isTileView = { true }
                    participant = { this.props._localUser }
                    styleOverrides = {{
                        ...styles.fillView,
                        ...styles.osSpecificRoundedBorderedView
                    }}
                    zOrder = { 1 } />
                { this._isMicMutedIndicatorVisible()
                && <View
                    style = { this.props._isTabletDesignEnabled
                        ? styles.tabletMicrophoneViewStyle
                        : styles.microphoneViewStyle }>
                    <Image
                        source = { require('../../../../../resources/img/muted_microphone.png') }
                        style = { this.props._isTabletDesignEnabled
                            ? styles.tabletMicrophoneIconStyle
                            : styles.microphoneIconStyle } />
                </View> }
            </View>);
    }

    _isMicMutedIndicatorVisible(): boolean {
        return this.props._isLocalUserAudioMuted
            && this.props._isMicEnabled;
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
        if (!_.isEmpty(this.props._countdownStartDatetime)
            && !_.isEmpty(this.props._countdownTargetDatetime)) {
            return (<PreShowCountdown
                endTime = { this.props._countdownTargetDatetime }
                startTime = { this.props._countdownStartDatetime } />);
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
    const audioTrack = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, localUser?.id);
    const {
        isSimplifiedConference,
        isMicEnabled,
        isCamEnabled
    } = state['features/base/conference'];
    const { placeholderData, countdownStartDatetime, countdownTargetDatetime } = state['features/filmstrip'];

    return {
        _inFocusUser: inFocusUser,
        _localUser: _.isNil(localUser) ? placeholderUser : localUser,
        _isLocalUserAudioMuted: audioTrack?.muted ?? true,
        _placeholderData: placeholderData,
        _isWrapUpVisible: responsiveUi.showWrapUpButtons,
        _countdownStartDatetime: countdownStartDatetime,
        _countdownTargetDatetime: countdownTargetDatetime,
        _isSimplifiedConference: isSimplifiedConference,
        _isMicEnabled: isMicEnabled,
        _isCamEnabled: isCamEnabled,
        _isTabletDesignEnabled: isTabletDesignEnabled
    };
}
export default connect(_mapStateToProps)(InFocusView);
