// @flow

import moment, { Moment } from 'moment';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { getLogger } from '../../../base/logging';

import styles from './styles';


/**
 * The type of React {@code Component} props of {@link PreShowCountdown}.
 */
export type Props = {
    startTime: string,
    endTime: string
}

/**
 * React component for pre-show countdown.
 *
 * @param {Props} props - Properties passed to this functional component.
 * @returns {Component} - A React component.
 */
export class PreShowCountdown extends Component<Props> {
    _intervalId: number;

    constructor(props: Props) {
        super(props);
        this.state = { remainingTime: this._calculateRemainingTime() };
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._setIntervalToDecreaseTime();
    }

    /**
     * Implements React's {@link Component#componentWillUnmount}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._clearInterval();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        if (!this._isRemainingTimeValid(this.state.remainingTime)) {
            return null;
        }

        return (
            <View style = { styles.preShowCountdownContainer }>
                <Text style = { styles.preShowCountdownStartingIn }>{'Starting in: '}</Text>
                <Text style = { styles.preShowCountdownTimer }>{this._getFormattedTimeString()}</Text>
            </View>
        );
    }

    /**
     * Returns the remaining time to show in countdown.
     *
     * @returns {Moment}
     * @private
     */
    _calculateRemainingTime(): Moment {
        const DATE_TIME_FORMAT = 'YYYY/MM/DD hh:mm';
        let startMoment, targetMoment;

        try {
            startMoment = moment(this.props.startTime, DATE_TIME_FORMAT);
            targetMoment = moment(this.props.endTime, DATE_TIME_FORMAT);
        } catch (e) {
            getLogger('filmstrip/countdown').error('Can\'t parse moments of countdown component',
                this.props.startTime, this.props.endTime, e);

            return undefined;
        }

        return moment(targetMoment.valueOf() - startMoment.valueOf()).utc();
    }

    /**
     * Check if remaining time is initialized and not finished.
     *
     * @param {Moment} time - Remaining time to check.
     * @private
     * @returns {boolean}
     */
    _isRemainingTimeValid(time): boolean {
        return time && time.valueOf() >= 0;
    }

    /**
     * Returns the formatted remaining time as string.
     *
     * @private
     * @returns {string}
     */
    _getFormattedTimeString(): string {
        const days = Math.floor(this.state.remainingTime.valueOf() / 1000 / 60 / 60 / 24);
        const daysString = days ? `${days} day${days > 1 ? 's' : ''} | ` : '';

        const hours = Math.floor(this.state.remainingTime.valueOf() / 1000 / 60 / 60) % 24;
        const hoursString = hours || days ? `${hours} hr | ` : '';

        const minAndSecString = this.state.remainingTime.format('mm [min] | ss [sec]');

        return daysString + hoursString + minAndSecString;
    }

    /**
     * Decrease remaining time after a second.
     *
     * @private
     * @returns {void}
     */
    _setIntervalToDecreaseTime() {
        if (this._isRemainingTimeValid(this.state.remainingTime)) {
            this._intervalId = setInterval(() => {
                const newRemainingTime = this.state.remainingTime.subtract(1, 'seconds');

                if (this._isRemainingTimeValid(newRemainingTime)) {
                    this.setState({ remainingTime: newRemainingTime });
                } else {
                    this._clearInterval();
                    this.setState({ remainingTime: undefined });
                }
            }, 1000);
        }
    }

    /**
     * Clear remaining time decreasing interval.
     *
     * @private
     * @returns {void}
     */
    _clearInterval() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
    }
}

export default PreShowCountdown;
