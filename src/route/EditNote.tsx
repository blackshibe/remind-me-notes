import React, { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import {
	AppStoreState,
	editNote,
	openNote,
	attachFileToNote,
	pickReminderDate,
	editReminder,
	reminder,
	note,
	openImage,
} from "../store";
import getAppTheme, { styles } from "../style/styles";
import { Icon } from "@rneui/themed";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import quickWarnAlert from "../util/quickWarnAlert";
import useBackButton from "../util/useBackButton";
import { getAccurateConvenientTime, getConvenientDate } from "../util/getConvenientTime";
import { updateNotification } from "../util/updateNotification";
import { BottomBarButton } from "../component/BottomBarButton";
import { FileSample } from "../component/FileSample";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { Dimensions, FlatList, Modal, Image } from "react-native";
import { TouchableOpacity, View, Text, TextInput } from "../style/customComponents";
import ImageZoom from "react-native-image-pan-zoom";

// type buttonProps = {
// 	onclick: () => void;
// 	name: string;
// 	style?: any;
// };
// const BottomBarButton = ({ onclick, name, style }: buttonProps) => {
// 	const mainStyle = getAppTheme();

// 	return (
// 		<TouchableOpacity
// 			onPress={onclick}
// 			style={[
// 				styles.invertedNote,
// 				{ flex: 1, backgroundColor: mainStyle.color, justifyContent: "center" },
// 				style,
// 			]}
// 		>
// 			<Icon name={name} type={"font-awesome"} size={24} color={mainStyle.backgroundColor} />
// 		</TouchableOpacity>
// 	);
// };

// type fileSampleProps = { note_id: number; index: number; full: boolean; data: file; name: string };
// const FileSample = ({ index, note_id, data: { uri, type, id }, name }: fileSampleProps) => {
// 	let [selected, setSelected] = useState(false);
// 	let store = useStore();

// 	console.log;
// 	return (
// 		<TouchableOpacity
// 			key={index}
// 			style={{
// 				flex: 1,
// 				height: 128,
// 				marginRight: 8,
// 				aspectRatio: 1,
// 				justifyContent: "center",
// 			}}
// 			activeOpacity={0.5}
// 			onLongPress={() => {
// 				Vibration.vibrate(50);
// 				setSelected(true);
// 			}}
// 		>
// 			{selected ? (
// 				<View
// 					style={{
// 						flex: 1,
// 					}}
// 				>
// 					<BottomBarButton
// 						style={{ margin: 0, marginBottom: 4 }}
// 						onclick={() =>
// 							quickWarnAlert(
// 								() => store.dispatch(deleteFileFromNote({ file_id: id, note_id })),
// 								"no ten tam, ten no, no???"
// 							)
// 						}
// 						name={"trash"}
// 					/>
// 					<BottomBarButton
// 						style={{ margin: 0, marginTop: 4 }}
// 						onclick={() => setSelected(false)}
// 						name={"undo"}
// 					/>
// 				</View>
// 			) : (
// 				<View
// 					style={{
// 						backgroundColor: "black",
// 						flex: 1,
// 						justifyContent: "center",
// 						borderRadius: 8,
// 					}}
// 				>
// 					{type === "image" ? (
// 						<Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: 8 }} />
// 					) : (
// 						<Icon name={"file"} type={"font-awesome"} size={24} color={"white"} />
// 					)}

// 					{type === "image" ? undefined : (
// 						<Text
// 							style={[
// 								{
// 									elevation: 0.1,
// 									position: "absolute",
// 									bottom: 16,
// 									fontSize: 12,
// 									width: "100%",
// 									textAlign: "center",
// 									color: "white",
// 								},
// 							]}
// 						>
// 							{/* todo: cleaner maybe */}
// 							{name.substring(0, 15) === name ? name : name.substring(0, 15) + "..."}
// 						</Text>
// 					)}
// 				</View>
// 			)}
// 		</TouchableOpacity>
// 	);
// };

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function EditNote(props: { selected_id: number; type: "note" | "reminder"; navigation: any }) {
	const mainStyle = getAppTheme();
	const todos = useSelector((state: AppStoreState) => state.notes);
	const reminders = useSelector((state: AppStoreState) => state.reminders);

	// FIXME shitshow
	const selectedNote: note | reminder =
		props.type === "note"
			? todos.find((value) => value.id === props.selected_id)!
			: reminders.find((value) => value.id === props.selected_id)!;

	const store = useStore<AppStoreState>();
	const selectedImage = useSelector((state: AppStoreState) => state.selected_image);

	let header = selectedNote?.header;
	let text = selectedNote?.text;
	let files = selectedNote.files;

	// @ts-ignore
	// Typescript gets confused with overloading
	let dueDate = new Date(selectedNote?.due_time);

	// useBackButton(
	// 	props,
	// 	() => {
	// 		if (selectedImage) {
	// 			store.dispatch(openImage());
	// 			return;
	// 		}

	// 		if (props.type === "note") {
	// 			store.dispatch(editNote({ id: props.selected_id, header, text }));
	// 			store.dispatch(openNote());
	// 		} else {
	// 			updateNotification(store, selectedNote as reminder);

	// 			store.dispatch(editReminder({ id: props.selected_id, text }));
	// 			store.dispatch(openNote());
	// 		}
	// 	},
	// 	[selectedImage]
	// );

	if (selectedImage)
		return (
			// @ts-ignore
			// typescript is wrong here again
			<ImageZoom
				style={{ width: "100%", height: "100%" }}
				cropWidth={Dimensions.get("window").width}
				cropHeight={Dimensions.get("window").height}
				imageWidth={selectedImage.width}
				imageHeight={selectedImage.height}
			>
				<Image
					style={{ width: 200, height: 200 }}
					source={{
						uri: selectedImage.uri,
					}}
				/>
			</ImageZoom>
		);

	return (
		<View style={styles.pageContainer}>
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 4, padding: 8, flex: 1 }]}>
					{props.type === "note" ? (
						<TextInput
							style={styles.header}
							placeholder={"Header"}
							placeholderTextColor={"grey"}
							onChangeText={(new_header) => (header = new_header)}
							defaultValue={header}
						/>
					) : (
						<TouchableOpacity
							style={styles.header}
							onPress={() => {
								store.dispatch(pickReminderDate({ type: "date", id: props.selected_id }));
							}}
						>
							<Text style={[mainStyle, styles.header]}>Due {getConvenientDate(dueDate)}</Text>
							<Text style={[mainStyle, { color: "grey" }]}>
								due by {dueDate.toLocaleDateString()} @ {getAccurateConvenientTime(dueDate)},{" "}
								{weekday[dueDate.getDay()]}
							</Text>
						</TouchableOpacity>
					)}

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
								return <FileSample note_id={selectedNote.id} full={false} index={index} data={item} />;
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
						console.log("Image pressed");
						let result = await ImagePicker.launchImageLibraryAsync();
						if (result.cancelled) return;
						store.dispatch(
							attachFileToNote({
								id: selectedNote.id,
								file: {
									uri: result.uri,
									height: result.height,
									width: result.width,
								},
							})
						);
					}}
					name={"image"}
				/>
			</View>
		</View>
	);
}
