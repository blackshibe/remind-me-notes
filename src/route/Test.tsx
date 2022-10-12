import React from "react";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState, store, todoAdded } from "../store";
import { styles } from "../style/styles";

export default function Test() {
	const todos = useSelector((state: AppStoreState) => state.todos);

	return (
		<View style={styles.pageContainer}>
			<Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
			<View>
				<Text style={styles.text}>{JSON.stringify(todos)}</Text>
			</View>
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
