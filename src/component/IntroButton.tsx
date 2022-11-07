import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";

// TODO: import BottomTabHeaderProps
export const IntroButton = (props: { press: () => void; text: string }): JSX.Element => {
	const mainStyle = getAppTheme();
	const navigator = useNavigation();

	return (
		<TouchableOpacity
			style={[styles.introButton, { backgroundColor: mainStyle.color }, { margin: 5 }]}
			onPress={props.press}
		>
			<Text style={{ color: mainStyle.backgroundColor }}>{props.text}</Text>
		</TouchableOpacity>
	);
};
