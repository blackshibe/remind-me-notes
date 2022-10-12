import { StyleSheet } from "react-native";

// todo: theming
export const BACKGROUND_COLOR = "rgb(20,10,15)";
export const FOREGROUND_COLOR = "rgb(255,240,240)";

export const appBackgroundTheme = {
	color: FOREGROUND_COLOR,
	backgroundColor: BACKGROUND_COLOR,
	fontFamily: "Ubuntu",
};

export const styles = StyleSheet.create({
	tabBarItemStyle: {
		...appBackgroundTheme,
	},
	tabBar: {
		...appBackgroundTheme,
		borderTopWidth: 0,
	},

	text: {
		...appBackgroundTheme,
	},

	header: {
		...appBackgroundTheme,
		fontSize: 20,
		marginBottom: 10,
	},

	pageContainer: {
		...appBackgroundTheme,
		flex: 1,
		paddingTop: 16,
		// padding: 32,
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
});
