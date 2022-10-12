import React from "react";
import { Text, View } from "react-native";
import { appBackgroundTheme } from "../style/styles";
import { StyleSheet } from "react-native";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	console.log(props.route);
	return (
		<View style={styles.tabHeader}>
			<Text style={styles.tabHeaderText}>{props.route.name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	tabHeader: {
		...appBackgroundTheme,
		height: 100,
		padding: 16,
		alignItems: "flex-start",
		justifyContent: "flex-end",
	},
	tabHeaderText: {
		...appBackgroundTheme,
		fontSize: 30,
	},
});
