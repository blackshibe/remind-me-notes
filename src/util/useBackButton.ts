import { DependencyList, useEffect } from "react";
import { BackHandler } from "react-native";

type navigation = any;
export default function useBackButton(
	props: { navigation: navigation },
	func: () => void,
	dependencies?: DependencyList
) {
	return useEffect(() => {
		let listener = BackHandler.addEventListener("hardwareBackPress", () => {
			func();
			props.navigation.navigate("Main");

			return true;
		});

		return () => listener.remove();
	}, dependencies || []);
}
