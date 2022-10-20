import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppStoreState } from "./store";
import getAppTheme, { styles } from "./style/styles";
import Settings from "./route/Reminders";
import App from "./route/Notes";
import Test from "./route/Test";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, useThemeMode } from "@rneui/themed";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { View } from "./style/customComponents";

export type NavigationPlaceholder = {
	navigate: (arg0: string) => void;
};

type props = {
	navigation: NavigationPlaceholder;
};

const Tab = createMaterialTopTabNavigator();

let icons: { [index: string]: string } = {
	Notes: "sticky-note",
	Reminders: "calendar",
	Settings: "cog",
};

export default function Route(props: props) {
	const selected_note = useSelector((state: AppStoreState) => state.selected_note);
	const { bottom } = useSafeAreaInsets();
	const { mode, setMode } = useThemeMode();
	const mainStyle = getAppTheme();

	// the Stack navigator is loosely tied to AppStoreState
	useEffect(() => {
		if (selected_note) props.navigation.navigate("Note");
	}, [selected_note]);

	NavigationBar.setBackgroundColorAsync(mainStyle.backgroundColor);
	NavigationBar.setBorderColorAsync(mainStyle.backgroundColor);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar style={mode === "dark" ? "light" : "dark"} />
			<Tab.Navigator
				screenOptions={({ route }) => {
					return {
						tabBarIndicatorStyle: {
							backgroundColor: mainStyle.color,
							height: 70,
							borderRadius: 8,
						},
						tabBarStyle: [
							mainStyle,
							styles.tabBar,
							{ marginBottom: bottom + 8, shadowColor: mainStyle.backgroundColor },
						],

						tabBarBounces: true,
						tabBarContentContainerStyle: { minHeight: 70 },
						tabBarInactiveTintColor: mainStyle.color,
						tabBarActiveTintColor: mainStyle.backgroundColor,

						tabBarIcon: ({ color }) => {
							return <Icon name={icons[route.name]} type={"font-awesome"} size={24} color={color} />;
						},

						tabBarShowIcon: true,
						tabBarShowLabel: false,
					};
				}}
				tabBarPosition={"bottom"}
			>
				<Tab.Screen name="Notes" component={App} />
				<Tab.Screen name="Reminders" component={Settings} />
				<Tab.Screen name="Settings" component={Test} />
			</Tab.Navigator>
		</View>
	);
}
