import React from "react";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { styles } from "./src/style/styles";
import Route from "./src/Route";
import * as NavigationBar from "expo-navigation-bar";
import { store } from "./src/store";

export default () => {
	const [fontsLoaded] = useFonts({
		Ubuntu: require("./assets/font/Ubuntu-Regular.ttf"),
	});

	NavigationBar.setBackgroundColorAsync(styles.text.backgroundColor);
	NavigationBar.setBorderColorAsync(styles.text.backgroundColor);

	if (!fontsLoaded) return <></>;

	return (
		<Provider store={store}>
			<Route />
		</Provider>
	);
};
