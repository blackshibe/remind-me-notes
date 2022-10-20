import { DependencyList, useEffect } from "react";
import { Alert } from "react-native";

export default function quickWarnAlert(func: () => void, content: string, title?: string) {
	Alert.alert(title || "Delete warning", content, [
		{
			text: "Cancel",
			style: "cancel",
		},
		{
			text: "OK",
			onPress: func,
		},
	]);
}
