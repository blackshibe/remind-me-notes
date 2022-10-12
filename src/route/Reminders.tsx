import React from "react";

import { StatusBar } from "expo-status-bar";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState, store, todoAdded, todoToggled } from "../store";
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
		>
			<Text style={[styles.text, styles.header]}>due tomorrow</Text>
			<Text style={{ ...styles.text, color: "grey", marginBottom: 10 }}>14th Oct, Tuesday</Text>
			<Text style={styles.text}>{props.item}</Text>
		</TouchableOpacity>
	);
};

export default function Settings() {
	const todos = useSelector((state: AppStoreState) => state.todos);

	return (
		<View style={[styles.pageContainer]}>
			<Text style={styles.text}>Reminders</Text>

			<MasonryList data={["1\n\n\n\n1", "2", "3", "4", "5", "6", "7"]} renderer={Item} columns={2} />

			<Button
				title="the thing"
				onPress={() => {
					console.log("fuck");
					store.dispatch(todoAdded({ id: "hi", text: "ok" }));
				}}
			/>
		</View>
	);
}
