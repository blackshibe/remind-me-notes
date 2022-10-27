import React, { useState } from "react";

import { ScrollView, Text, TouchableOpacity, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, addNote, reminder, AppStore, selectNote, selectReminder, openNote } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { RemindersHeader } from "../component/RemindersHeader";
import { datePassed, getAccurateConvenientTime, getConvenientDate, getConvenientTime } from "../util/getConvenientTime";
import { View } from "../style/customComponents";

const selected = {
	borderWidth: 1,
	borderColor: "rgb(100,200,255)",
	color: "rgb(100,200,255)",
};

const Item = (props: { item: reminder; extra: { store: AppStore; mainStyle: any } }) => {
	const store = props.extra.store;
	const mainStyle = props.extra.mainStyle;

	let isSelecting = store.getState().reminders.find((value) => value.selected);
	let selectionStyle = props.item.selected ? selected : undefined;

	const dueDate = new Date(props.item.due_time);

	let convenientDate = getConvenientDate(dueDate);
	let dueString = datePassed(dueDate)
		? "past due"
		: `due ${convenientDate} @ ${
				convenientDate == "now" ? getAccurateConvenientTime(dueDate) : getConvenientTime(dueDate)
		  }`;

	return (
		<TouchableOpacity
			style={[styles.note, { borderColor: mainStyle.color }, selectionStyle]}
			onPress={() => {
				if (isSelecting) {
					store.dispatch(selectReminder(props.item.id));
				} else {
					store.dispatch(openNote({ type: "reminder", id: props.item.id }));
				}
			}}
			onLongPress={() => {
				Vibration.vibrate(50);
				store.dispatch(selectReminder(props.item.id));
			}}
		>
			<Text style={[mainStyle, styles.headerSmall]}>{dueString}</Text>
			{props.item.text ? <Text style={mainStyle}>{props.item.text}</Text> : undefined}
		</TouchableOpacity>
	);
};

export default function Reminders() {
	const mainStyle = getAppTheme();
	const reminders = useSelector((state: AppStoreState) => state.reminders);
	const store = useStore<AppStoreState>();

	return (
		<View style={styles.pageContainer}>
			<RemindersHeader route={{ name: "Reminders" }} />
			{reminders.length === 0 ? (
				<Text style={[mainStyle, { width: "100%", textAlign: "center" }]}>No reminders added yet...</Text>
			) : (
				<ScrollView
					style={{
						flex: 1, // the number of columns you want to devide the screen into
						marginHorizontal: "auto",
						marginTop: 16,
						width: "100%",
					}}
				>
					<MasonryList data={reminders} renderer={Item} columns={2} extra_props={{ store, mainStyle }} />
				</ScrollView>
			)}
		</View>
	);
}
