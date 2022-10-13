import React, { useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { AppStoreState } from "./store";
import { Icon } from "./component/Icon";
import { styles } from "./style/styles";
import Settings from "./route/Reminders";
import App from "./route/Notes";
import Test from "./route/Test";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export type NavigationPlaceholder = {
	navigate: (arg0: string) => void;
};

type props = {
	navigation: NavigationPlaceholder;
};

export default function Route(props: props) {
	const Tab = createBottomTabNavigator();
	const selected_note = useSelector((state: AppStoreState) => state.selected_note);

	// the Stack navigator is loosely tied to AppStoreState
	useEffect(() => {
		if (selected_note) props.navigation.navigate("Note");
	}, [selected_note]);

	return (
		<View style={{ flex: 1, backgroundColor: "black" }}>
			<Tab.Navigator
				sceneContainerStyle={styles.tabBar}
				screenOptions={{
					tabBarIcon: Icon,
					headerShown: false,
					tabBarStyle: styles.tabBar,
				}}
			>
				<Tab.Screen name="Notes" component={App} />
				<Tab.Screen name="Reminders" component={Settings} />
				<Tab.Screen name="Settings" component={Test} />
			</Tab.Navigator>
		</View>
	);
}
