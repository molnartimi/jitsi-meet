// @flow

import React, { Fragment } from 'react';

import { BaseApp } from '../../base/app';
import { storeConfig } from '../../base/config';
import { toURLString } from '../../base/util';
import { OverlayContainer } from '../../overlay';
import { appNavigate, appConnect } from '../actions';
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

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentDidMount() {
        super.componentDidMount();

        this._init.then(() => {
            if (typeof this.props.configJsonString === 'string'
                    && typeof this.props.userInfo.userId === 'string'
                    && typeof this.props.userInfo.password === 'string') {
                // handle config set by native app
                try {
                    const config = JSON.parse(this.props.configJsonString);

                    this._storeConfig(config);
                    this._connectToXmppServer(config, this.props.userInfo.userId, this.props.userInfo.password);
                } catch (e) {
                    logger.error('Something went wrong at parsing config json string', e);
                }
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
                this._openURL(currentUrl || this._getDefaultURL());
            }
        });
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
     * Connect to xmpp server with config, userId and password.
     *
     * @param {Object|string} config - Xmpp server config.
     * @param {string} userId - User id to log in.
     * @param {string} password - Password of user to log in with.
     * @private
     * @returns {void}
     */
    _connectToXmppServer(config, userId, password) {
        this.state.store.dispatch(appConnect(config, userId, password));
    }

    /**
     * Stores config from props.
     *
     * @param {Object} config - Xmpp config object.
     * @private
     * @returns {void}
     */
    _storeConfig(config) {
        const url = `${this.props.url.serverURL}/${this.props.url.room}`;

        logger.info('Config from native app: \n', config);
        this.state.store.dispatch(storeConfig(url, config));
    }
}
