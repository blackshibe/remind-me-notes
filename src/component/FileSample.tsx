import React, { useState } from "react";
import { Vibration } from "react-native";
import { useStore } from "react-redux";
import { image, deleteFileFromNote, openImage, deleteFileFromReminder } from "../store";
import quickWarnAlert from "../util/quickWarnAlert";
import { BottomBarButton } from "./BottomBarButton";
import { Image } from "react-native";
import { TouchableOpacity, View } from "../style/customComponents";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type fileSampleProps = { note_id: number; index: number; type: string; full: boolean; data: image };
export const FileSample = ({ index, note_id, data, type }: fileSampleProps) => {
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
							quickWarnAlert(() => {
								if (type === "note") {
									store.dispatch(deleteFileFromNote({ file_id: data.id, note_id }));
								} else {
									store.dispatch(deleteFileFromReminder({ file_id: data.id, note_id }));
								}
							}, "Do you want to delete this file?")
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
				<Animated.View
					style={{
						backgroundColor: "black",
						flex: 1,
						justifyContent: "center",
						borderRadius: 8,
					}}
				>
					<Animated.Image
						entering={FadeIn}
						source={{ uri: data.uri }}
						style={{ width: "100%", height: "100%", borderRadius: 8 }}
					/>
				</Animated.View>
			)}
		</TouchableOpacity>
	);
};
