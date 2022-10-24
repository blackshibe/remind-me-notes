import React, { useEffect, useState } from "react";

import { Button, ScrollView, StyleSheet, Switch, Text } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStore, AppStoreState, setTheme } from "../store";
import getAppTheme, { styles } from "../style/styles";
import usePromise from "../util/usePromise";
import { Header } from "../component/Header";
import { useThemeMode } from "@rneui/themed";

import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { View } from "../style/customComponents";

export default function Settings() {
	const mainStyle = getAppTheme();
	const { mode, setMode } = useThemeMode();
	const store = useStore<AppStore>();

	const toggleTheme = () => {
		store.dispatch(setTheme(mode === "dark" ? "light" : "dark"));
	};

	return (
		<View style={[styles.pageContainer]}>
			<Header route={{ name: "App Settings" }} />
			<View style={[{ padding: 16 }]}>
				<View
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
					}}
				>
					<Text style={[mainStyle]}>Dark Theme</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleTheme}
						value={mode === "dark"}
					/>
				</View>
			</View>
		</View>
	);
}
