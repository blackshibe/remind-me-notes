import React from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { appBackgroundTheme } from "../style/styles";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import { addTodo, AppStoreState, deleteNote } from "../store";
import { Icon } from "@rneui/themed";

// TODO: import BottomTabHeaderProps
export const Header = (props: { route: { name?: string } }): JSX.Element => {
	const store = useStore();
	let state = useSelector((state: AppStoreState) => state.notes);
	let is_selecting = state.find((value) => value.selected);

	if (is_selecting)
		return (
			<View style={[styles.tabHeader, { width: "100%" }]}>
				<View
					style={{
						right: 32,
						height: "100%",
						position: "absolute",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						style={{ height: 48, width: 48, justifyContent: "center" }}
						onPress={() => {
							Alert.alert("Delete warning", "Delete the selected notes?", [
								{
									text: "Cancel",
									style: "cancel",
								},
								{
									text: "OK",
									onPress: () => {
										state.forEach((element) => {
											if (element.selected) store.dispatch(deleteNote(element.id));
										});
									},
								},
							]);
						}}
					>
						<Icon name={"delete"} size={32} color={"white"} />
					</TouchableOpacity>
				</View>
			</View>
		);

	return (
		<View style={[styles.tabHeader, { width: "100%" }]}>
			<Text style={styles.tabHeaderText}>{props.route.name}</Text>
			{/* jank */}
			<View
				style={{
					right: 32,
					height: "100%",
					position: "absolute",
					justifyContent: "center",
				}}
			>
				<TouchableOpacity
					style={{ height: 48, width: 48, justifyContent: "center" }}
					onPress={() => {
						store.dispatch(addTodo({ header: "New Note", text: "text" }));
					}}
				>
					<Icon name={"add"} size={32} color={"white"} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	tabHeader: {
		...appBackgroundTheme,
		height: 100,
		padding: 16,
		alignItems: "flex-start",
		justifyContent: "flex-end",
	},
	tabHeaderText: {
		...appBackgroundTheme,
		fontSize: 30,
	},
});
