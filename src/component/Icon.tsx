import React from "react";
import { View } from "react-native";

export const Icon = (props: { focused: boolean; color: string; size: number }): JSX.Element => {
	return (
		<View style={{ height: props.size, width: props.size, backgroundColor: props.focused ? "red" : props.color }} />
	);
};
