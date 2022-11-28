import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import getAppTheme, { ACCENT, SELECT } from "../style/styles";
import { useSelector, useStore } from "react-redux";
import { addNote, AppStoreState, deleteNote } from "../module/app_store";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import quickWarnAlert from "../util/quickWarnAlert";
import { View, Text } from "../style/customComponents";
import Animated, { FadeOut, FadeIn } from "react-native-reanimated";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const store = useStore();
	const mainStyle = getAppTheme();
	const { top } = useSafeAreaInsets();

	let notes = useSelector((state: AppStoreState) => state.notes);
	let isSelecting = notes?.find((value) => value.selected);

	const deleteNotes = () =>
		quickWarnAlert(() => {
			notes?.forEach((element) => {
				if (element.selected) store.dispatch(deleteNote(element.id));
			});
		}, "Delete the selected items?");

	const addNewNote = () => {
		store.dispatch(addNote({ header: "New Note", text: "text" }));
	};

	return (
		<View style={[styles.tabHeader, { marginTop: top }]}>
			<Text style={styles.tabHeaderText}>{props.route.name}</Text>
			<View style={{}}>
				<TouchableOpacity
					hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
					style={{ height: 32, width: 32, justifyContent: "center" }}
					onPress={isSelecting ? deleteNotes : addNewNote}
				>
					{!isSelecting && (
						<Animated.View exiting={FadeOut} entering={FadeIn}>
							<Icon name={"add"} size={32} color={mainStyle.color} />
						</Animated.View>
					)}
					{isSelecting && (
						<Animated.View exiting={FadeOut} entering={FadeIn}>
							<Icon name={"delete"} size={32} color={SELECT} />
						</Animated.View>
					)}
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
