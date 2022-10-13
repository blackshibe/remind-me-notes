import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { styles } from "./src/style/styles";
import Route from "./src/Route";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Note from "./src/route/Note";
import { AppStore, createStore } from "./src/store";

export default () => {
	const [store, set_app_store] = useState<AppStore | undefined>();
	const Stack = createStackNavigator();
	const [fontsLoaded] = useFonts({
		Ubuntu: require("./assets/font/Ubuntu-Regular.ttf"),
	});

	NavigationBar.setBackgroundColorAsync(styles.text.backgroundColor);
	NavigationBar.setBorderColorAsync(styles.text.backgroundColor);

	useEffect(() => {
		new Promise(async () => {
			set_app_store(await createStore());
		});
	}, []);

	if (!fontsLoaded) return <></>;
	if (!store) return <></>;

	return (
		<Provider store={store}>
			<StatusBar style="light" />
			<NavigationContainer theme={DarkTheme}>
				<Stack.Navigator
					screenOptions={{
						cardOverlayEnabled: false,
						headerShown: false,
					}}
				>
					<Stack.Screen name="Main" component={Route} />
					<Stack.Screen name="Note" component={Note} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};
