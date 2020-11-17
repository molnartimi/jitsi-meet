// @flow

import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

function PreShowCountdown() {

	const calculateTimeLeft = () => {
		const difference = new Date(2020, 11, 17, 16) - new Date();
		let timeLeft = {};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				min: Math.floor((difference / 1000 / 60) % 60),
				sec: Math.floor((difference / 1000) % 60),
			};
		} else {
			timeLeft = {}
		}

		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
	});

	const timerComponents = [];

	Object.keys(timeLeft).forEach((interval) => {
		const timeLeftInInt = timeLeft[interval];
		if (!timeLeftInInt && (interval === 'hours' || interval === 'days')) {
			return;
		}

		timerComponents.push(
		<Text >
			{timeLeft[interval]} {interval ? interval : '00'}{interval !== 'sec' ? " | " : ""}
		</Text>
		);
	});

	if (Object.keys(timeLeft).length) {
		return (
			<View style={styles.preShowCountdownContainer}>
				<Text style={styles.preShowCountdownStartingIn}>{ "Starting in: "}</Text>
				<Text style={styles.preShowCountdownTimer}>{timerComponents}</Text>
			</View>
		);
	} else {
		return null;
	}
	
}
export default PreShowCountdown;