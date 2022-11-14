import React, { useState } from "react";
import { ScrollView, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, reminder, AppStore, selectReminder, openNote, timeFormat, note } from "../store";
import { MasonryList } from "../component/MasonryList";
import { RemindersHeader } from "../component/RemindersHeader";
import { datePassed, getConvenientDate, getConvenientTime, shouldDisplayTime } from "../util/getConvenientTime";
import { View, Text, TouchableOpacity } from "../style/customComponents";
import getAppTheme, { ACCENT, SELECT, SPRING_PROPERTIES, styles } from "../style/styles";
import { Icon } from "@rneui/themed";
import { NoteFiles } from "../component/NoteFiles";
import Animated, { FadeIn, FadeOut, Layout, useAnimatedStyle, withSpring } from "react-native-reanimated";

const pastDue = {
	backgroundColor: ACCENT,
};

type extraItemProps = { store: AppStore; timeFormat: timeFormat; mainStyle: any };
const Item = ({ setkey, element, extra }: { setkey: number; element: reminder; extra: extraItemProps }) => {
	const store = extra.store;
	const mainStyle = extra.mainStyle;

	let reminders = useSelector((state: AppStoreState) => state.reminders) || [];
	let isSelecting = reminders.find((value) => value.selected);

	let dueDate = new Date(element.due_time);
	let dueStyle = datePassed(dueDate) ? pastDue : undefined;
	let convenientDate = getConvenientDate(dueDate);
	let sessionId = useSelector<AppStoreState>((state) => state.session_id);
	let dueString = datePassed(dueDate)
		? "past due"
		: shouldDisplayTime(dueDate)
		? `due ${convenientDate} @ ${getConvenientTime(extra.timeFormat, dueDate)}`
		: `due ${convenientDate}`;

	const invertedColor = {
		backgroundColor: mainStyle.color,
		color: mainStyle.backgroundColor,
		borderColor: mainStyle.color,
	};

	const invertedText = {
		backgroundColor: "rgba(0,0,0,0)",
		color: mainStyle.backgroundColor,
		borderColor: mainStyle.color,
	};

	const animatedSelection = useAnimatedStyle(() => {
		return {
			backgroundColor: element.selected ? SELECT : mainStyle.color,
			// borderWidth: withSpring(element.selected ? 2 : 0, SPRING_PROPERTIES),
		};
	});

	return (
		<Animated.View
			entering={sessionId === element.session_id ? FadeIn : FadeIn.delay(setkey * 50)}
			style={{ justifyContent: "center" }}
			exiting={FadeOut}
			layout={Layout.springify().damping(1000).stiffness(1000)}
		>
			<TouchableOpacity
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
				<View style={[styles.note, invertedColor, animatedSelection, dueStyle]}>
					{<Text style={[styles.headerSmall, invertedText]}>{element.text || "No note"}</Text>}
					<Text style={[invertedText]}>{dueString}</Text>
					<NoteFiles files={element.files} />
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default function Reminders() {
	const mainStyle = getAppTheme();
	const reminders = useSelector((state: AppStoreState) => state.reminders) || [];
	const store = useStore<AppStoreState>();
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);

	// time counter
	let [_f, forceRerender] = useState(0);
	setTimeout(() => forceRerender(_f + 1), 1000);

	return (
		<View style={styles.pageContainer}>
			<RemindersHeader route={{ name: "Reminders" }} />
			{reminders.length === 0 && (
				<Text style={{ width: "100%", textAlign: "center" }}>No reminders added yet...</Text>
			)}
			{reminders.length !== 0 && (
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
