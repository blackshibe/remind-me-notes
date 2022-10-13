import React, { useEffect } from "react";

import { BackHandler, Text, TextInput, TextInputBase, TouchableOpacity, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, selectNote, store, addTodo, highlightNote } from "../store";
import { BACKGROUND_COLOR, FOREGROUND_COLOR, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";

const Item = (props: { item: string }) => {
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
		></TouchableOpacity>
	);
};

export default function Note(props: { navigation: any }) {
	const todos = useSelector((state: AppStoreState) => state.notes);
	const store = useStore();

	useEffect(() => {
		let l = BackHandler.addEventListener("hardwareBackPress", () => {
			store.dispatch(highlightNote());
			props.navigation.navigate("Main");

			return true;
		});

		return () => l.remove();
	}, []);

	return (
		<View style={styles.pageContainer}>
			<View style={{ padding: 16 }}>
				<TextInput style={[styles.text, styles.header]}>Note.tsx</TextInput>
				<TextInput style={[styles.text]} multiline={true}>
					Content
				</TextInput>
			</View>
		</View>
	);
}
