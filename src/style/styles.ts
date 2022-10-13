import { StyleSheet } from "react-native";

// todo: theming
export const BACKGROUND_COLOR = "rgb(0,0,0)";
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
		marginTop: 10,
		fontSize: 40,
		marginBottom: 10,
	},

	headerSmall: {
		...appBackgroundTheme,
		fontSize: 20,
		marginBottom: 10,
	},

	note: {
		borderRadius: 16,
		borderColor: FOREGROUND_COLOR,
		backgroundColor: BACKGROUND_COLOR,
		borderWidth: 1,
		padding: 16,
		margin: 8,
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
