import React from "react";
import { Text, View } from "react-native";
import { appBackgroundTheme } from "../style/styles";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState } from "../store";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	// let state = useSelector((state: AppStoreState) => state.notes);
	// let is_selecting = state.find((value) => value.selected);

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
