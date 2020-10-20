/* @flow */

import { Dispatch } from 'redux';
import { $iq, $msg, Strophe } from 'strophe.js';

import { decycleJSON } from '../../mobile/external-api';
import { toState } from '../redux';
import { toURLString } from '../util';

import { XMPP_RESULT } from './actionTypes';
import logger from './logger';


/**
 * Type of parameter got from native app in an {@code NativeXmppPostMethodEventData}.
 *
 * In some cases, functions take callback methods as parameter.
 * eg. connection.muc.join(roomId, nick, onMessage: () => boolean, onPresence: () => boolean)
 * In this case we send a specific object from native app,
 * eg. { nativeResponseType: 'chat_message', defaultReturnValueOfCallback: true }
 * We have to call post method with a callback method, and return the value to native app with which callback is called,
 * to let it to handle on its own.
 */
type NativeXmppPostMethodEventParam = any | { nativeResponseType: string, defaultReturnValueOfCallback?: any };

/**
 * These classes are implemented in Tabletparty.
 * TODO refactor them into an npm package.
 * They are used to describe Strophe $ig and $msg builders in a serializable form.
 */
type BaseXmlNode = {
    children: BaseXmlNode[],
    parent: BaseXmlNode,
    text?: string
};

type XmlNode = {
    children: BaseXmlNode[],
    parent: BaseXmlNode,
    name: string,
    text?: string,
    attr?: any
};

// eslint-disable-next-line no-unused-vars
type TextXmlNode = {
    children: BaseXmlNode[],
    parent: BaseXmlNode,
    text: string
}

/**
 * Figures out what's the current conference URL which is supposed to indicate what conference is currently active.
 * When not currently in any conference and not trying to join any then 'undefined' is returned.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {string|undefined}
 * @private
 */
export function getCurrentConferenceUrl(stateful: Function | Object) {
    const state = toState(stateful);
    let currentUrl;

    if (isInviteURLReady(state)) {
        currentUrl = toURLString(getInviteURL(state));
    }

    // Check if the URL doesn't end with a slash
    if (currentUrl && currentUrl.substr(-1) === '/') {
        currentUrl = undefined;
    }

    return currentUrl ? currentUrl : undefined;
}

/**
 * Retrieves a simplified version of the conference/location URL stripped of URL params (i.e. Query/search and hash)
 * which should be used for sending invites.
 * NOTE that the method will throw an error if called too early. That is before the conference is joined or before
 * the process of joining one has started. This limitation does not apply to the case when called with the URL object
 * instance. Use {@link isInviteURLReady} to check if it's safe to call the method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function or the URL object
 * to be stripped.
 * @returns {string}
 */
export function getInviteURL(stateOrGetState: Function | Object): string {
    const state = toState(stateOrGetState);
    let locationURL
        = state instanceof URL
            ? state
            : state['features/base/connection'].locationURL;

    // If there's no locationURL on the base/connection feature try the base/config where it's set earlier.
    if (!locationURL) {
        locationURL = state['features/base/config'].locationURL;
    }

    if (!locationURL) {
        throw new Error('Can not get invite URL - the app is not ready');
    }

    const { inviteDomain } = state['features/dynamic-branding'];
    const urlWithoutParams = getURLWithoutParams(locationURL);

    if (inviteDomain) {
        const meetingId
            = state['features/base/config'].brandingRoomAlias || urlWithoutParams.pathname;

        return `${inviteDomain}/${meetingId}`;
    }

    return urlWithoutParams.href;
}

/**
 * Checks whether or not is safe to call the {@link getInviteURL} method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function.
 * @returns {boolean}
 */
export function isInviteURLReady(stateOrGetState: Function | Object): boolean {
    const state = toState(stateOrGetState);

    return Boolean(state['features/base/connection'].locationURL || state['features/base/config'].locationURL);
}

/**
 * Gets a {@link URL} without hash and query/search params from a specific
 * {@code URL}.
 *
 * @param {URL} url - The {@code URL} which may have hash and query/search
 * params.
 * @returns {URL}
 */
export function getURLWithoutParams(url: URL): URL {
    const { hash, search } = url;

    if ((hash && hash.length > 1) || (search && search.length > 1)) {
        url = new URL(url.href); // eslint-disable-line no-param-reassign
        url.hash = '';
        url.search = '';

        // XXX The implementation of URL at least on React Native appends ? and
        // # at the end of the href which is not desired.
        let { href } = url;

        if (href) {
            href.endsWith('#') && (href = href.substring(0, href.length - 1));
            href.endsWith('?') && (href = href.substring(0, href.length - 1));

            // eslint-disable-next-line no-param-reassign
            url.href === href || (url = new URL(href));
        }
    }

    return url;
}

/**
 * Gets a URL string without hash and query/search params from a specific
 * {@code URL}.
 *
 * @param {URL} url - The {@code URL} which may have hash and query/search
 * params.
 * @returns {string}
 */
