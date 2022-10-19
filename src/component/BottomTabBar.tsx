import React from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { appBackgroundTheme } from "../style/styles";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import { addNote, AppStoreState, deleteNote } from "../store";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const store = useStore();
	let state = useSelector((state: AppStoreState) => state.notes);
	let isSelecting = state.find((value) => value.selected);
	const { top } = useSafeAreaInsets();

	return <View style={[styles.bottomTabBar, { marginTop: top }]}>Hello world</View>;
};

const styles = StyleSheet.create({
	bottomTabBar: {
		...appBackgroundTheme,
	},
	tabHeaderText: {
		...appBackgroundTheme,
		fontSize: 30,
	},
});
