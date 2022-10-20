import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import getAppTheme from "../style/styles";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import { addNote, AppStoreState, deleteNote } from "../store";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import quickWarnAlert from "../util/quickWarnAlert";
import { View } from "../style/customComponents";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const store = useStore();
	const mainStyle = getAppTheme();
	const { top } = useSafeAreaInsets();

	let state = useSelector((state: AppStoreState) => state.notes);
	let isSelecting = state.find((value) => value.selected);

	const deleteNotes = () =>
		quickWarnAlert(() => {
			state.forEach((element) => {
				if (element.selected) store.dispatch(deleteNote(element.id));
			});
		}, "Delete the selected notes?");

	const addNewNote = () => {
		store.dispatch(addNote({ header: "New Note", text: "text" }));
	};

	return (
		<View style={[styles.tabHeader, { marginTop: top }]}>
			<Text style={[styles.tabHeaderText, mainStyle]}>{props.route.name}</Text>
			<View style={{}}>
				<TouchableOpacity
					hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
					style={{ height: 32, width: 32, justifyContent: "center" }}
					onPress={isSelecting ? deleteNotes : addNewNote}
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
