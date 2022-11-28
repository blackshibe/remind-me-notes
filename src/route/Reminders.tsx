import React, { useState } from "react";
import { ScrollView, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, reminder, AppStore, openNote, timeFormat, note, selectNote } from "../module/app_store";
import { MasonryList } from "../component/MasonryList";
import { RemindersHeader } from "../component/RemindersHeader";
import { datePassed, getConvenientDate, getConvenientTime, shouldDisplayTime } from "../util/getConvenientTime";
import { View, Text, TouchableOpacity } from "../style/customComponents";
import getAppTheme, { ACCENT, SELECT, SPRING_PROPERTIES, styles } from "../style/styles";
import { NoteFiles } from "../component/NoteFiles";
import Animated, { FadeIn, FadeOut, Layout, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useLocalImage } from "../module/local_images";

const pastDue = {
	backgroundColor: ACCENT,
};

type extraItemProps = { store: AppStore; timeFormat: timeFormat; mainStyle: any };
const Item = ({ setkey, element, extra }: { setkey: number; element: reminder; extra: extraItemProps }) => {
	const store = extra.store;
	const mainStyle = extra.mainStyle;

	let reminders = useSelector((state: AppStoreState) => state.notes) || [];
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
			backgroundColor: element.selected ? SELECT : dueStyle?.backgroundColor || mainStyle.color,
			borderColor: element.selected ? SELECT : dueStyle?.backgroundColor || mainStyle.color,
		};
	});

	let pinnedImage = element.files?.find((value) => value.name === element.pinned_image);
	let uri = useLocalImage(pinnedImage?.name);

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
						store.dispatch(selectNote(element.id));
					} else {
						store.dispatch(openNote({ type: "reminder", id: element.id }));
					}
				}}
				onLongPress={() => {
					Vibration.vibrate(50);
					store.dispatch(selectNote(element.id));
				}}
			>
				<View style={[styles.note, invertedColor, animatedSelection, dueStyle]}>
					<View
						style={[
							{
								padding: 16,
								backgroundColor: "rgba(0,0,0,0)",
							},
						]}
					>
						{<Text style={[styles.headerSmall, invertedText]}>{element.text || "No note"}</Text>}
						<Text style={[invertedText]}>{dueString}</Text>
						{!pinnedImage && <NoteFiles files={element.files} />}
					</View>

					{pinnedImage && (
						<Animated.Image
							entering={FadeIn}
							source={{ uri }}
							style={[
								{
									width: "100%",

									aspectRatio: Math.max(pinnedImage.width / pinnedImage.height, 0.75),
									resizeMode: "contain",
									borderBottomLeftRadius: 16,
									borderBottomRightRadius: 16,
								},
								animatedSelection,
							]}
						/>
					)}
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default function Reminders() {
	const mainStyle = getAppTheme();
	const notes = useSelector((state: AppStoreState) => state.notes) || [];
	const store = useStore<AppStoreState>();
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);

	// time counter
	let [_f, forceRerender] = useState(0);
	setTimeout(() => forceRerender(_f + 1), 1000);

	return (
		<View style={styles.pageContainer}>
			<RemindersHeader route={{ name: "Reminders" }} />
			{notes.length === 0 && (
				<Text style={{ width: "100%", textAlign: "center" }}>No reminders added yet...</Text>
			)}
			{notes.length !== 0 && (
				<ScrollView
					style={{
						flex: 1, // the number of columns you want to devide the screen into
						marginHorizontal: "auto",
						marginTop: 16,
						width: "100%",
					}}
				>
					<MasonryList
						data={notes.filter((value) => value.type === "reminder") as reminder[]}
						renderer={Item}
						columns={2}
						extra_props={{ store, timeFormat, mainStyle }}
					/>
				</ScrollView>
			)}
		</View>
	);
}
