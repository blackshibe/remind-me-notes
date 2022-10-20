import React, { createRef, useEffect, useState } from "react";

import {
	BackHandler,
	Image,
	ScrollView,
	Text,
	TextInput,
	TextInputBase,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, editNote, openNote, note, deleteNote } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { Icon } from "@rneui/themed";
import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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

type imageEditorProps = { index: number; full: boolean; data: { uri: string; ratio: number } };
const ImageEditor = ({ index, full, data: { uri, ratio } }: imageEditorProps) => {
	let [selected, setSelected] = useState(false);

	return (
		<TouchableOpacity
			key={index}
			style={
				full
					? {
							width: "100%",
							aspectRatio: ratio,
							borderRadius: 8,
					  }
					: {
							flex: 1,
							justifyContent: "center",
					  }
			}
			activeOpacity={0.9}
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
						onclick={() => {
							Alert.alert("Delete warning", "Delete the image?", [
								{
									text: "Cancel",
									style: "cancel",
								},
								{
									text: "OK",
									onPress: () => {
										console.log("delete");
									},
								},
							]);
						}}
						name={"trash"}
					/>
					<BottomBarButton
						style={{ margin: 0, marginTop: 4 }}
						onclick={() => setSelected(false)}
						name={"undo"}
					/>
				</View>
			) : (
				<Image
					source={{ uri }}
					style={{
						resizeMode: "contain",
						flex: 1,
					}}
				/>
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
	const selected_note = todos.find((value) => value.id === props.selected_id);
	const store = useStore();

	let header = selected_note?.header;
	let text = selected_note?.text;

	let [rid, setrid] = useState(0);
	let [images, set_images] = useState<{ uri: string; ratio: number }[]>([]);
	console.log(images);
	console.log(images[0]?.ratio);

	const image = () => {
		if (images.length === 0) return;
		else if (images.length === 1) return <ImageEditor full={true} index={0} data={images[0]} />;
		else
			return (
				<View style={{ backgroundColor: "green", width: "100%", height: 350 }}>
					<Tab.Navigator
						showPageIndicator={true}
						screenOptions={({ route }) => ({
							tabBarShowIcon: false,
							tabBarShowLabel: false,
							tabBarStyle: [{ height: 0 }],
						})}
					>
						{images.map((value, index) => (
							<Tab.Screen
								name={index.toString()}
								component={() => <ImageEditor full={false} index={index} data={value} />}
							/>
						))}
					</Tab.Navigator>
				</View>
			);
	};

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
					{image()}
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
					onclick={() => {
						Alert.alert("Delete warning", "Delete this note?", [
							{
								text: "Cancel",
								style: "cancel",
							},
							{
								text: "OK",
								onPress: () => {
									store.dispatch(deleteNote(props.selected_id));
									props.navigation.navigate("Main");
								},
							},
						]);
					}}
					name={"trash"}
				/>
				<BottomBarButton
					onclick={async () => {
						console.log("Image pressed");
						let result = await ImagePicker.launchImageLibraryAsync({
							allowsEditing: true,
						});
						if (result.cancelled) return;
						console.log("Set");
						images.push({ uri: result.uri, ratio: result.width / result.height });
						set_images(images);
						setrid(rid + 1);
					}}
					name={"image"}
				/>
			</View>
		</View>
	);
}
