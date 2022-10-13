import React from "react";

import { ScrollView, Text, TouchableOpacity, Vibration, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, note, selectNote, store, addTodo, highlightNote } from "../store";
import { BACKGROUND_COLOR, FOREGROUND_COLOR, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/NotesHeader";

const light_blue = {
	borderColor: "lightblue",
	color: "lightblue",
};

const selected = {
	borderWidth: 1,
	borderColor: "rgb(100,200,255)",
	color: "rgb(100,200,255)",
};

const Item = (props: { item: note; extra: { store: typeof store } }) => {
	const store = props.extra.store;
	let is_selecting = store.getState().notes.find((value) => value.selected);
	let selection_style = props.item.selected ? selected : undefined;

	return (
		<TouchableOpacity
			style={[styles.note, selection_style]}
			onPress={() => {
				if (is_selecting) {
					store.dispatch(selectNote(props.item.id));
				} else {
					store.dispatch(highlightNote({ a: "lol" }));
				}
			}}
			onLongPress={() => {
				Vibration.vibrate(50);
				store.dispatch(selectNote(props.item.id));
			}}
		>
			{props.item.header ? <Text style={[styles.headerSmall]}>{props.item.header}</Text> : undefined}
			{props.item.text ? <Text style={[styles.text]}>{props.item.text}</Text> : undefined}
		</TouchableOpacity>
	);
};

export default function Notes() {
	const todos = useSelector((state: AppStoreState) => state.notes);
	const store = useStore<AppStoreState>();

	return (
		<View style={styles.pageContainer}>
			<Header route={{ name: "Notes" }} />
			{todos.length === 0 ? (
				<Text style={[styles.text, { width: "100%", textAlign: "center" }]}>No notes added yet...</Text>
			) : (
				<ScrollView
					style={{
						flex: 1, // the number of columns you want to devide the screen into
						marginHorizontal: "auto",
						marginTop: 16,
						width: "100%",
					}}
				>
					<MasonryList data={[...todos]} renderer={Item} columns={2} extra_props={{ store: store }} />
				</ScrollView>
			)}
		</View>
	);
}
