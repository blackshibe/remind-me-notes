import React, { createRef, useEffect } from "react";

import { BackHandler, Text, TextInput, TextInputBase, TouchableOpacity, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, editNote, openNote, note } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/Header";
import { Icon } from "@rneui/themed";

export default function EditNote(props: { selected_id: number; navigation: any }) {
	useEffect(() => {
		let l = BackHandler.addEventListener("hardwareBackPress", () => {
			store.dispatch(editNote({ id: props.selected_id, header, text }));
			store.dispatch(openNote());

			props.navigation.navigate("Main");

			return true;
		});

		return () => l.remove();
	}, []);

	const mainStyle = getAppTheme();
	const todos = useSelector((state: AppStoreState) => state.notes);
	const selected_note = todos.find((value) => value.id === props.selected_id);
	const store = useStore();

	let header = selected_note?.header;
	let text = selected_note?.text;

	return (
		<View style={[styles.pageContainer, mainStyle]}>
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 16, padding: 8 }]}>
					<TextInput
						style={[mainStyle, styles.header]}
						placeholder={"Header"}
						placeholderTextColor={"grey"}
						onChangeText={(new_header) => (header = new_header)}
						defaultValue={header}
					/>
					<TextInput
						style={[mainStyle, { width: "100%", height: "100%" }]}
						multiline={true}
						placeholder={"Text"}
						placeholderTextColor={"grey"}
						textAlignVertical={"top"}
						onChangeText={(new_text) => (text = new_text)}
						defaultValue={"text"}
					/>
				</View>
			</View>
			<View
				style={{
					width: "100%",
					height: 70,
					bottom: 8,
					paddingRight: 8,
					paddingLeft: 8,
					justifyContent: "space-between",
					flexDirection: "row",
				}}
			>
				<TouchableOpacity
					style={[
						styles.invertedNote,
						{ flex: 1, backgroundColor: mainStyle.color, justifyContent: "center" },
					]}
				>
					<Icon name={"copy"} type={"font-awesome"} size={24} color={mainStyle.backgroundColor} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.invertedNote,
						{ flex: 1, backgroundColor: mainStyle.color, justifyContent: "center" },
					]}
				>
					<Icon name={"trash"} type={"font-awesome"} size={24} color={mainStyle.backgroundColor} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.invertedNote,
						{ flex: 1, backgroundColor: mainStyle.color, justifyContent: "center" },
					]}
				>
					<Icon name={"file"} type={"font-awesome"} size={24} color={mainStyle.backgroundColor} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
