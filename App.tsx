import React, { useState } from "react";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { AppStore, createStore, setPushToken } from "./src/store";
import * as Notifications from "expo-notifications";
import usePromise from "./src/util/usePromise";
import { ThemeProvider } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LoginWrap } from "./src/LoginWrap";

Notifications.setNotificationHandler({
	handleNotification: async (a) => {
		return {
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: true,
		};
	},
});

export default () => {
	const [store, setAppStore] = useState<AppStore | undefined>();
	const [fontsLoaded] = useFonts({
		Ubuntu: require("./assets/font/Ubuntu-Regular.ttf"),
	});

	usePromise(async () => {
		setAppStore(await createStore());
	}, []);

	usePromise(async () => {
		if (!store) return;

		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}

		const token = (await Notifications.getExpoPushTokenAsync()).data;
		store.dispatch(setPushToken(token));

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.HIGH,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
				enableLights: true,
			});
		}
	}, [store]);

	if (!fontsLoaded) return <></>;
	if (!store) return <></>;

	return (
		<ThemeProvider>
			<Provider store={store}>
				<LoginWrap />
			</Provider>
		</ThemeProvider>
	);
};
