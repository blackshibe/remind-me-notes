import React from "react";

import { StatusBar } from "expo-status-bar";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState, store, addTodo } from "../store";
import { BACKGROUND_COLOR, FOREGROUND_COLOR, styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/Header";

const Item = (props: { item: string }) => {
	return (
		<TouchableOpacity
			style={[
				styles.note,
				{
					backgroundColor: "lightblue",
				},
			]}
		>
			<Text style={[styles.text, styles.headerSmall]}>due tomorrow</Text>
			<Text style={{ ...styles.text, color: "grey", marginBottom: 10 }}>14th Oct, Tuesday</Text>
			<Text style={styles.text}>{props.item}</Text>
		</TouchableOpacity>
	);
};

export default function Reminders() {
	const todos = useSelector((state: AppStoreState) => state.notes);

	return (
		<View style={[styles.pageContainer]}>
			<Header route={{ name: "Reminders" }} />

			<Text style={styles.text}>Reminders</Text>

			<MasonryList data={["1\n\n\n\n1", "2", "3", "4", "5", "6", "7"]} renderer={Item} columns={2} />

			<Button
				title="the thing"
				onPress={() => {
					console.log("fuck");
					// store.dispatch(addTodo({ id }));
				}}
			/>
		</View>
	);
}
