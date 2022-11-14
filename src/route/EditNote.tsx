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
	attachFileToReminder,
} from "../store";
import getAppTheme, { styles } from "../style/styles";
import * as ImagePicker from "expo-image-picker";
import useBackButton from "../util/useBackButton";
import { getConvenientDate, getConvenientTime } from "../util/getConvenientTime";
import { updateNotification } from "../util/updateNotification";
import { BottomBarButton } from "../component/BottomBarButton";
import { FileSample } from "../component/FileSample";
import { Dimensions, FlatList, Modal, Image } from "react-native";
import { TouchableOpacity, View, Text, TextInput } from "../style/customComponents";
import ImageZoom from "react-native-image-pan-zoom";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { fadeOut } from "react-navigation-transitions";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type editNoteProps =
	| { selected_id: number; type: "reminder"; navigation: any }
	| { selected_id: number; type: "note"; navigation: any };

export default function EditNote(props: editNoteProps) {
	const mainStyle = getAppTheme();
	const todos = useSelector((state: AppStoreState) => state.notes);
	const reminders = useSelector((state: AppStoreState) => state.reminders);
	const navigation = useNavigation();
	const timeFormat = useSelector((state: AppStoreState) => state.time_format);

	const selectedNote =
		props.type === "note"
			? todos?.find((value) => value.id === props.selected_id)!
			: reminders?.find((value) => value.id === props.selected_id)!;

	const store = useStore<AppStoreState>();
	const selectedImage = useSelector((state: AppStoreState) => state.selected_image);

	let header = selectedNote?.header;
	let text = selectedNote?.text;
	let files = selectedNote.files;

	let dueDate = new Date((selectedNote as reminder).due_time);
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

			if (props.type === "reminder") updateNotification(store, selectedNote as reminder);
		},
		[selectedImage]
	);

	return (
		<View style={styles.pageContainer}>
			{selectedImage ? (
				<ImageZoom
					// @ts-ignore typescript is wrong here again
					style={[mainStyle, { width: "100%", height: "100%" }]}
					cropWidth={Dimensions.get("window").width}
					cropHeight={Dimensions.get("window").height}
					imageWidth={Dimensions.get("window").width}
					imageHeight={Dimensions.get("window").height}
				>
					<Animated.Image
						entering={FadeIn}
						exiting={FadeOut}
						style={{
							width: Dimensions.get("window").width,
							height: Dimensions.get("window").height,
							resizeMode: "contain",
						}}
						source={{
							uri: selectedImage.uri,
						}}
					/>
				</ImageZoom>
			) : undefined}
			<View style={{ flex: 1, width: "100%", marginTop: 8 }}>
				<View style={[{ margin: 4, padding: 8, flex: 1 }]}>
					{props.type === "note" ? (
						<TextInput
							style={styles.header}
							placeholder={"Header"}
							placeholderTextColor={"grey"}
							onChangeText={(new_header) => {
								header = new_header;
								store.dispatch(editNote({ id: props.selected_id, header, text }));
							}}
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
							if (props.type === "reminder")
								store.dispatch(editReminder({ id: props.selected_id, text }));
							else store.dispatch(editNote({ id: props.selected_id, text }));
						}}
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
										note_id={selectedNote.id}
										type={props.type}
										full={false}
										index={index}
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
				<BottomBarButton
					onclick={() => {
						console.log("Copy pressed");
					}}
					name={"copy"}
				/>

				<BottomBarButton
					onclick={async () => {
						let result = await ImagePicker.launchImageLibraryAsync();
						if (result.cancelled) return;

						if (props.type === "note") {
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
						} else {
							store.dispatch(
								attachFileToReminder({
									id: selectedNote.id,
									file: {
										uri: result.uri,
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
