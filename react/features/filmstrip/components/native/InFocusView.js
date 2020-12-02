import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import { MEDIA_TYPE } from '../../../base/media';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';

import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {
    mainUser: Object,
    sideUser: Object,
    isSideUserAudioMuted: boolean
}

const NAME_PLACEHOLDER = 'FALL \'20 COLLECTION';
const UNKNOWN_NAME = 'UNKNOWN';

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

                {this.props.mainUser === undefined
                    ? _createDefaultMainUserComponent()
                    : _createMainUserComponent(this.props.mainUser)}

                <View
                    style = { styles.inFrontTopView }>
                    {this.props.mainUser !== undefined && _createTopNameComponent(this.props.mainUser)}
                    {this.props.mainUser === undefined
                        ? _createDefaultMainUserName()
                        : _createShowButtonsPlaceholder()}
                    {_createBottomVideoComponent(this.props.sideUser, this.props.isSideUserAudioMuted)}
                </View>
            </View>);
    }
}

function _createTopNameComponent(mainUser) {
    return (<Text style = { styles.nameComponent }>{
            mainUser?.name == null ? UNKNOWN_NAME : mainUser.name
    }</Text>);
}

function _createDefaultMainUserName() {
    return (<View
        style = { styles.buttonPlaceholder } >
        <Text style = { styles.nameComponent }>{NAME_PLACEHOLDER}</Text>
    </View>);
}

function _createShowButtonsPlaceholder() {
    return (<View
        style = { styles.buttonPlaceholder } />);
}

function _createBottomVideoComponent(sideUser, isSideUserAudioMuted) {
    return (<View
        style = { styles.bottomVideoContainer }>

        <View
            style = { styles.bottomVideoPlaceholder }>
            <Thumbnail
                isAvatarCircled = { false }
                participant = { sideUser }
                renderDisplayName = { true }
                styleOverrides = {{ ...styles.fillView,
                    borderRadius: 15 }}
                tileView = { true } />
            {isSideUserAudioMuted
            && <View style = { styles.microphoneViewStyle } >
                <Image
                    source = { require('../../../../../resources/img/muted_microphone.png') }
                    style = { styles.microphoneIconStyle } />
            </View>}
        </View>
    </View>);
}

function _createMainUserComponent(mainUser) {
    return (<Thumbnail
        isAvatarCircled = { true }
        participant = { mainUser }
        renderDisplayName = { true }
        styleOverrides = { styles.inFrontBackView }
        tileView = { true } />);
}

function _createDefaultMainUserComponent() {
    return (<Image
        source = {{
            uri: 'https://media.cliotest.com/VS/0da11b19-985d-497b-a532-c6120f4dec5f.png'
        }}
        style = { styles.fillView } />);
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Props} ownProps - Properties of component.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const { mainUser, sideUser } = ownProps;
    const placeholderUser = { name: UNKNOWN_NAME };

    const tracks = state['features/base/tracks'];
    const id = sideUser?.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);

    return {
        mainUser,
        sideUser: sideUser === undefined ? placeholderUser : sideUser,
        isSideUserAudioMuted: audioTrack?.muted ?? true
    };
}
export default connect(_mapStateToProps)(InFocusView);
