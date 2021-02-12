// @flow

// Apply all necessary polyfills as early as possible to make sure anything imported henceforth
// sees them.
import './features/mobile/polyfills';
import 'react-native-url-polyfill/auto';

import React, { PureComponent } from 'react';
import { AppRegistry, Alert } from 'react-native';
import {
    setJSExceptionHandler, setNativeExceptionHandler
} from 'react-native-exception-handler';

import { App } from './features/app/components';
import { _initLogging } from './features/base/logging/functions';
import { IncomingCallApp } from './features/mobile/incoming-call';

declare var __DEV__;

/**
 * The type of the React {@code Component} props of {@link Root}.
 */
type Props = {

    /**
     * The URL, if any, with which the app was launched.
     */
    url: Object | string
};

/**
 * React Native doesn't support specifying props to the main/root component (in
 * the JS/JSX source code). So create a wrapper React Component (class) around
 * features/app's App instead.
 *
 * @extends Component
 */
class Root extends PureComponent<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <App
                { ...this.props } />
        );
    }
}

// Initialize logging.
_initLogging();

// HORRIBLE HACK ALERT! React Native logs the initial props with `console.log`. Here we are quickly patching it
// to avoid logging potentially sensitive information.
if (!__DEV__) {
    /* eslint-disable */

    const __orig_console_log = console.log;
    const __orig_appregistry_runapplication = AppRegistry.runApplication;

    AppRegistry.runApplication = (...args) => {
        // $FlowExpectedError
        console.log = () => {};
        __orig_appregistry_runapplication(...args);
        // $FlowExpectedError
        console.log = __orig_console_log;
    };

    /* eslint-enable */
}


// Register the main/root Component of JitsiMeetView.
AppRegistry.registerComponent('App', () => Root);

// Register the main/root Component of IncomingCallView.
AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);


const errorHandler = (e, isFatal) => {
    console.log(`Jitsi global JS error occurred: ${e.message}`);
    if (isFatal) {
        Alert.alert(
            'Unexpected error occurred',
            `Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`
        );
    }
};

const nativeHandler = exceptionString => {
    console.log(`Jitsi global NATIVE error occurred: ${exceptionString}`);
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler(nativeHandler);
