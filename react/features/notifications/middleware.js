/* @flow */

import { getCurrentConference } from '../base/conference';
import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_ROLE,
    PARTICIPANT_UPDATED,
    getParticipantById,
    getParticipantDisplayName
} from '../base/participants';
import { MiddlewareRegistry, StateListenerRegistry } from '../base/redux';

import {
    clearNotifications,
    showNotification,
    showParticipantJoinedNotification
} from './actions';
import { NOTIFICATION_TIMEOUT } from './constants';
import { joinLeaveNotificationsDisabled } from './functions';

declare var interfaceConfig: Object;

/**
 * Middleware that captures actions to display notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    try {
    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, notifications MIDDLEWARE caught PARTICIPANT_JOINED, whats next ?');
    }
    switch (action.type) {
    case PARTICIPANT_JOINED: {
        console.log('!!!___oof, NOTIFICATIONS MIDDLEWARE, attempting next(action)');
        const result = next(action);
        console.log('!!!___oof, NOTIFICATIONS MIDDLEWARE, returned with next(action)');
        const { participant: p } = action;
        const { dispatch, getState } = store;
        const displayName = getParticipantDisplayName(getState, p.id);

        if (!p.local && !joinLeaveNotificationsDisabled()) {
            console.log('!!!___oof, NOTIFICATIONS MIDDLEWARE, attempting dispatch(showParticipantJoinedNotification)', displayName);
            dispatch(showParticipantJoinedNotification(displayName));
        }

        if (typeof interfaceConfig === 'object'
                && !interfaceConfig.DISABLE_FOCUS_INDICATOR && p.role === PARTICIPANT_ROLE.MODERATOR) {
            // Do not show the notification for mobile and also when the focus indicator is disabled.

            console.log('!!!___oof, NOTIFICATIONS MIDDLEWARE, attempting dispatch(showNotification)', displayName, NOTIFICATION_TIMEOUT);
            dispatch(showNotification({
                descriptionArguments: { to: displayName || '$t(notify.somebody)' },
                descriptionKey: 'notify.grantedTo',
                titleKey: 'notify.somebody',
                title: displayName
            },
            NOTIFICATION_TIMEOUT));
        }
        console.log('!!!___oof, notifications middleware, ran through. should be fine.');
        return result;
    }
    case PARTICIPANT_LEFT: {
        if (!joinLeaveNotificationsDisabled()) {
            const participant = getParticipantById(
                store.getState(),
                action.participant.id
            );

            if (typeof interfaceConfig === 'object'
                && participant
                && !participant.local) {
                store.dispatch(showNotification({
                    descriptionKey: 'notify.disconnected',
                    titleKey: 'notify.somebody',
                    title: participant.name
                }, NOTIFICATION_TIMEOUT));
            }
        }

        return next(action);
    }
    case PARTICIPANT_UPDATED: {
        if (typeof interfaceConfig === 'undefined' || interfaceConfig.DISABLE_FOCUS_INDICATOR) {
            // Do not show the notification for mobile and also when the focus indicator is disabled.
            return next(action);
        }

        const { id, role } = action.participant;
        const state = store.getState();
        const oldParticipant = getParticipantById(state, id);
        const oldRole = oldParticipant?.role;

        if (oldRole && oldRole !== role && role === PARTICIPANT_ROLE.MODERATOR) {
            const displayName = getParticipantDisplayName(state, id);

            store.dispatch(showNotification({
                descriptionArguments: { to: displayName || '$t(notify.somebody)' },
                descriptionKey: 'notify.grantedTo',
                titleKey: 'notify.somebody',
                title: displayName
            },
            NOTIFICATION_TIMEOUT));
        }

        return next(action);
    }
    }

    if (action.type === 'PARTICIPANT_JOINED') {
        console.log('!!!___oof, notifications MIDDLEWARE will return next(action)');
    }

    return next(action);
    } catch (e) {
        console.error('!!!___oof, notifications MIDDLEWARE caught a error !!!', e);
    }
});

/**
 * StateListenerRegistry provides a reliable way to detect the leaving of a
 * conference, where we need to clean up the notifications.
 */
StateListenerRegistry.register(
    /* selector */ state => getCurrentConference(state),
    /* listener */ (conference, { dispatch }) => {
        if (!conference) {
            dispatch(clearNotifications());
        }
    }
);
