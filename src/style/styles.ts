import { createTheme, useThemeMode } from "@rneui/themed";
import { StyleSheet } from "react-native";

// todo: theming

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
		borderWidth: 1,
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
});
