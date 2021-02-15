import React, { Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Alert, Text } from 'react-native';

import styles from './styles';

const UNEXPECTED_TITLE = 'Unexpected error occurred';
const GLOBAL_ERROR_MESSAGE = 'Jitsi global error occurred: ';

type Props = {
    children: Object
}

class CustomErrorBoundary extends Component<Props> {
    state = {
        error: null
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.log(`${GLOBAL_ERROR_MESSAGE} ${error.message}, more information: ${info}`);
    }

    render() {
        if (this.state.error) {
            return errorFallback(this.state.error, () => this.setState({ hasError: false }));
        }

        return (<ErrorBoundary
            FallbackComponent = { errorFallback }
            onError = { errorLogging }>
            { this.props.children }
        </ErrorBoundary>);
    }
}

function errorLogging(error) {
    console.log(GLOBAL_ERROR_MESSAGE + error.message);
}

function errorFallback({ error, resetErrorBoundary }) {
    errorLogging(error);

    Alert.alert(
        UNEXPECTED_TITLE,
        GLOBAL_ERROR_MESSAGE + error.message,
        [
            { onPress: resetErrorBoundary,
                text: 'TRY AGAIN ' },
            { text: 'OK' }
        ]
    );

    return (
        <View style = { styles.errorContainer } >
            <Text style = { styles.errorMessage }>{UNEXPECTED_TITLE}</Text>
        </View>
    );
}

export default CustomErrorBoundary;
