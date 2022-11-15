import React, { useState } from "react";
import { Vibration } from "react-native";
import { useStore } from "react-redux";
import quickWarnAlert from "../util/quickWarnAlert";
import { BottomBarButton } from "./BottomBarButton";
import { TouchableOpacity, View } from "../style/customComponents";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import getAppTheme from "../style/styles";
import { deleteFile, image, openImage, pinFile } from "../store";

type fileSampleProps = { note_id: number; index: number; type: string; full: boolean; data: image };
export const FileSample = ({ index, note_id, data, type }: fileSampleProps) => {
	let [selected, setSelected] = useState(false);
	const mainStyle = getAppTheme();
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
						style={{ margin: 0 }}
						onclick={() => {
							store.dispatch(pinFile({ file_id: data.id, note_id }));
							setSelected(false);
						}}
						name={"star"}
					/>
					<BottomBarButton
						style={{ margin: 0, marginBottom: 4, marginTop: 4 }}
						onclick={() =>
							quickWarnAlert(() => {
								store.dispatch(deleteFile({ file_id: data.id, note_id }));
							}, "Do you want to delete this file?")
						}
						name={"trash"}
					/>
					<BottomBarButton style={{ margin: 0 }} onclick={() => setSelected(false)} name={"undo"} />
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
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 8,
							borderWidth: 2,
							borderColor: mainStyle.color,
						}}
					/>
				</Animated.View>
			)}
		</TouchableOpacity>
	);
};
