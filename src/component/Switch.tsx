import React from "react";
import { TouchableOpacity, StyleSheet, Touchable } from "react-native";
import Animated, { SpringUtils, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { View } from "../style/customComponents";
import getAppTheme from "../style/styles";

const SIZE_X = 48;

export const Switch = ({ value, onChange }: { value: boolean; onChange: (newValue: boolean) => void }): JSX.Element => {
	const visualValue = useSharedValue(value);
	const theme = getAppTheme();

	const animatedStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: theme.backgroundColor,
			height: SIZE_X * 0.5 - 2,
			width: SIZE_X * 0.5,
			borderRadius: 16,
			transform: [
				{
					translateX: withSpring(visualValue.value ? SIZE_X * 0.5 - 1 : 1, {
						damping: 100,
						stiffness: 1000,
					}),
				},
				{
					translateY: 1,
				},
			],
		};
	});

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={() => {
				// faster animation
				visualValue.value = !value;
				onChange(!value);
			}}
			style={{ backgroundColor: theme.color, width: SIZE_X, height: SIZE_X * 0.5, borderRadius: SIZE_X }}
		>
			<Animated.View style={animatedStyles} />
		</TouchableOpacity>
	);
};
