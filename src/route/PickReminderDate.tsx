import React, { createRef, useEffect, useState } from "react";

import { BackHandler, Text, TextInput, TextInputBase, TouchableOpacity } from "react-native";
import { useSelector, useStore } from "react-redux";
import {
	AppStoreState,
	editNote,
	openNote,
	note,
	editReminder,
	pickReminderDate,
	AppStore,
	setReminderDate,
} from "../store";
import getAppTheme, { styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/Header";
import { Icon } from "@rneui/themed";
import { View } from "../style/customComponents";
import DatePicker from "react-native-date-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import useBackButton from "../util/useBackButton";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function PickReminderDate(props: { navigation: any }) {
	const mainStyle = getAppTheme();
	const reminders = useSelector((state: AppStoreState) => state.reminders);
	const selected_date = useSelector((state: AppStoreState) => state.selected_date)!;

	const selected_note = reminders.find((value) => value.id === selected_date?.id);
	const [selectingShit, selectShit] = useState<"none" | "date" | "time">("none");
	const store = useStore();

	useBackButton(props, () => store.dispatch(pickReminderDate()));
	// FIXME lazy types
	const setDate = (date: any) => {
		if (date.type === "set") store.dispatch(setReminderDate([selected_date, date.nativeEvent.timestamp]));
		selectShit("none");
	};

	// @ts-ignore
	// Typescript gets confused with overloading
	const dueDate = new Date(selected_note?.due_time);

	return (
		<View style={[styles.pageContainer]}>
			<Header route={{ name: "Pick Date" }} />
			<View style={[{ padding: 16 }]}>
				<TouchableOpacity
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
						paddingTop: 20,
					}}
					onPress={() => {
						selectShit("time");
					}}
				>
					<Text style={[mainStyle, { fontSize: 25 }]}>Time</Text>
					<Text style={[mainStyle, { fontSize: 16 }]}>{dueDate.toLocaleTimeString()}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
						paddingTop: 20,
					}}
					onPress={() => {
						selectShit("date");
					}}
				>
					<Text style={[mainStyle, { fontSize: 25 }]}>Date</Text>
					<Text style={[mainStyle, { fontSize: 16 }]}>
						{dueDate.toLocaleDateString()}, {weekday[dueDate.getDay()]}
					</Text>
				</TouchableOpacity>

				{selectingShit === "date" ? (
					<RNDateTimePicker
						display="default"
						mode="date"
						value={dueDate}
						onChange={setDate}
						minimumDate={new Date()}
					/>
				) : undefined}

				{selectingShit === "time" ? (
					<RNDateTimePicker
						display="default"
						mode="time"
						value={dueDate}
						onChange={setDate}
						minimumDate={new Date()}
					/>
				) : undefined}
			</View>
		</View>
	);
}
