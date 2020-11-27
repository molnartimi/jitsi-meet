import React from 'react';
import { Text, View } from 'react-native';

import { connect } from '../../../base/redux';

import Thumbnail from './Thumbnail';
import styles from './styles';


/**
 * InFront component's property types.
 */
type Props = {

    /**
     * Main user object for show the user in the whole screen.
     */
    _mainUser: Object,

    /**
     * Side user object for show the user in the bottom right corner of the screen.
     */
    _sideUser: Object
}

const NAME_PLACEHOLDER = 'FALL \'20 COLLECTION';

/**
 * React component for in-focus view.
 *
 * @param {Props} props - Properties passed to this functional component.
 * @returns {Component} - A React component.
 */
function InFocusView(props: Props) {
    const {
        _mainUser: mainUser,
        _sideUser: sideUser
    } = props;


    return (
        <View
            style = { styles.fillView }>

            {_createMainUserComponent(mainUser)}

            <View
                style = { styles.inFrontTopView }>
                {_createTopNameComponent(mainUser)}
                {_createShowButtonsPlaceholder()}
                {_createBottomVideoComponent(sideUser)}
            </View>
        </View>);
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
        _mainUser: mainUser,
        _sideUser: sideUser
    };
}
export default connect(_mapStateToProps)(InFocusView);
