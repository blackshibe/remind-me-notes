import React from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import { addReminder, addNote, AppStoreState, deleteNote, deleteReminder } from "../store";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import getAppTheme from "../style/styles";

export const RemindersHeader = (props: { route: { name?: string } }): JSX.Element => {
	const mainStyle = getAppTheme();
	const store = useStore();
	const { top } = useSafeAreaInsets();

	let state = useSelector((state: AppStoreState) => state.reminders);
	let isSelecting = state.find((value) => value.selected);

	const deleteNotes = () => {
		Alert.alert("Delete warning", "Delete the selected notes?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				onPress: () => {
					state.forEach((element) => {
						if (element.selected) store.dispatch(deleteReminder(element.id));
					});
				},
			},
		]);
	};

	const addNote = () => {
		store.dispatch(addReminder({ text: "text" }));
	};

	return (
		<View style={[styles.tabHeader, { marginTop: top }, mainStyle]}>
			<Text style={[styles.tabHeaderText, mainStyle]}>{props.route.name}</Text>
			<View style={{}}>
				<TouchableOpacity
					hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
					style={{ height: 32, width: 32, justifyContent: "center" }}
					onPress={isSelecting ? deleteNotes : addNote}
				>
					<Icon name={isSelecting ? "delete" : "add"} size={32} color={mainStyle.color} />
				</TouchableOpacity>
			</View>
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
