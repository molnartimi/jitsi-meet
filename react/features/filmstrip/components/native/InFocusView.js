import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import { MEDIA_TYPE } from '../../../base/media';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';

import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {
    inFocusUser: Object,
    localUser: Object,
    isSideUserAudioMuted: boolean
}

// TODO: make NAME_PLACEHOLDER settable by tabletparty.
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

                {_.isNil(this.props.inFocusUser)
                    ? this._createTemplateImageComponent()
                    : this._createInFocusVideoComponent()}

                {this._createInFocusTopView()}
            </View>);
    }

    /**
     * This is the View of the in focus user video. It fills the whole screen.
     * The in focus screen other elements will be rendered on the top of it.
     *
     * @returns {ReactElement}
     * @private
     */
    _createInFocusVideoComponent() {
        return (<Thumbnail
            isAvatarCircled = { true }
            participant = { this.props.inFocusUser }
            renderDisplayName = { true }
            styleOverrides = { styles.inFrontBackView }
            tileView = { true } />);
    }

    _createTemplateImageComponent() {
        return (<Image
            source = {{
                // TODO: make this URL settable by tabletparty.
                uri: 'https://media.cliotest.com/VS/0da11b19-985d-497b-a532-c6120f4dec5f.png'
            }}
            style = { styles.fillView } />);
    }

    /**
     * This is the View which appears at the top of the in focus user video.
     * This is a floating layout. It contains the user name view,
     * the wrap up buttons and the self frame video also.
     *
     * @returns {ReactElement}
     * @private
     */
    _createInFocusTopView() {
        return (<View
            style = { styles.inFrontTopView }>

            {!_.isNil(this.props.inFocusUser)
            && this._createTopNameComponent(this.props.inFocusUser)}

            {_.isNil(this.props.inFocusUser)
                ? this._createDefaultInFocusUserName()
                : this._createWrapUpButtonsPlaceholder()}
            {this._createSelfFrameVideoComponent()}
        </View>);
    }

    _createTopNameComponent() {
        return (<Text style = { styles.nameComponent }>{
            _.isNil(this.props.inFocusUser?.name)
                ? UNKNOWN_NAME
                : this.props.inFocusUser.name
        }</Text>);
    }

    _createDefaultInFocusUserName() {
        return (<View
            style = { styles.buttonPlaceholder }>
            <Text style = { styles.nameComponent }>{NAME_PLACEHOLDER}</Text>
        </View>);
    }

    _createWrapUpButtonsPlaceholder() {
        return (<View
            style = { styles.buttonPlaceholder } />);
    }

    _createSelfFrameVideoComponent() {
        return (<View
            style = { styles.bottomVideoContainer }>

            <View
                style = { styles.bottomVideoPlaceholder }>
                <Thumbnail
                    isAvatarCircled = { false }
                    participant = { this.props.localUser }
                    renderDisplayName = { true }
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
            </View>
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
    const { inFocusUser, localUser } = ownProps;
    const placeholderUser = { name: UNKNOWN_NAME };

    const tracks = state['features/base/tracks'];
    const id = localUser?.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);

    return {
        inFocusUser,
        sideUser: _.isNil(localUser) ? placeholderUser : localUser,
        isSideUserAudioMuted: audioTrack?.muted ?? true
    };
}
export default connect(_mapStateToProps)(InFocusView);
