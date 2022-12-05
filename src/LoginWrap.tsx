import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { useThemeMode } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useSelector } from "react-redux";
import Route from "./Route";
import Conflict from "./route/Conflict";
import Intro from "./route/Intro";
import Login from "./route/Login";
import PickReminderDate from "./route/PickReminderDate";
import { AppStoreState } from "./module/app_store";
import getAppTheme from "./style/styles";
import EditNote from "./route/EditNote";

export type appLoginTabNavigator = {
	Intro: undefined;
	Login: undefined;
	Conflict: undefined;
};

const Stack = createStackNavigator();
const LoginTab = createStackNavigator<appLoginTabNavigator>();

export const LoginWrap = () => {
	let firstVisit = useSelector((state: AppStoreState) => state.first_visit_ended);
	const { mode } = useThemeMode();

	if (!firstVisit)
		return (
			<NavigationContainer theme={DarkTheme}>
				<StatusBar style={mode === "dark" ? "light" : "dark"} />
				<LoginTab.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<LoginTab.Screen name="Intro" component={Intro} />
					<LoginTab.Screen name="Login" component={Login} />
					<LoginTab.Screen name="Conflict" component={Conflict} />
				</LoginTab.Navigator>
			</NavigationContainer>
		);

	return (
		<NavigationContainer theme={DarkTheme}>
			<StatusBar style={mode === "dark" ? "light" : "dark"} />
			<Stack.Navigator
				screenOptions={{
					cardOverlayEnabled: false,
					headerShown: false,
				}}
			>
				<Stack.Screen name="Main" component={Route} />
				<Stack.Screen name="Note" component={EditNote} />
				<Stack.Screen name="PickReminderDate" component={PickReminderDate} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};