export function getURLWithoutParamsNormalized(url: URL): string {
    const urlWithoutParams = getURLWithoutParams(url).href;

    if (urlWithoutParams) {
        return urlWithoutParams.toLowerCase();
    }

    return '';
}

/**
 * Converts a specific id to jid if it's not jid yet.
 *
 * @param {string} id - User id or jid.
 * @param {Object} configHosts - The {@code hosts} part of the {@code config}
 * object.
 * @returns {string} A string in the form of a JID (i.e.
 * {@code user@server.com}).
 */
export function toJid(id: string, { authdomain, domain }: Object): string {
    return id.indexOf('@') >= 0 ? id : `${id}@${authdomain || domain}`;
}

/**
 * Unwrap xmpp connection object from Jitsi connection.
 *
 * @param {JitsiMeetJS.JitsiConnection} connection - JitsiMeetJS connection object.
 * @returns {*|null}
 */
export function getStropheConnection(connection: JitsiMeetJS.JitsiConnection): Strophe.Connection {
    return connection && connection.xmpp && connection.xmpp.connection
        ? connection.xmpp.connection._stropheConn
        : null;
}

/**
 * Convert specific parameters got from native app to javascript parameters.
 *
 * @param {NativeXmppPostMethodEventParam} param - A value sent with xmpp post method event.
 * @param {Dispatch<any>} dispatch - Redux dispatch function.
 * @returns {any} - The converted value.
 */
export function convertXmppPostMethodParam(param: NativeXmppPostMethodEventParam, dispatch: Dispatch<any>): any {
    logger.info('TIMI LOG PARAM', param);
    if (param === 'null') {
        // we send function parameters in an array from native app,
        // but iOS Swift don't allow us to insert NULL into an array
        return null;
    } else if (param === 'undefined') {
        return undefined;
    } else if (param && param.nativeResponseType) {
        // Some functions take callback methods as parameters.
        // We can't send them through native app, so we send a object with a type string,
        // and we will send back the objects with which callbacks are called with this type to native app.
        return callbackParam => {
            logger.info('Xmpp callback called added in function', param.nativeResponseType);
            dispatch(sendXmppResult(param.nativeResponseType, callbackParam));

            return param.defaultReturnValueOfCallback;
        };
    } else if (param instanceof Object) {
        const decycledParam = decycleJSON(param);

        if (decycledParam.name && decycledParam.children) {
            // create Strophe.Builder objects from XmlNode
            if (decycledParam.name === 'iq') {
                logger.info('Creating $IQ in convertXmppPostMethodParam');

                return createIQFromXml(decycledParam);
            } else if (decycledParam.name === 'msg') {
                logger.info('Creating $MSQ in convertXmppPostMethodParam');

                return createMSGFromXml(decycledParam);
            }
        }
    }

    return param;
}

/**
 * Emit event to send data to native app via external api.
 *
 * @param {string} resultType - Id of result type (eg. 'chat_message').
 * @param {any} value - Value of result (eg. Stanza element of received chat message).
 * @returns {{type: string, resultType: string, value: *}}
 */
export function sendXmppResult(resultType: string, value: any) {
    return {
        type: XMPP_RESULT,
        resultType,
        value
    };
}

/**
 * Create a $iq Strophe.Builder from the description.
 *
 * @param {XmlNode} xmlRoot - Root node of description of Strophe builder.
 * @returns {Strophe.Builder}
 */
export function createIQFromXml(xmlRoot: XmlNode): Strophe.Builder {
    const iq = $iq(xmlRoot.attr);

    return buildStropheBuilder(iq, xmlRoot);
}

/**
 * Create a $msg Strophe.Builder from the description.
 *
 * @param {XmlNode} xmlRoot - Root node of description of Strophe builder.
 * @returns {Strophe.Builder}
 */
export function createMSGFromXml(xmlRoot: XmlNode): Strophe.Builder {
    const iq = $msg(xmlRoot.attr);

    return buildStropheBuilder(iq, xmlRoot);
}

/**
 * Append new nodes to given Strophe.Builder according to the description.
 *
 * @param {Strophe.Builder} builder - Strophe builder to attach new children.
 * @param {BaseXmlNode} node - Current node in description.
 * @returns {Strophe.Builder}
 */
function buildStropheBuilder(builder: Strophe.Builder, node: BaseXmlNode): Strophe.Builder {
    let newBuilder = builder;

    node.children.forEach((child, i) => {
        if (child.name) {
            newBuilder = newBuilder.c(child.name, child.attr, child.text);
        } else {
            newBuilder = newBuilder.t(child.text);
        }
        newBuilder = buildStropheBuilder(newBuilder, child);

        const shouldUp = node.children.length > 1 && i !== node.children.length - 1;

        if (shouldUp) {
            newBuilder = newBuilder.up();
        }
    });

    return newBuilder;
}
