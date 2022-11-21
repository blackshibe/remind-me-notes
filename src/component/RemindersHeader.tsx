import React from "react";
import { Alert, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import { addReminder, addNote, AppStoreState, deleteNote } from "../store";
import { Icon } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import getAppTheme, { ACCENT, SELECT } from "../style/styles";
import quickWarnAlert from "../util/quickWarnAlert";
import { View } from "../style/customComponents";
import * as Notifications from "expo-notifications";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TouchableOpacity } from "../style/customComponents";

export const RemindersHeader = (props: { route: { name?: string } }): JSX.Element => {
	const store = useStore();
	const { top } = useSafeAreaInsets();
	const mainStyle = getAppTheme();

	let notes = useSelector((state: AppStoreState) => state.notes);
	let isSelecting = notes?.find((value) => value.selected);

	const deleteReminders = () =>
		quickWarnAlert(() => {
			notes?.forEach((element) => {
				if (element.selected) {
					store.dispatch(deleteNote(element.id));
					if (element.type === "reminder") {
						Notifications.cancelScheduledNotificationAsync(element.notification_id);
					}
				}
			});
		}, "Delete the selected items?");

	const addNote = async () => {
		let date = new Date().getTime() + 60 * 60 * 1000;
		let notification_id = await Notifications.scheduleNotificationAsync({
			content: {
				title: "Reminder is due",
				body: "No content",
				data: {},
			},
			trigger: { channelId: "default", date },
		});

		store.dispatch(addReminder({ text: "", notification_id, date }));
	};

	return (
		<View style={[styles.tabHeader, { marginTop: top }]}>
			<Text style={[styles.tabHeaderText, mainStyle]}>{props.route.name}</Text>
			<Animated.View style={{}} entering={FadeIn} exiting={FadeOut}>
				<TouchableOpacity
					hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
					style={{ height: 32, width: 32, justifyContent: "center" }}
					onPress={isSelecting ? deleteReminders : addNote}
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
			</Animated.View>
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
