// @flow

import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';

/**
 * Wrapper function for the react-redux connect function to avoid having to
 * declare function types for flow, but still let flow warn for other errors.
 *
 * @param {Function?} mapStateToProps - Redux mapStateToProps function.
 * @param {Function?} mapDispatchToProps - Redux mapDispatchToProps function.
 * @returns {Connector}
 */
export function connect(
        mapStateToProps?: Function, mapDispatchToProps?: Function) {
    return reduxConnect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps);
}

/**
 * Determines whether {@code a} equals {@code b} according to deep comparison
 * (which makes sense for Redux and its state definition).
 *
 * @param {*} a - The value to compare to {@code b}.
 * @param {*} b - The value to compare to {@code a}.
 * @returns {boolean} True if {@code a} equals {@code b} (according to deep
 * comparison); false, otherwise.
 */
export function equals(a: any, b: any) {
    return _.isEqual(a, b);
}

/* eslint-enable max-params */

/**
 * Returns redux state from the specified {@code stateful} which is presumed to
 * be related to the redux state (e.g. The redux store, the redux
 * {@code getState} function).
 *
 * @param {Function|Object} stateful - The entity such as the redux store or the
 * redux {@code getState} function from which the redux state is to be
 * returned.
 * @returns {Object} The redux state.
 */
export function toState(stateful: Function | Object) {
    if (stateful) {
        if (typeof stateful === 'function') {
            return stateful();
        }

        const { getState } = stateful;

        if (typeof getState === 'function') {
            return getState();
        }
    }

    return stateful;
}
