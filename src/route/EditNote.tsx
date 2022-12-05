import React, { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import {
	AppStoreState,
	editNote,
	openNote,
	attachFile,
	pickReminderDate,
	editReminder,
	openImage,
	pinFile,
	reminder,
	selectNote,
	beginFileUpload,
	finishFileUpload,
} from "../module/app_store";
import getAppTheme, { styles } from "../style/styles";
import * as ImagePicker from "expo-image-picker";
import useBackButton from "../util/useBackButton";
import { getConvenientDate, getConvenientTime } from "../util/getConvenientTime";
import { updateNotification } from "../util/updateNotification";
import { BottomBarButton } from "../component/BottomBarButton";
import { FileSample } from "../component/FileSample";
import { FlatList, ToastAndroid } from "react-native";
import { TouchableOpacity, View, Text, TextInput } from "../style/customComponents";
import { useNavigation } from "@react-navigation/native";
import { ImageView } from "../component/ImageView";
import { ref, uploadString } from "firebase/storage";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../module/firebase";
import { upload_local_image } from "../module/images";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type editNoteProps = { navigation: any } | { navigation: any };

function uuid() {
	return "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, (c) => {
		const r = Math.floor(Math.random() * 16);
		return r.toString(16);
	});
}

export default function EditNote(props: editNoteProps) {
	const mainStyle = getAppTheme();
	const notes = useSelector((state: AppStoreState) => state.notes);
	const navigation = useNavigation();
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);
	const selectedNoteData = useSelector((state: AppStoreState) => state.selected_note)!;
	const selectedNote = notes?.find((value) => value.id === selectedNoteData?.id)!;

	const store = useStore<AppStoreState>();
	const selectedImage = useSelector((state: AppStoreState) => state.selected_image);

	useEffect(() => {
		if (!selectedNote) {
			store.dispatch(openNote(undefined));
		}
	}, []);

	if (!selectedNote) return <></>;

	let header = selectedNote.header;
	let text = selectedNote.text;
	let files = selectedNote.files || [];

	let dueDate = selectedNote.type === "reminder" ? new Date(selectedNote.due_time) : new Date();
	let preventDefaultNavigate = false;

	useEffect(() => {
		let disconnect = navigation.addListener("beforeRemove", (e) => {
			if (preventDefaultNavigate) e.preventDefault();
		});

		return () => disconnect();
	});

	useBackButton(
		props.navigation,
		() => {
			preventDefaultNavigate = selectedImage !== undefined;
			if (preventDefaultNavigate) {
				store.dispatch(openImage());
				return;
			}

			if (selectedNoteData?.type === "reminder") updateNotification(store, selectedNote as reminder);
		},
		[selectedImage]
	);

	return (
		<View style={styles.pageContainer}>
			{selectedImage && (
				<ImageView
					note_id={selectedNote.id}
					unselect={() => {
						store.dispatch(openImage());
					}}
					selectedImage={selectedImage}
				/>
			)}
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 4, padding: 8, flex: 1 }]}>
					{selectedNote.type === "note" ? (
						<TextInput
							style={styles.header}
							placeholder={"Header"}
							placeholderTextColor={"grey"}
							onChangeText={(new_header) => {
								header = new_header;
								store.dispatch(editNote({ id: selectedNoteData.id, header, text }));
							}}
							defaultValue={header}
						/>
					) : (
						<TouchableOpacity
							style={styles.header}
							onPress={() => {
								store.dispatch(pickReminderDate({ type: "date", id: selectedNoteData.id }));
							}}
						>
							<Text style={[mainStyle, styles.header]}>Due {getConvenientDate(dueDate)}</Text>
							<Text style={[mainStyle, { color: "grey" }]}>
								due by {dueDate.toLocaleDateString()} @ {getConvenientTime(timeFormat, dueDate)},{" "}
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
						onChangeText={(new_text) => {
							text = new_text;
							if (selectedNoteData.type === "reminder")
								store.dispatch(editReminder({ id: selectedNoteData.id, text }));
							else store.dispatch(editNote({ id: selectedNoteData.id, text }));
						}}
						defaultValue={text}
					/>
					<Text style={[mainStyle, { marginBottom: 8 }]}>{files.length} files attached</Text>
					{files.length > 0 ? (
						<FlatList
							data={files}
							horizontal={true}
							keyExtractor={(item, index) => item.name}
							style={{ height: 128, width: "100%" }}
							renderItem={({ item, index }) => {
								return (
									<FileSample
										noteId={selectedNote.id}
										type={selectedNoteData.type}
										full={false}
										index={item.name}
										data={item}
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
				{selectedNote.pinned_image && (
					<BottomBarButton
						onclick={() => {
							store.dispatch(
								pinFile({
									noteId: selectedNote.id,
									imageName: undefined,
								})
							);
						}}
						name={"star-half"}
					/>
				)}

				<BottomBarButton
					onclick={async () => {
						let result = await ImagePicker.launchImageLibraryAsync({
							allowsEditing: true,
							allowsMultipleSelection: false,
							base64: true,
						});

						if (result.cancelled) return;
						if (result.type === "video") return;
						if (!result.base64) return;

						const image_uri = `images/${uuid()}-${uuid()}-${result.fileName || "unknown"}`;
						upload_local_image(image_uri, result.base64);

						if (FIREBASE_AUTH.currentUser) {
							ToastAndroid.show("Uploading image...", ToastAndroid.SHORT);
							const imageRef = ref(FIREBASE_STORAGE, `${FIREBASE_AUTH.currentUser.uid}/${image_uri}`);

							let file = {
								uri: image_uri,
								height: result.height,
								width: result.width,
							};

							store.dispatch(
								beginFileUpload({
									noteId: selectedNote.id,
									file,
								})
							);

							let element = `data:image/jpeg;base64,${result.base64}`;
							uploadString(imageRef, element)
								.then((snapshot) => {
									ToastAndroid.show("Finished uploading!", ToastAndroid.SHORT);

									store.dispatch(
										finishFileUpload({
											noteId: selectedNote.id,
											file,
										})
									);
								})
								.catch((err) => {
									console.log("error while uploading string: ", err);
								});
						} else {
							store.dispatch(
								attachFile({
									id: selectedNote.id,
									file: {
										uri: image_uri,
										height: result.height,
										width: result.width,
									},
								})
							);
						}
					}}
					name={"image"}
				/>
			</View>
		</View>
	);
}
