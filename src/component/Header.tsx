import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "../style/customComponents";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const { top } = useSafeAreaInsets();

	return (
		<View style={[styles.tabHeader, { marginTop: top }]}>
			<Text style={styles.tabHeaderText}>{props.route.name}</Text>
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
