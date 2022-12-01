import { useThemeMode } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";

export const SPRING_PROPERTIES = { stiffness: 1000, damping: 1000 };
export const ACCENT = "#555550";
export const SELECT = "#FF0550";

const DARK_COLOR = "rgba(1,1,1, 1)";
const LIGHT_COLOR = "rgba(255, 255, 255, 1)";

export default function getAppTheme() {
	const { mode, setMode } = useThemeMode();

	const BACKGROUND_COLOR = mode === "dark" ? DARK_COLOR : LIGHT_COLOR;
	const FOREGROUND_COLOR = mode === "dark" ? LIGHT_COLOR : DARK_COLOR;

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
		borderRadius: 8,
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
