import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import getAppTheme from "../style/styles";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const { top } = useSafeAreaInsets();
	const mainStyle = getAppTheme();

	return (
		<View style={[styles.tabHeader, mainStyle, { marginTop: top }]}>
			<Text style={[styles.tabHeaderText, mainStyle]}>{props.route.name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	tabHeader: {
		width: "100%",
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tabHeaderText: {
		fontSize: 30,
	},
});
