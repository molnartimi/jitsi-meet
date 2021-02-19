// @flow

import type { Component } from 'react';

import { isRoomValid } from '../base/conference';
import { toState } from '../base/redux';
import { Conference } from '../conference';
import {
    BlankPage,
    WelcomePage,
    isWelcomePageAppEnabled
} from '../welcome';

/**
 * Object describing application route.
 *
 * @typedef {Object} Route
 * @property {Component} component - React Component constructor.
 * @property {string|undefined} href - New location, in case navigation involves
 * a location change.
 */
export type Route = {
    component: Class<Component<*>>,
    href: ?string
};

/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {(Function|Object)} stateful - THe redux store, state, or
 * {@code getState} function.
 * @returns {Promise<Route>}
 */
export function _getRouteToRender(stateful: Function | Object): Promise<Route> {
    const state = toState(stateful);

    return _getMobileRoute(state);
}

/**
 * Returns the {@code Route} to display on the React Native app.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Route>}
 */
function _getMobileRoute(state): Promise<Route> {
    const route = _getEmptyRoute();

    if (isRoomValid(state['features/base/conference'].room)) {
        route.component = Conference;
    } else if (isWelcomePageAppEnabled(state)) {
        route.component = WelcomePage;
    } else {
        route.component = BlankPage;
    }

    return Promise.resolve(route);
}

/**
 * Returns the default {@code Route}.
 *
 * @returns {Route}
 */
function _getEmptyRoute(): Route {
    return {
        component: BlankPage,
        href: undefined
    };
}
