import React, { useState } from "react";
import { ScrollView, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, reminder, AppStore, selectReminder, openNote, timeFormat, note } from "../store";
import { MasonryList } from "../component/MasonryList";
import { RemindersHeader } from "../component/RemindersHeader";
import { datePassed, getConvenientDate, getConvenientTime, shouldDisplayTime } from "../util/getConvenientTime";
import { View, Text, TouchableOpacity } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";
import { Icon } from "@rneui/themed";

const selected = {
	borderWidth: 1,
	borderColor: "rgb(100,200,255)",
	color: "rgb(100,200,255)",
};

const pastDue = {
	borderColor: "rgb(125,125,125)",
	color: "rgb(125,125,125)",
};

type extraItemProps = { store: AppStore; timeFormat: timeFormat; mainStyle: any };
const Item = ({ key, element, extra }: { key: number; element: reminder; extra: extraItemProps }) => {
	const store = extra.store;
	const mainStyle = extra.mainStyle;

	let isSelecting = store.getState().reminders.find((value) => value.selected);
	let selectionStyle = element.selected ? selected : undefined;

	let dueDate = new Date(element.due_time);
	let greyOutStyle = datePassed(dueDate) ? pastDue : undefined;
	let convenientDate = getConvenientDate(dueDate);
	let dueString = datePassed(dueDate)
		? "past due"
		: shouldDisplayTime(dueDate)
		? `due ${convenientDate} @ ${getConvenientTime(extra.timeFormat, dueDate)}`
		: `due ${convenientDate}`;

	return (
		<TouchableOpacity
			key={key}
			style={[styles.note, { borderColor: mainStyle.color }, greyOutStyle, selectionStyle]}
			onPress={() => {
				if (isSelecting) {
					store.dispatch(selectReminder(element.id));
				} else {
					store.dispatch(openNote({ type: "reminder", id: element.id }));
				}
			}}
			onLongPress={() => {
				Vibration.vibrate(50);
				store.dispatch(selectReminder(element.id));
			}}
		>
			<Text style={[styles.headerSmall, greyOutStyle]}>{dueString}</Text>
			{element.text ? <Text style={mainStyle}>{element.text}</Text> : undefined}
			{element.files.length ? (
				<View style={{ flex: 1, marginTop: 8, flexDirection: "row", alignItems: "center" }}>
					<Icon name={"file"} type={"font-awesome"} size={12} style={{ marginRight: 8 }} color={"grey"} />
					<Text style={{ color: "grey" }}>{element.files.length} files</Text>
				</View>
			) : undefined}
		</TouchableOpacity>
	);
};

export default function Reminders() {
	const mainStyle = getAppTheme();
	const reminders = useSelector((state: AppStoreState) => state.reminders);
	const store = useStore<AppStoreState>();
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);

	// time counter
	let [_f, forceRerender] = useState(0);
	setTimeout(() => forceRerender(_f + 1), 1000);

	return (
		<View style={styles.pageContainer}>
			<RemindersHeader route={{ name: "Reminders" }} />
			{reminders.length === 0 ? (
				<Text style={{ width: "100%", textAlign: "center" }}>No reminders added yet...</Text>
			) : (
				<ScrollView
					style={{
						flex: 1, // the number of columns you want to devide the screen into
						marginHorizontal: "auto",
						marginTop: 16,
						width: "100%",
					}}
				>
					<MasonryList
						data={reminders}
						renderer={Item}
						columns={2}
						extra_props={{ store, timeFormat, mainStyle }}
					/>
				</ScrollView>
			)}
		</View>
	);
}
