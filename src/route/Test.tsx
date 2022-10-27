import React, { useEffect, useState } from "react";

import { Button, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { AppStoreState } from "../store";
import getAppTheme, { styles } from "../style/styles";
import usePromise from "../util/usePromise";
import { Header } from "../component/Header";
import { useThemeMode } from "@rneui/themed";
import { View, Text } from "../style/customComponents";

import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

export default function Test() {
	const mainStyle = getAppTheme();
	const { mode, setMode } = useThemeMode();
	const todos = useSelector((state: AppStoreState) => state.notes);
	const [scheduled, setScheduled] = useState<any[]>([]);

	usePromise(async () => {
		setScheduled(await Notifications.getAllScheduledNotificationsAsync());
	});

	return (
		<View style={styles.pageContainer}>
			<Header route={{ name: "Test" }} />

			<Text style={[mainStyle, { marginLeft: 16, marginBottom: 16 }]}>
				Open up App.tsx to start working on your app!
			</Text>

			<Button
				onPress={async () => {
					let result = await ImagePicker.launchImageLibraryAsync({
						allowsEditing: true,
						aspect: [4, 3],
					});
					console.log(result);
				}}
				title={"pick image"}
			/>
			<ScrollView style={{ width: "100%" }}>
				<Text style={mainStyle}>{JSON.stringify(todos, null, 4)}</Text>
				<Text style={mainStyle}>{JSON.stringify(scheduled, null, 4)}</Text>
			</ScrollView>
		</View>
	);
}
