import React from "react";
import { Switch } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, setTheme, setTimeFormat, timeFormat } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { Header } from "../component/Header";
import { useThemeMode } from "@rneui/themed";
import { View, Text } from "../style/customComponents";

export default function Settings() {
	const mainStyle = getAppTheme();
	const { mode } = useThemeMode();
	const store = useStore<AppStoreState>();
	const currentTimeFormat = useSelector<AppStoreState>((state) => state.time_format);

	const toggleTheme = () => {
		store.dispatch(setTheme(mode === "dark" ? "light" : "dark"));
	};

	const toggleFormat = () => {
		store.dispatch(
			setTimeFormat(currentTimeFormat == timeFormat.twentyfour ? timeFormat.twelve : timeFormat.twentyfour)
		);
	};

	return (
		<View style={[styles.pageContainer]}>
			<Header route={{ name: "App Settings" }} />
			<View style={[{ padding: 16 }]}>
				<View
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
					}}
				>
					<Text style={[mainStyle]}>Dark Theme</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						onValueChange={toggleTheme}
						value={mode === "dark"}
					/>
				</View>

				<View
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
					}}
				>
					<Text style={[mainStyle]}>24hr Time Format</Text>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						onValueChange={toggleFormat}
						value={currentTimeFormat === timeFormat.twentyfour}
					/>
				</View>
			</View>
		</View>
	);
}
