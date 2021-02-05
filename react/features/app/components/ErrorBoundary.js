import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Dispatch } from 'redux';

import styles from '../../conference/components/native/styles';

type Props = {
    dispatch: Dispatch<any>,
    children: Object
};

export default class ErrorBoundary extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    render() {
        if (this.state.hasError) {
            return (<View style = { styles.conference }>
                <Text style = { styles.conference }>{'Something went wrong.'}</Text>
            </View>);
        }

        return this.props.children;
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error.message);
    }
}

