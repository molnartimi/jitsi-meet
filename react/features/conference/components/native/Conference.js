// @flow

import React from 'react';

import { appNavigate } from '../../../app/actions';
import { IN_FOCUS_COMMAND } from '../../../base/conference';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { TileView } from '../../../filmstrip';
import Thumbnail from '../../../filmstrip/components/native/Thumbnail';
import { BackButtonRegistry } from '../../../mobile/back-button';
import {
    AbstractConference,
    abstractMapStateToProps
} from '../AbstractConference';
import type { AbstractProps } from '../AbstractConference';

// Removing the unused Labels import somehow breaks the app, so disabling the
// linter for the import block.
// Can't simply disable no-unused-vars rule for the Labels import line, becuase
// other lint rules make it impossible. If you don't believe me, try it ;)
/* eslint-disable */
import CustomErrorBoundary from './CustomErrorBoundary';
import Labels from './Labels';
import styles from './styles';
import { TestConnectionInfo } from '../../../base/testing';
/* eslint-enable */

/**
 * The type of the React {@code Component} props of {@link Conference}.
 */
type Props = AbstractProps & {
    dispatch: Function,
    _isSpeakerViewShowed: boolean,
    _largeVideoParticipant: Object
};

/**
 * The conference page of the mobile (i.e. React Native) application.
 */
class Conference extends AbstractConference<Props, *> {

    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
    }

    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        BackButtonRegistry.addListener(this._onHardwareBackPress);
    }

    /**
     * Implements {@link Component#componentWillUnmount()}. Invoked immediately
     * before this component is unmounted and destroyed. Disconnects the
     * conference described by the redux store/state.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // Tear handling any hardware button presses for back navigation down.
        BackButtonRegistry.removeListener(this._onHardwareBackPress);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <CustomErrorBoundary>
                <Container style = { styles.conference }>
                    { this._renderContent() }
                </Container>
            </CustomErrorBoundary>
        );
    }

    _onHardwareBackPress: () => boolean;

    /**
     * Handles a hardware button press for back navigation. Enters Picture-in-Picture mode
     * (if supported) or leaves the associated {@code Conference} otherwise.
     *
     * @returns {boolean} Exiting the app is undesired, so {@code true} is always returned.
     */
    _onHardwareBackPress() {
        Promise.reject(new Error('PiP not enabled')).catch(() => {
            this.props.dispatch(appNavigate(undefined));
        });

        return true;
    }

    /**
     * Renders the content for the Conference container.
     *
     * @private
     * @returns {React$Element}
     */
    _renderContent() {
        return (
            this.props._conference
                ? this.props._isSpeakerViewShowed
                    ? this._createSelfFrameVideoComponent()
                    : <TileView />
                : null
        );
    }

    _createSelfFrameVideoComponent() {
        return (
            <Thumbnail
                isTileView = { true }
                participant = { this.props._largeVideoParticipant }
                styleOverrides = { styles.selfFrame }
                zOrder = { 1 } />
        );
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code Conference}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const {
        isSpeakerViewShowed,
        conference
    } = state['features/base/conference'];

    const participants = state['features/base/participants'];
    const dominantSpeaker = participants.find(p => p.dominantSpeaker);
    const focusedUser = participants.find(p => p[IN_FOCUS_COMMAND]);
    const localUser = participants[0];
    const largeVideoParticipant = isSpeakerViewShowed
        ? dominantSpeaker ?? focusedUser ?? localUser
        : focusedUser;

    return {
        ...abstractMapStateToProps(state),
        _conference: conference,
        _largeVideoParticipant: largeVideoParticipant,
        _isSpeakerViewShowed: isSpeakerViewShowed
    };
}

export default connect(_mapStateToProps)(Conference);
