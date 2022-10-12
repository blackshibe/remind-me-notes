import React, { useEffect } from "react";

import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, selectNote, store, todoAdded } from "../store";
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

export default function Note() {
	const todos = useSelector((state: AppStoreState) => state.todos);
	const store = useStore();

	useEffect(() => {
		let l = BackHandler.addEventListener("hardwareBackPress", () => {
			store.dispatch(selectNote());

			return true;
		});

		return () => l.remove();
	}, []);

	return (
		<View style={styles.pageContainer}>
			<View style={{ padding: 32 }}>
				<Text style={[styles.text, styles.header]}>Note.tsx</Text>
				<Text style={[styles.text]}>Content</Text>
			</View>
		</View>
	);
}
