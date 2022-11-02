import React, { useRef, useState } from "react";
import { LayoutChangeEvent, LayoutRectangle, ScrollView, TouchableOpacity, Vibration } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, note, addNote, openNote, selectNote, AppStore } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/NotesHeader";
import { View, Text } from "../style/customComponents";
import { Icon } from "@rneui/themed";
import { useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const selected = {
	borderWidth: 1,
	borderColor: "rgb(100,200,255)",
	color: "rgb(100,200,255)",
};

type dragInfo = { x: number; y: number; width: number; height: number; noteId: number };
type extraItemProps = {
	store: AppStore;
	mainStyle: { backgroundColor: string; color: string };

	dragInfo: dragInfo | undefined;
	setDragInfo: (arg: dragInfo | undefined) => void;
};

const Item = ({ extra, element, key }: { key: number; element: note; extra: extraItemProps }) => {
	const store = extra.store;
	const mainStyle = extra.mainStyle;

	let isSelecting = store.getState().notes.find((value) => value.selected);
	let selectionStyle = element.selected ? selected : undefined;

	let ref = useRef<TouchableOpacity>(null);
	let dragging = extra.dragInfo?.noteId === element.id;

	return (
		<TouchableOpacity
			key={key}
			ref={ref}
			activeOpacity={0.5}
			onPressOut={() => {
				console.log("long press ended");
			}}
			onPress={() => {
				if (isSelecting) store.dispatch(selectNote(element.id));
				else store.dispatch(openNote({ type: "note", id: element.id }));
			}}
			onLongPress={() => {
				Vibration.vibrate(50);
				store.dispatch(selectNote(element.id));
				// ref.current?.measure((x, y, width, height, pageX, pageY) => {
				// 	extra.setDragInfo({
				// 		x: pageX,
				// 		y: pageY,
				// 		width,
				// 		height,
				// 		noteId: element.id,
				// 	});
				// });
			}}
		>
			<View
				key={key}
				style={[
					styles.note,
					{ backgroundColor: mainStyle.backgroundColor, borderColor: mainStyle.color },
					selectionStyle,
					{ opacity: dragging ? 0 : 1 },
				]}
			>
				{element.header ? <Text style={[styles.headerSmall, mainStyle]}>{element.header}</Text> : undefined}
				{element.text ? <Text style={[mainStyle]}>{element.text}</Text> : undefined}
				{element.files.length ? (
					<View style={{ flex: 1, marginTop: 8, flexDirection: "row", alignItems: "center" }}>
						<Icon name={"file"} type={"font-awesome"} size={12} style={{ marginRight: 8 }} color={"grey"} />
						<Text style={{ color: "grey" }}>{element.files.length} files</Text>
					</View>
				) : undefined}
			</View>
		</TouchableOpacity>
	);
};

export default function Notes() {
	const mainStyle = getAppTheme();
	const todos = useSelector((state: AppStoreState) => state.notes);
	const store = useStore<AppStoreState>();

	// remove later
	const [dragInfo, setDragInfo] = useState<dragInfo | undefined>();

	return (
		<View style={styles.pageContainer}>
			<Header route={{ name: "Notes" }} />
			{todos.length === 0 ? (
				<Text style={{ width: "100%", textAlign: "center" }}>No notes added yet...</Text>
			) : (
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
						data={[...todos]}
						renderer={Item}
						columns={2}
						extra_props={{ store, mainStyle, dragInfo, setDragInfo }}
					/>
				</ScrollView>
			)}

			{/* {dragInfo ? <DraggableSkeleton dragInfo={dragInfo} /> : undefined} */}
		</View>
	);
}
