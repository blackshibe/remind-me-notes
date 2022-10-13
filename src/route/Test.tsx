import React from "react";

import { StatusBar } from "expo-status-bar";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState, store, addTodo } from "../store";
import { styles } from "../style/styles";
import { Header } from "../component/Header";

export default function Test() {
	const todos = useSelector((state: AppStoreState) => state.notes);

	return (
		<View style={styles.pageContainer}>
			<Header route={{ name: "Test" }} />

			<Text style={[styles.text, { marginLeft: 16, marginBottom: 16 }]}>
				Open up App.tsx to start working on your app!
			</Text>
			<ScrollView style={{ width: "100%" }}>
				<Text style={styles.text}>{JSON.stringify(todos, null, 4)}</Text>
			</ScrollView>
		</View>
	);
}
