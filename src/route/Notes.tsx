import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, selectNote, store, todoAdded } from "../store";
import { BACKGROUND_COLOR, FOREGROUND_COLOR, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";

const Item = (props: { item: string }) => {
	let store = useStore();

	return (
		<TouchableOpacity
			style={{
				borderRadius: 16,
				borderColor: FOREGROUND_COLOR,
				borderWidth: 1,
				backgroundColor: BACKGROUND_COLOR,
				padding: 16,
				margin: 8,
			}}
			onPress={() => {
				console.log("Pressed");
				store.dispatch(selectNote({ a: "lol" }));
			}}
		>
			<Text style={[styles.text, styles.header]}>Header</Text>
			<Text style={[styles.text]}>Content</Text>
		</TouchableOpacity>
	);
};

export default function App() {
	const todos = useSelector((state: AppStoreState) => state.todos);

	return (
		<View style={styles.pageContainer}>
			<View
				style={{
					flex: 2, // the number of columns you want to devide the screen into
					marginHorizontal: "auto",
					margin: 16,
				}}
			>
				<MasonryList data={["hi\n\n\nhi", "hi", "hi", "hello", "hi"]} renderer={Item} columns={2} />
			</View>
		</View>
	);
}
