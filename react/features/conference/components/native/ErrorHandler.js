import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Button, Text } from 'react-native';

import styles from './styles';

const myErrorHandler = (error: Error) => {
    console.log(`Jitsi global error occurred: ${error.message}`);
};

function ErrorFallback({ resetErrorBoundary }) {
    return (
        <View
            style = { styles.errorContainer }>
            <View>
                <Text>{'Something went wrong. Please reload the app.'}</Text>
                <Button
                    onPress = { resetErrorBoundary }
                    title = 'TRY AGAIN' />
            </View>
        </View>
    );
}

export const ErrorHandler = ({ children }: { children: React.ReactNode }) => (
    <ErrorBoundary
        FallbackComponent = { ErrorFallback }
        onError = { myErrorHandler }>
        {children}
    </ErrorBoundary>
);
