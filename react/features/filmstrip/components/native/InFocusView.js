import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';

import { MEDIA_TYPE } from '../../../base/media';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';

import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {
    inFocusUser: Object,
    localUser: Object,
    isSideUserAudioMuted: boolean,
    isWrapUpVisible: boolean,
    placeholderData: Object
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

    render() {
        return (
            <View
                style = { styles.fillView }>

                {_.isNil(this.props.inFocusUser)
                    ? this._createTemplateImageComponent()
                    : this._createInFocusVideoComponent()}

                {this._createInFocusTopView()}
            </View>);
    }

    _createTemplateImageComponent() {
        return (
            <View
                style = { [
                    styles.fillView,
                    styles.cabiName,
                    this.props.isWrapUpVisible
                        ? { paddingBottom: '23%' }
                        : { paddingBottom: 0 } ] }>
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
                style = {{
                    ...styles.nameComponent,
                    paddingTop: 220 }}>
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
                style = { [
                    styles.fillView,
                    styles.inFocusUserName,
                    this.props.isWrapUpVisible
                        ? { paddingBottom: '23%' }
                        : { paddingBottom: 0 } ] }>
                <Thumbnail
                    isAvatarCircled = { true }
                    participant = { this.props.inFocusUser }
                    renderDisplayName = { true }
                    styleOverrides = { styles.fillView }
                    zOrder = { 0 }
                    tileView = { true } />

                {!_.isNil(this.props.inFocusUser)
                && this._createTopNameComponent(this.props.inFocusUser)}
            </View>);
    }

    _createTopNameComponent() {
        return (<Text style = { styles.nameComponent }>{
            _.isNil(this.props.inFocusUser?.name)
                ? UNKNOWN_NAME
                : this.props.inFocusUser.name
        }</Text>);
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
            style = { styles.inFrontTopView }>
            {this.props.isWrapUpVisible
                && this._createWrapUpButtonsPlaceholder()}
            {this._createSelfFrameVideoComponent()}
        </View>);
    }

    _createWrapUpButtonsPlaceholder() {
        return (<View
            style = { styles.wrapUpPlaceholder }>
            <Text style = { styles.wrapUpText }>It's time to shop!</Text>
            <View
                style = { styles.wrapUpButtonRow }>
                <TouchableOpacity
                    style = {{
                        ...styles.wrapUpButtonStyle,
                        marginRight: 3
                    }}>
                    <Text style = { styles.normalText }>{LOOKBOOK_BUTTON}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{
                        ...styles.wrapUpButtonStyle,
                        marginLeft: 3
                    }}>
                    <Text style = { styles.normalText }>{COLLECTION_BUTTON}</Text>
                </TouchableOpacity>
            </View>
            <View style = {{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style = { styles.wrapUpButtonStyle }>
                    <Text style = { styles.normalText }>{FAVORITES_BUTTON}</Text>
                </TouchableOpacity>
            </View>
        </View>);
    }

    _createSelfFrameVideoComponent() {
        return (
            <View
                style = { styles.bottomVideoPlaceholder }>
                <Thumbnail
                    isAvatarCircled = { false }
                    participant = { this.props.localUser }
                    renderDisplayName = { true }
                    zOrder = { 1 }
                    styleOverrides = {{
                        ...styles.fillView,
                        borderRadius: 15
                    }}
                    tileView = { true } />
                {this.props.isSideUserAudioMuted
                && <View style = { styles.microphoneViewStyle }>
                    <Image
                        source = { require('../../../../../resources/img/muted_microphone.png') }
                        style = { styles.microphoneIconStyle } />
                </View>}
            </View>);
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
    const { inFocusUser, localUser, isWrapUpVisible } = ownProps;
    const placeholderUser = { name: UNKNOWN_NAME };

    const tracks = state['features/base/tracks'];
    const id = localUser?.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);

    const { placeholderData } = state['features/filmstrip'];

    return {
        inFocusUser,
        isWrapUpVisible,
        sideUser: _.isNil(localUser) ? placeholderUser : localUser,
        isSideUserAudioMuted: audioTrack?.muted ?? true,
        placeholderData
    };
}
export default connect(_mapStateToProps)(InFocusView);
