// @flow

import React, { Fragment } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { BaseApp } from '../../base/app';
import {
    sendCommand,
    removeCommand,
    editSpeakerViewVisibility
} from '../../base/conference';
import { storeConfig } from '../../base/config';
import { NativeEvents } from '../../base/constants';
import { muteMedia, toggleCameraFacingMode } from '../../base/media';
import { updateAvatar } from '../../base/participants';
import { showWrapUpButtons, updateSwiperIndex } from '../../base/responsive-ui';
import { toURLString } from '../../base/util';
import { setPlaceholderData, setCountdown } from '../../filmstrip';
import { UNDEFINED_JITSI_ERROR } from '../../mobile/external-api/actions';
import { OverlayContainer } from '../../overlay';
import { appNavigate, appConnect, appJoinRoom, appLeaveRoom } from '../actions';
import { getDefaultURL } from '../functions';
import logger from '../logger';

/**
 * The type of React {@code Component} props of {@link AbstractApp}.
 */
export type Props = {

    /**
     * XXX Refer to the implementation of loadURLObject: in
     * ios/sdk/src/JitsiMeetView.m for further information.
     */
    timestamp: any,

    /**
     * The URL, if any, with which the app was launched.
     */
    url: Object | string,

    /**
     * An object with user information (display name, email, avatar URL).
     */
    userInfo: ?Object,

    /**
     * Conference config as json string.
     */
    configJsonString: ?string
};

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends BaseApp<Props, *> {
    _init: Promise<*>;
    nativeEventListeners = [];

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentDidMount() {
        super.componentDidMount();

        this._init.then(() => {
            if (this._hasNativeConfigs()) {
                this._connectToXmppServer();
            } else {
                // If a URL was explicitly specified to this React Component, then
                // open it; otherwise, use a default.
                this._openURL(toURLString(this.props.url) || this._getDefaultURL());
            }
        });
    }

    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: Props) {
        const previousUrl = toURLString(prevProps.url);
        const currentUrl = toURLString(this.props.url);
        const previousTimestamp = prevProps.timestamp;
        const currentTimestamp = this.props.timestamp;

        this._init.then(() => {
            // Deal with URL changes.

            if (previousUrl !== currentUrl

                    // XXX Refer to the implementation of loadURLObject: in
                    // ios/sdk/src/JitsiMeetView.m for further information.
                    || previousTimestamp !== currentTimestamp) {
                if (this._hasNativeConfigs()) {
                    this._connectToXmppServer();
                } else {
                    this._openURL(currentUrl || this._getDefaultURL());
                }
            }
        });
    }

    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        if (this.nativeEventListeners) {
            this.nativeEventListeners.forEach(listener => listener.remove());
            this.nativeEventListeners = [];
        }
    }

    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionaly)
     * alongside the main element.
     *
     * @abstract
     * @protected
     * @returns {ReactElement}
     */
    _createExtraElement() {
        return (
            <Fragment>
                <OverlayContainer />
            </Fragment>
        );
    }

    _createMainElement: (React$Element<*>, Object) => ?React$Element<*>;

    /**
     * Gets the default URL to be opened when this {@code App} mounts.
     *
     * @protected
     * @returns {string} The default URL to be opened when this {@code App}
     * mounts.
     */
    _getDefaultURL() {
        return getDefaultURL(this.state.store);
    }

    /**
     * Navigates this {@code AbstractApp} to (i.e. Opens) a specific URL.
     *
     * @param {Object|string} url - The URL to navigate this {@code AbstractApp}
     * to (i.e. The URL to open).
     * @protected
     * @returns {void}
     */
    _openURL(url) {
        this.state.store.dispatch(appNavigate(toURLString(url)));
    }

    /**
     * Is config and user credentials given by native app?
     *
     * @private
     * @returns {boolean}
     */
    _hasNativeConfigs() {
        return typeof this.props.configJsonString === 'string'
            && typeof this.props.userInfo.userId === 'string'
            && typeof this.props.userInfo.password === 'string';
    }

    /**
     * Connect to xmpp server with config, userId and password.
     *
     * @private
     * @returns {void}
     */
    _connectToXmppServer() {
        // handle config set by native app
        try {
            const config = JSON.parse(this.props.configJsonString);

            this._storeConfig(config);
            this.state.store.dispatch(appConnect(config, this.props.userInfo.userId, this.props.userInfo.password));
            this._subscribeToNativeEvents();
        } catch (err) {
            const localErrorMessage = 'Something went wrong at parsing config json string!';

            logger.error(localErrorMessage, err);
            this.state.store.dispatch({
                type: UNDEFINED_JITSI_ERROR,
                message: localErrorMessage
            });
        }
    }

    /**
     * Stores config from props.
     *
     * @param {Object} config - Xmpp config object.
     * @private
     * @returns {void}
     */
    _storeConfig(config) {
        const url = `${this.props.url.serverURL}`;

        logger.info('Config from native app: \n', config);
        this.state.store.dispatch(storeConfig(url, config));
    }

    /**
     * Subscribe to events sent by native app.
     *
     * @private
     * @returns {void}
     */
    _subscribeToNativeEvents() {
        const VideoConfBridge = NativeModules.VideoConfBridge;
        const videoConfBridgeEmitter = new NativeEventEmitter(VideoConfBridge);
        const dispatch = this.state.store.dispatch;

        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.VIDEOCONF_JOIN,
            (dataJsonString: string) => {
                const { roomName, audioMuted, videoMuted, noCam, noMic, commandsToListenTo }
                    = JSON.parse(dataJsonString);

                this.props.url.room = roomName;
                this.state.store.dispatch(appJoinRoom(this.props.url.serverURL, roomName,
                    audioMuted, videoMuted, noCam, noMic, commandsToListenTo));
            }));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.VIDEOCONF_LEAVE,
            () => dispatch(appLeaveRoom())));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.MUTE_MEDIA,
            (dataJsonString: string) => dispatch(muteMedia(dataJsonString, this.state.store.dispatch))));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SWITCH_CAMERA,
            () => dispatch(toggleCameraFacingMode())));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SEND_COMMAND,
            (dataJsonString: string) => dispatch(sendCommand(dataJsonString))));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.REMOVE_COMMAND,
            (commandName: string) => dispatch(removeCommand(commandName))));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SET_CURRENT_SWIPER_INDEX,
            (pageNumber: string) => dispatch(updateSwiperIndex(Number(pageNumber)))));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SHOW_WRAP_UP_BUTTONS,
            () => dispatch(showWrapUpButtons())));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.PLACEHOLDER_DATA,
            (dataJsonString: string) => {
                const { title, imageUrl } = JSON.parse(dataJsonString);
                dispatch(setPlaceholderData(title, imageUrl));
            }));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SET_COUNTDOWN,
            (jsonString: string) => {
                const { fromDateString, toDateString } = JSON.parse(jsonString);

                dispatch(setCountdown(fromDateString, toDateString));
            }));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.SHOW_SPEAKER_VIEW,
            (showSpeakerView: boolean | number) => dispatch(editSpeakerViewVisibility(Boolean(showSpeakerView)))));
        this.nativeEventListeners.push(videoConfBridgeEmitter.addListener(NativeEvents.UPDATE_AVATAR,
            (dataJsonString: string) => dispatch(updateAvatar(dataJsonString))));
    }
}
