import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { connect } from '../../../base/redux';

import styles from './styles';

/**
 * React component for tap-view.
 *
 * @returns {Component} - A React component.
 */
class TapView extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <View
                style = { styles.fillView }>
                {this._createTemplateImageComponent()}
            </View>);
    }

    /**
     * Adds a single full page image.
     *
     * @returns {ReactElement}
     * @private
     */
    _createTemplateImageComponent() {
        return (<Image
            source = {{
                // TODO: make temporary or replace with final design
                uri: 'https://media.cliotest.com/VS/0da11b19-985d-497b-a532-c6120f4dec5f.png'
            }}
            style = { styles.fillView } />);
    }
}

export default connect()(TapView);
