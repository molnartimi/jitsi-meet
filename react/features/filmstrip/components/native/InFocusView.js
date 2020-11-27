import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { connect } from '../../../base/redux';

import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {

    /**
     * Main user object for show the user in the whole screen.
     */
    mainUser: Object,

    /**
     * Side user object for show the user in the bottom right corner of the screen.
     */
    sideUser: Object
}

const NAME_PLACEHOLDER = 'FALL \'20 COLLECTION';

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

                {_createMainUserComponent(this.props.mainUser)}

                <View
                    style = { styles.inFrontTopView }>
                    {_createTopNameComponent(this.props.mainUser)}
                    {_createShowButtonsPlaceholder()}
                    {_createBottomVideoComponent(this.props.sideUser)}
                </View>
            </View>);
    }
}

function _createTopNameComponent(mainUser) {
    return (<Text style = { styles.nameComponent }>{
            mainUser?.name == null ? NAME_PLACEHOLDER : mainUser.name
    }</Text>);
}

function _createShowButtonsPlaceholder() {
    return (<View
        style = { styles.buttonPlaceholder } />);
}

function _createBottomVideoComponent(sideUser) {
    return (<View
        style = { styles.bottomVideoContainer }>

        <View
            style = { styles.bottomVideoPlaceholder }>
            <Thumbnail
                participant = { sideUser }
                renderDisplayName = { true }
                styleOverrides = { styles.fillView }
                tileView = { true } />
        </View>
    </View>);
}

function _createMainUserComponent(mainUser) {
    return (<Thumbnail
        participant = { mainUser }
        renderDisplayName = { true }
        styleOverrides = { styles.inFrontBackView }
        tileView = { true } />);
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

    return {
        mainUser: mainUser === undefined ? {} : mainUser,
        sideUser: sideUser === undefined ? {} : sideUser
    };
}
export default connect(_mapStateToProps)(InFocusView);
