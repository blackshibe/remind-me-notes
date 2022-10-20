import React, { useEffect, useState } from "react";
import { BackHandler, FlatList, Image, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, editNote, openNote, attachFileToNote, file, deleteFileFromNote } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { Icon } from "@rneui/themed";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import quickWarnAlert from "../util/quickWarnAlert";

type buttonProps = {
	onclick: () => void;
	name: string;
	style?: any;
};
const BottomBarButton = ({ onclick, name, style }: buttonProps) => {
	const mainStyle = getAppTheme();

	return (
		<TouchableOpacity
			onPress={onclick}
			style={[
				styles.invertedNote,
				{ flex: 1, backgroundColor: mainStyle.color, justifyContent: "center" },
				style,
			]}
		>
			<Icon name={name} type={"font-awesome"} size={24} color={mainStyle.backgroundColor} />
		</TouchableOpacity>
	);
};

type fileSampleProps = { note_id: number; index: number; full: boolean; data: file; name: string };
const FileSample = ({ index, note_id, data: { uri, type, id }, name }: fileSampleProps) => {
	let [selected, setSelected] = useState(false);
	let store = useStore();

	console.log;
	return (
		<TouchableOpacity
			key={index}
			style={{
				flex: 1,
				height: 128,
				marginRight: 8,
				aspectRatio: 1,
				justifyContent: "center",
			}}
			activeOpacity={0.5}
			onLongPress={() => {
				Vibration.vibrate(50);
				setSelected(true);
			}}
		>
			{selected ? (
				<View
					style={{
						flex: 1,
					}}
				>
					<BottomBarButton
						style={{ margin: 0, marginBottom: 4 }}
						onclick={() =>
							quickWarnAlert(
								() => store.dispatch(deleteFileFromNote({ file_id: id, note_id })),
								"no ten tam, ten no, no???"
							)
						}
						name={"trash"}
					/>
					<BottomBarButton
						style={{ margin: 0, marginTop: 4 }}
						onclick={() => setSelected(false)}
						name={"undo"}
					/>
				</View>
			) : (
				<View
					style={{
						backgroundColor: "black",
						flex: 1,
						justifyContent: "center",
						borderRadius: 8,
					}}
				>
					{type === "image" ? (
						<Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: 8 }} />
					) : (
						<Icon name={"file"} type={"font-awesome"} size={24} color={"white"} />
					)}

					{type === "image" ? undefined : (
						<Text
							style={[
								{
									elevation: 0.1,
									position: "absolute",
									bottom: 16,
									fontSize: 12,
									width: "100%",
									textAlign: "center",
									color: "white",
								},
							]}
						>
							{/* todo: cleaner maybe */}
							{name.substring(0, 15) === name ? name : name.substring(0, 15) + "..."}
						</Text>
					)}
				</View>
			)}
		</TouchableOpacity>
	);
};

const Tab = createMaterialTopTabNavigator();

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
	const selected_note = todos.find((value) => value.id === props.selected_id)!;
	const store = useStore();

	let header = selected_note?.header;
	let text = selected_note?.text;
	let files = selected_note.files;

	return (
		<View style={[styles.pageContainer, mainStyle]}>
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 4, padding: 8, flex: 1 }]}>
					<TextInput
						style={[mainStyle, styles.header]}
						placeholder={"Header"}
						placeholderTextColor={"grey"}
						onChangeText={(new_header) => (header = new_header)}
						defaultValue={header}
					/>
					<TextInput
						style={[mainStyle, { width: "100%", flex: 100 }]}
						multiline={true}
						placeholder={"Text"}
						placeholderTextColor={"grey"}
						textAlignVertical={"top"}
						onChangeText={(new_text) => (text = new_text)}
						defaultValue={text}
					/>
					<Text style={[mainStyle, { marginBottom: 8 }]}>{files.length} files attached</Text>
					{files.length > 0 ? (
						<FlatList
							data={files}
							horizontal={true}
							style={{ height: 128, width: "100%" }}
							renderItem={({ item, index }) => {
								return (
									<FileSample
										note_id={selected_note.id}
										full={false}
										index={index}
										data={item}
										name={item.name}
									/>
								);
							}}
						/>
					) : undefined}
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
				<BottomBarButton
					onclick={() => {
						console.log("Copy pressed");
					}}
					name={"copy"}
				/>

				<BottomBarButton
					onclick={async () => {
						console.log("File pressed");
						let result = await DocumentPicker.getDocumentAsync();
						if (result.type === "cancel") return;
						store.dispatch(
							attachFileToNote({
								id: selected_note.id,
								file: {
									uri: result.uri,
									name: result.name,
									type: result.mimeType?.includes("image") ? "image" : "unknown",
								},
							})
						);
					}}
					name={"file"}
				/>

				<BottomBarButton
					onclick={async () => {
						console.log("Image pressed");
						let result = await ImagePicker.launchImageLibraryAsync();
						if (result.cancelled) return;
						store.dispatch(
							attachFileToNote({
								id: selected_note.id,
								file: { uri: result.uri, type: "image", name: result.fileName || "image" },
							})
						);
					}}
					name={"image"}
				/>
			</View>
		</View>
	);
}
