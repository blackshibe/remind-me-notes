import React, { useState } from "react";
import { Vibration } from "react-native";
import { useStore } from "react-redux";
import { image, deleteFileFromNote, openImage } from "../store";
import quickWarnAlert from "../util/quickWarnAlert";
import { BottomBarButton } from "./BottomBarButton";
import { Icon } from "@rneui/themed";
import { FlatList, Image, TextInput } from "react-native";
import { TouchableOpacity, View, Text } from "../style/customComponents";

type fileSampleProps = { note_id: number; index: number; full: boolean; data: image };
export const FileSample = ({ index, note_id, data }: fileSampleProps) => {
	let [selected, setSelected] = useState(false);
	let store = useStore();

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
			onPress={() => store.dispatch(openImage(data))}
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
								() => store.dispatch(deleteFileFromNote({ file_id: data.id, note_id })),
								"Do you want to delete this file?"
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
					<Image source={{ uri: data.uri }} style={{ width: "100%", height: "100%", borderRadius: 8 }} />
				</View>
			)}
		</TouchableOpacity>
	);
};
