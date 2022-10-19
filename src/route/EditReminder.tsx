import React, { createRef, useEffect } from "react";

import { BackHandler, Text, TextInput, TextInputBase, TouchableOpacity, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, editNote, openNote, note, editReminder } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { MasonryList } from "../component/MasonryList";
import { Header } from "../component/Header";
import { Icon } from "@rneui/themed";

export default function EditReminder(props: { selected_id: number; navigation: any }) {
	const mainStyle = getAppTheme();
	const reminders = useSelector((state: AppStoreState) => state.reminders);
	const selected_note = reminders.find((value) => value.id === props.selected_id);
	const store = useStore();

	let text = selected_note?.text;

	useEffect(() => {
		let l = BackHandler.addEventListener("hardwareBackPress", () => {
			store.dispatch(editReminder({ id: props.selected_id, text }));
			store.dispatch(openNote());

			props.navigation.navigate("Main");

			return true;
		});

		return () => l.remove();
	}, []);

	return (
		<View style={styles.pageContainer}>
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 16, padding: 8 }]}>
					<TextInput
						style={[mainStyle, styles.header]}
						placeholder={"Header"}
						placeholderTextColor={"grey"}
						defaultValue={"due tomorrow"}
					/>
					<TextInput
						style={mainStyle}
						multiline={true}
						placeholder={"Text"}
						placeholderTextColor={"grey"}
						textAlignVertical={"top"}
						onChangeText={(new_text) => (text = new_text)}
						defaultValue={"14th Oct, 2022"}
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
				<TouchableOpacity style={[styles.invertedNote, { flex: 1 }]}>
					<Icon name={"copy"} type={"font-awesome"} size={24} color={"black"} />
				</TouchableOpacity>
				<TouchableOpacity style={[styles.invertedNote, { flex: 1, justifyContent: "center" }]}>
					<Icon name={"trash"} type={"font-awesome"} size={24} color={"black"} />
				</TouchableOpacity>
				<TouchableOpacity style={[styles.invertedNote, { flex: 1, justifyContent: "center" }]}>
					<Icon name={"file"} type={"font-awesome"} size={24} color={"black"} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
