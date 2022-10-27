import React, { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { styles } from "./src/style/styles";
import Route from "./src/Route";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { AppStore, createStore, setPushToken } from "./src/store";
import * as Notifications from "expo-notifications";
import usePromise from "./src/util/usePromise";
import EditNoteRouter from "./src/route/EditNoteRouter";
import { ThemeProvider, useThemeMode } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import PickReminderDate from "./src/route/PickReminderDate";
import { getConvenientTime } from "./src/util/getConvenientTime";
import { AppState, AppStateStatus, Platform } from "react-native";

const Stack = createStackNavigator();

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
				<NavigationContainer theme={DarkTheme}>
					<Stack.Navigator
						screenOptions={{
							cardOverlayEnabled: false,
							headerShown: false,
							gestureEnabled: false,
						}}
					>
						<Stack.Screen name="Main" component={Route} />
						<Stack.Screen name="Note" component={EditNoteRouter} />
						<Stack.Screen name="PickReminderDate" component={PickReminderDate} />
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		</ThemeProvider>
	);
};
