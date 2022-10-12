import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { shallowEqual, useSelector } from "react-redux";
import { AppStoreState, store } from "./store";
import { StatusBar } from "expo-status-bar";
import { Icon } from "./component/Icon";
import { styles } from "./style/styles";
import { NavigationContainer } from "@react-navigation/native";
import { Header } from "./component/Header";

import Settings from "./route/Reminders";
import App from "./route/Notes";
import Test from "./route/Test";
import Note from "./route/Note";

export default function Route() {
	console.log("Rerender");

	// route nigdy się nie rerenderuję
	const selected_note = useSelector(
		(state: AppStoreState) => {
			console.log(state);
			console.log("state.selected_note", state.selected_note);
			return state.selected_note;
		},
		(a, b) => {
			console.log("???");
			return false;
		}
	);
	const Tab = createBottomTabNavigator();

	console.log(selected_note);

	if (selected_note) {
		return <Note />;
	}

	return (
		<NavigationContainer>
			<StatusBar style="light" />
			<Tab.Navigator
				sceneContainerStyle={styles.tabBar}
				screenOptions={{
					tabBarIcon: Icon,
					header: Header,
					tabBarStyle: styles.tabBar,
					tabBarItemStyle: styles.tabBarItemStyle,
					tabBarLabelStyle: styles.text,
				}}
			>
				<Tab.Screen name="Notes" component={App} />
				<Tab.Screen name="Reminders" component={Settings} />
				<Tab.Screen name="Settings" component={Test} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
