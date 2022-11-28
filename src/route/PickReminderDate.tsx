import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, pickReminderDate, reminder, setReminderDate } from "../module/app_store";
import getAppTheme, { styles } from "../style/styles";
import { Header } from "../component/Header";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import useBackButton from "../util/useBackButton";
import { updateNotification } from "../util/updateNotification";
import { TouchableOpacity, View, Text } from "../style/customComponents";
import { getConvenientTime } from "../util/getConvenientTime";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function PickReminderDate(props: { navigation: any }) {
	const mainStyle = getAppTheme();
	const notes = useSelector((state: AppStoreState) => state.notes);
	const selected_date = useSelector((state: AppStoreState) => state.selected_date)!;
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);

	const selected = notes?.find((value) => value.id === selected_date?.id && value.type === "reminder") as reminder;
	const [selectingTime, selectTime] = useState<"none" | "date" | "time">("none");
	const store = useStore<AppStoreState>();
	const dueDate = new Date(selected?.due_time || 0);

	useBackButton(props.navigation, () => store.dispatch(pickReminderDate()));

	const setDate = (date: DateTimePickerEvent) => {
		if (date.type === "set" && date.nativeEvent.timestamp && selected) {
			updateNotification(store, selected);
			store.dispatch(setReminderDate([selected_date, date.nativeEvent.timestamp]));
		}
		selectTime("none");
	};

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
						selectTime("time");
					}}
				>
					<Text style={[mainStyle, { fontSize: 25 }]}>Time</Text>
					<Text style={[mainStyle, { fontSize: 16 }]}>{getConvenientTime(timeFormat, dueDate)}</Text>
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
						selectTime("date");
					}}
				>
					<Text style={{ fontSize: 25 }}>Date</Text>
					<Text style={{ fontSize: 16 }}>
						{dueDate.toLocaleDateString()}, {weekday[dueDate.getDay()]}
					</Text>
				</TouchableOpacity>

				{selectingTime === "date" ? (
					<RNDateTimePicker
						display="default"
						mode="date"
						value={dueDate}
						onChange={setDate}
						minimumDate={new Date()}
					/>
				) : undefined}

				{selectingTime === "time" ? (
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
