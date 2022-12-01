import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, openNote, selectNote, AppStore, note } from "../module/app_store";
import getAppTheme, { SELECT, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/NotesHeader";
import { View, Text } from "../style/customComponents";
import Animated, { FadeIn, FadeOut, Layout, useAnimatedStyle } from "react-native-reanimated";
import { NoteFiles } from "../component/NoteFiles";
import { useImage } from "../module/images";

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

	let truncatedText = element.text.length > 70 ? `${element.text.substring(0, 120)}...` : element.text;
	let pinnedImage = element.files?.find((value) => value.name === element.pinned_image);
	let fullscreenImage = pinnedImage && !element.header && !element.text;
	let uri = useImage(pinnedImage);

	const animatedSelection = useAnimatedStyle(() => {
		return {
			backgroundColor: element.selected ? SELECT : mainStyle.color,
			borderColor: element.selected ? SELECT : mainStyle.color,
			borderWidth: element.selected ? (fullscreenImage ? 1 : 0) : undefined,
		};
	});

	return (
		<Animated.View
			style={[{ justifyContent: "center" }]}
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
				<Animated.View style={[styles.note, invertedColor, animatedSelection]}>
					{!fullscreenImage && (
						<View
							style={{
								padding: 16,
								backgroundColor: "rgba(0,0,0,0)",
							}}
						>
							{element.header ? (
								<Text style={[styles.headerSmall, invertedColor]}>{element.header}</Text>
							) : undefined}
							{truncatedText ? <Text style={[invertedColor]}>{truncatedText}</Text> : undefined}
							{!pinnedImage && <NoteFiles files={element.files} />}
						</View>
					)}
					{pinnedImage && (
						<Animated.Image
							entering={FadeIn}
							source={{ uri }}
							style={[
								{
									width: "100%",
									aspectRatio: Math.max(pinnedImage.width / pinnedImage.height, 0.75),
									resizeMode: "contain",
									borderBottomLeftRadius: 8,
									borderBottomRightRadius: 8,
									borderRadius: fullscreenImage ? 8 : undefined,
								},
								animatedSelection,
							]}
						/>
					)}
				</Animated.View>
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
						data={todos.filter((value) => value.type === "note") as note[]}
						renderer={Item}
						columns={2}
						extra_props={{ store, mainStyle, dragInfo, setDragInfo }}
					/>
				</ScrollView>
			)}
		</View>
	);
}
