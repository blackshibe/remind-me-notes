import { useThemeMode } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";

export const SPRING_PROPERTIES = { stiffness: 1000, damping: 1000 };
export const ACCENT = "#FF5550";
export const SELECT = "#FF0550";

export default function getAppTheme() {
	const { mode, setMode } = useThemeMode();

	const BACKGROUND_COLOR = mode === "dark" ? "black" : "white";
	const FOREGROUND_COLOR = mode === "dark" ? "white" : "black";

	return {
		color: FOREGROUND_COLOR,
		backgroundColor: BACKGROUND_COLOR,
		fontFamily: "Ubuntu",
	};
}

// export function getAnimatedAppTheme() {
// 	const { mode, setMode } = useThemeMode();

// 	const BACKGROUND_COLOR = mode === "dark" ? "black" : "white";
// 	const FOREGROUND_COLOR = mode === "dark" ? "white" : "black";

// 	return useAnimatedStyle(() => {
// 		return {
// 			color: withSpring(FOREGROUND_COLOR),
// 			backgroundColor: withSpring(BACKGROUND_COLOR),
// 			fontFamily: "Ubuntu",
// 		};
// 	});
// }

export const styles = StyleSheet.create({
	tabBar: {
		borderTopWidth: 0,
		margin: 8,
	},

	header: {
		marginTop: 10,
		fontSize: 40,
		marginBottom: 10,
	},

	headerSmall: {
		fontSize: 20,
		marginBottom: 10,
	},

	note: {
		borderRadius: 16,
		padding: 16,
		margin: 8,
	},

	invertedNote: {
		borderRadius: 8,
		justifyContent: "center",
		margin: 4,
	},

	pageContainer: {
		flex: 1,
		paddingTop: 16,
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},

	settingsItem: {
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		width: "100%",
		marginBottom: 10,
	},

	introButton: {
		alignItems: "center",
		padding: 15,
		borderRadius: 8,
	},
});
