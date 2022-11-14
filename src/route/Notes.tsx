import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, LayoutRectangle, ScrollView, TouchableOpacity, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, note, addNote, openNote, selectNote, AppStore } from "../store";
import getAppTheme, { ACCENT, SELECT, SPRING_PROPERTIES, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/NotesHeader";
import { View, Text } from "../style/customComponents";
import { Icon } from "@rneui/themed";
import Animated, {
	FadeIn,
	FadeOut,
	Layout,
	LightSpeedInLeft,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NoteFiles } from "../component/NoteFiles";

type dragInfo = { x: number; y: number; width: number; height: number; noteId: number };
type extraItemProps = {
	store: AppStore;
	mainStyle: { backgroundColor: string; color: string };

	dragInfo: dragInfo | undefined;
	setDragInfo: (arg: dragInfo | undefined) => void;
};

const Item = ({ extra, element, setkey }: { setkey: number; element: note; extra: extraItemProps }) => {
	const store = extra.store;
	const mainStyle = extra.mainStyle;

	let notes = useSelector((state: AppStoreState) => state.notes) || [];
	let isSelecting = notes.find((value) => value.selected);
	let ref = useRef<TouchableOpacity>(null);
	let sessionId = useSelector<AppStoreState>((state) => state.session_id);

	const invertedColor = {
		backgroundColor: mainStyle.color,
		color: mainStyle.backgroundColor,
		borderColor: mainStyle.color,
	};

	const animatedSelection = useAnimatedStyle(() => {
		return {
			backgroundColor: element.selected ? SELECT : mainStyle.color,
			// borderWidth: withSpring(element.selected ? 2 : 0, SPRING_PROPERTIES),
		};
	});

	let truncatedText = element.text.length > 70 ? `${element.text.substring(1, 70)}...` : element.text;

	return (
		<Animated.View
			style={{ justifyContent: "center" }}
			entering={sessionId === element.session_id ? FadeIn : FadeIn.delay(setkey * 50)}
			exiting={FadeOut}
			layout={Layout.springify().damping(1000).stiffness(1000)}
			key={setkey}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				ref={ref}
				onPress={() => {
					if (isSelecting) store.dispatch(selectNote(element.id));
					else store.dispatch(openNote({ type: "note", id: element.id }));
				}}
				onLongPress={() => {
					Vibration.vibrate(50);
					store.dispatch(selectNote(element.id));
				}}
			>
				<View style={[styles.note, invertedColor, animatedSelection]}>
					{element.header ? (
						<Text style={[styles.headerSmall, invertedColor]}>{element.header}</Text>
					) : undefined}
					{truncatedText ? <Text style={[invertedColor]}>{truncatedText}</Text> : undefined}
					<NoteFiles files={element.files} />
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default function Notes() {
	const mainStyle = getAppTheme();
	const todos = useSelector((state: AppStoreState) => state.notes) || [];
	const store = useStore<AppStoreState>();

	// remove later
	const [dragInfo, setDragInfo] = useState<dragInfo | undefined>();

	return (
		<View style={styles.pageContainer}>
			<Header route={{ name: "Notes" }} />
			{todos.length === 0 && <Text style={{ width: "100%", textAlign: "center" }}>No notes added yet...</Text>}
			{todos.length !== 0 && (
				<ScrollView
					scrollEnabled={dragInfo == undefined}
					style={{
						flex: 1, // the number of columns you want to devide the screen into
						marginHorizontal: "auto",
						marginTop: 16,
						width: "100%",
					}}
				>
					<MasonryList
						data={todos}
						renderer={Item}
						columns={2}
						extra_props={{ store, mainStyle, dragInfo, setDragInfo }}
					/>
				</ScrollView>
			)}
		</View>
	);
}
