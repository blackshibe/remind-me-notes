import { DependencyList, useEffect } from "react";
import { BackHandler } from "react-native";

type navigation = { navigate: (screen: string) => void };
export default function useBackButton(navigation: navigation, func: () => void, dependencies?: DependencyList) {
	return useEffect(() => {
		let listener = BackHandler.addEventListener("hardwareBackPress", () => {
			func();
			navigation.navigate("Main");

			return true;
		});

		return () => listener.remove();
	}, dependencies || []);
}
